import { useCallback, useEffect, useRef, useState } from "react";
import type { CodeType } from "@/constants/main.constants";
import { useSettings } from "@/context/SettingsContext";
import {
  buildPathSegments,
  findByMorseCode,
  isLeafAlphabetKey,
  segmentsToActiveSets,
  type PathSegment,
} from "@/lib/morse-mappings";
import { startPressTone, stopPressTone } from "@/lib/morse-audio";
import { pressDurationToSymbol, symbolToChar } from "@/lib/morse-timing";
import {
  getDurationBetweenQueue,
  getDurationEndOfQueue,
  getPathStepMs,
} from "@/lib/morse-settings";

type Phase = "idle" | "typing" | "completing" | "cooldown";

function segmentsEqual(a: PathSegment, b: PathSegment): boolean {
  if (a.type !== b.type) return false;
  if (a.type === "antenna" && b.type === "antenna") return true;
  if (a.type === "line" && b.type === "line") return a.lineId === (b as { type: "line"; lineId: string }).lineId;
  if (a.type === "node" && b.type === "node") return a.nodeId === (b as { type: "node"; nodeId: string }).nodeId;
  return false;
}

export function useMorseGame() {
  const { settings, audioSettings } = useSettings();
  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<CodeType[]>([]);
  const [activeNodeIds, setActiveNodeIds] = useState<Set<string>>(new Set());
  const [activeLineIds, setActiveLineIds] = useState<Set<string>>(new Set());
  const [antennaActive, setAntennaActive] = useState(false);
  const [finalNodeId, setFinalNodeId] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const pressStartRef = useRef<number | null>(null);
  const isPressingRef = useRef(false);
  const queueRef = useRef<CodeType[]>([]);
  const phaseRef = useRef<Phase>("idle");
  const currentSegmentsRef = useRef<PathSegment[]>([]);
  const betweenQueueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endOfQueueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const syncQueueRef = useCallback((next: CodeType[]) => {
    queueRef.current = next;
    setQueue(next);
  }, []);

  const setPhaseSafe = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearAnimationTimers = useCallback(() => {
    animationTimersRef.current.forEach(clearTimeout);
    animationTimersRef.current = [];
  }, []);

  const clearBetweenQueueTimer = useCallback(() => {
    if (betweenQueueTimerRef.current) {
      clearTimeout(betweenQueueTimerRef.current);
      betweenQueueTimerRef.current = null;
    }
  }, []);

  const clearEndOfQueueTimer = useCallback(() => {
    if (endOfQueueTimerRef.current) {
      clearTimeout(endOfQueueTimerRef.current);
      endOfQueueTimerRef.current = null;
    }
  }, []);

  const resetVisualState = useCallback(() => {
    clearAnimationTimers();
    currentSegmentsRef.current = [];
    setActiveNodeIds(new Set());
    setActiveLineIds(new Set());
    setAntennaActive(false);
    setFinalNodeId(null);
  }, [clearAnimationTimers]);

  const fullReset = useCallback(() => {
    clearBetweenQueueTimer();
    clearEndOfQueueTimer();
    resetVisualState();
    syncQueueRef([]);
    setIsDisabled(false);
    setPhaseSafe("idle");
  }, [clearBetweenQueueTimer, clearEndOfQueueTimer, resetVisualState, setPhaseSafe, syncQueueRef]);

  const applySegmentsUpTo = useCallback(
    (segments: PathSegment[], count: number, withFinal: string | null) => {
      const partial = segments.slice(0, count);
      const { nodeIds, lineIds, antennaActive: ant } = segmentsToActiveSets(partial);
      setActiveNodeIds(nodeIds);
      setActiveLineIds(lineIds);
      setAntennaActive(ant);
      setFinalNodeId(withFinal);
    },
    [],
  );

  const applyPathImmediate = useCallback(
    (segments: PathSegment[], withFinal: string | null) => {
      clearAnimationTimers();
      currentSegmentsRef.current = segments;
      applySegmentsUpTo(segments, segments.length, withFinal);
    },
    [applySegmentsUpTo, clearAnimationTimers],
  );

  const animatePathIncremental = useCallback(
    (
      segments: PathSegment[],
      options: { withFinal: string | null; onComplete?: () => void },
    ) => {
      clearAnimationTimers();

      const prev = currentSegmentsRef.current;
      let sharedPrefix = 0;
      while (
        sharedPrefix < prev.length &&
        sharedPrefix < segments.length &&
        segmentsEqual(prev[sharedPrefix], segments[sharedPrefix])
      ) {
        sharedPrefix += 1;
      }

      currentSegmentsRef.current = segments;

      if (sharedPrefix > 0) {
        applySegmentsUpTo(segments, sharedPrefix, null);
      }

      const newSegmentCount = segments.length - sharedPrefix;
      if (newSegmentCount === 0) {
        applySegmentsUpTo(segments, segments.length, options.withFinal);
        options.onComplete?.();
        return;
      }

      for (let i = sharedPrefix; i < segments.length; i++) {
        const timer = setTimeout(() => {
          const isLast = i === segments.length - 1;
          applySegmentsUpTo(segments, i + 1, isLast ? options.withFinal : null);
          if (isLast) {
            options.onComplete?.();
          }
        }, (i - sharedPrefix + 1) * getPathStepMs(settings));
        animationTimersRef.current.push(timer);
      }
    },
    [applySegmentsUpTo, clearAnimationTimers, settings],
  );

  const getMatchForQueue = useCallback((symbols: CodeType[]) => {
    const code = symbols.map(symbolToChar).join("");
    return findByMorseCode(code);
  }, []);

  const getLastValidMatch = useCallback((symbols: CodeType[]) => {
    for (let len = symbols.length; len > 0; len -= 1) {
      const match = getMatchForQueue(symbols.slice(0, len));
      if (match) return match;
    }
    return null;
  }, [getMatchForQueue]);

  const completeQueue = useCallback(() => {
    clearBetweenQueueTimer();
    clearAnimationTimers();
    setPhaseSafe("completing");
    setIsDisabled(true);

    const symbols = queueRef.current;
    const exactMatch = getMatchForQueue(symbols);
    const lastValidMatch = getLastValidMatch(symbols);

    const runCooldown = () => {
      setPhaseSafe("cooldown");
      endOfQueueTimerRef.current = setTimeout(() => {
        fullReset();
      }, getDurationEndOfQueue());
    };

    if (exactMatch) {
      const { entry, alphabetKey } = exactMatch;
      const segments = buildPathSegments(entry, alphabetKey);
      const lastSegment = segments[segments.length - 1];
      const finalId = lastSegment?.type === "node" ? lastSegment.nodeId : null;
      applyPathImmediate(segments, finalId);
    } else if (lastValidMatch) {
      const { entry, alphabetKey } = lastValidMatch;
      const segments = buildPathSegments(entry, alphabetKey);
      applyPathImmediate(segments, null);
    }
    runCooldown();
  }, [
    applyPathImmediate, clearAnimationTimers, clearBetweenQueueTimer,
    fullReset, getLastValidMatch, getMatchForQueue, setPhaseSafe,
  ]);

  const scheduleQueueCompletion = useCallback(() => {
    clearBetweenQueueTimer();
    betweenQueueTimerRef.current = setTimeout(() => {
      completeQueue();
    }, getDurationBetweenQueue(settings));
  }, [clearBetweenQueueTimer, completeQueue, settings]);

  const handleSymbolInput = useCallback(
    (symbol: CodeType) => {
      if (isDisabled || phaseRef.current === "completing" || phaseRef.current === "cooldown") {
        return;
      }

      const nextQueue = [...queueRef.current, symbol];
      syncQueueRef(nextQueue);
      setPhaseSafe("typing");
      const match = getMatchForQueue(nextQueue);
      if (match) {
        const segments = buildPathSegments(match.entry, match.alphabetKey);
        if (isLeafAlphabetKey(match.alphabetKey)) {
          animatePathIncremental(segments, {
            withFinal: null,
            onComplete: () => completeQueue(),
          });
          return;
        }
        animatePathIncremental(segments, { withFinal: null });
      }
      scheduleQueueCompletion();
    },
    [
      animatePathIncremental, completeQueue, getMatchForQueue, isDisabled,
      scheduleQueueCompletion, setPhaseSafe, syncQueueRef,
    ],
  );

  const onPressStart = useCallback(() => {
    if (isDisabled || phaseRef.current === "completing" || phaseRef.current === "cooldown") {
      return;
    }
    if (isPressingRef.current) return;
    startPressTone(audioSettings);
    isPressingRef.current = true;
    pressStartRef.current = Date.now();
  }, [audioSettings, isDisabled]);

  const onPressEnd = useCallback(() => {
    if (!isPressingRef.current || pressStartRef.current === null) return;
    isPressingRef.current = false;
    stopPressTone();

    if (isDisabled || phaseRef.current === "completing" || phaseRef.current === "cooldown") {
      pressStartRef.current = null;
      return;
    }

    const duration = Date.now() - pressStartRef.current;
    pressStartRef.current = null;
    const symbol = pressDurationToSymbol(duration, settings);
    handleSymbolInput(symbol);
  }, [handleSymbolInput, isDisabled, settings]);

  useEffect(() => {
    return () => {
      clearBetweenQueueTimer();
      clearEndOfQueueTimer();
      clearAnimationTimers();
    };
  }, [clearAnimationTimers, clearBetweenQueueTimer, clearEndOfQueueTimer]);

  return {
    phase,
    queue,
    activeNodeIds,
    activeLineIds,
    antennaActive,
    finalNodeId,
    isDisabled,
    onPressStart,
    onPressEnd,
  };
}
