import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CODE_TYPES, type CodeType } from "@/constants/main.constants";
import { useSettings } from "@/context/SettingsContext";
import {
  buildPathSegments,
  findByMorseCode,
  isLeafAlphabetKey,
  MAX_SYMBOL_QUEUE_LENGTH,
  segmentsToActiveSets,
  type PathSegment,
} from "@/lib/morse-mappings";
import { startPressTone, stopPressTone } from "@/lib/morse-audio";
import { pressDurationToSymbol, symbolToChar } from "@/lib/morse-timing";
import {
  getDashMax,
  getDotMax,
  getDurationBetweenQueue,
  getDurationEndOfQueue,
  getPathStepMs,
  type MorseSettings,
} from "@/lib/morse-settings";

type Phase = "idle" | "typing" | "completing" | "cooldown";

// Ghost touch filter: native touch events shorter than this are discarded.
// Scales inversely with WPM (50ms at 10 WPM) so faster senders' short
// intentional taps aren't mistaken for ghost touches.
function getMinPressDurationMs(settings: MorseSettings): number {
  return 500 / settings.wpm;
}

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

  // Synchronous mirror of `isDisabled`: React state updates are batched/async,
  // so a rapid press landing right after setIsDisabled(true) can still see the
  // stale `false` closure value. Guards that must reject same-tick input read
  // this ref instead.
  const isDisabledRef = useRef(false);
  const setDisabledSafe = useCallback((next: boolean) => {
    isDisabledRef.current = next;
    setIsDisabled(next);
  }, []);

  const pressStartRef = useRef<number | null>(null);
  const isPressingRef = useRef(false);
  const queueRef = useRef<CodeType[]>([]);
  const phaseRef = useRef<Phase>("idle");
  const currentSegmentsRef = useRef<PathSegment[]>([]);
  const betweenQueueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endOfQueueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dashAutoReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dashDetectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dashDetectedRef = useRef(false);

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

  const clearDashAutoRelease = useCallback(() => {
    if (dashAutoReleaseTimerRef.current) {
      clearTimeout(dashAutoReleaseTimerRef.current);
      dashAutoReleaseTimerRef.current = null;
    }
  }, []);

  const clearDashDetectTimer = useCallback(() => {
    if (dashDetectTimerRef.current) {
      clearTimeout(dashDetectTimerRef.current);
      dashDetectTimerRef.current = null;
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
    clearDashAutoRelease();
    clearDashDetectTimer();
    resetVisualState();
    syncQueueRef([]);
    setDisabledSafe(false);
    setPhaseSafe("idle");
  }, [
    clearBetweenQueueTimer, clearDashAutoRelease, clearDashDetectTimer,
    clearEndOfQueueTimer, resetVisualState, setDisabledSafe, setPhaseSafe, syncQueueRef,
  ]);

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

  const previewLetter = useMemo(() => {
    const match = getMatchForQueue(queue);
    return match ? match.entry.key : null;
  }, [getMatchForQueue, queue]);

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
    setDisabledSafe(true);

    const symbols = queueRef.current;
    const exactMatch = getMatchForQueue(symbols);
    const lastValidMatch = getLastValidMatch(symbols);

    const runCooldown = () => {
      setPhaseSafe("cooldown");
      endOfQueueTimerRef.current = setTimeout(() => {
        fullReset();
      }, getDurationEndOfQueue(settings));
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
    fullReset, getLastValidMatch, getMatchForQueue, setDisabledSafe, setPhaseSafe, settings,
  ]);

  const scheduleQueueCompletion = useCallback(() => {
    clearBetweenQueueTimer();
    betweenQueueTimerRef.current = setTimeout(() => {
      completeQueue();
    }, getDurationBetweenQueue(settings));
  }, [clearBetweenQueueTimer, completeQueue, settings]);

  const handleSymbolInput = useCallback(
    (symbol: CodeType) => {
      if (
        isDisabledRef.current ||
        phaseRef.current === "completing" ||
        phaseRef.current === "cooldown" ||
        queueRef.current.length >= MAX_SYMBOL_QUEUE_LENGTH
      ) {
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
      animatePathIncremental, completeQueue, getMatchForQueue,
      scheduleQueueCompletion, setPhaseSafe, syncQueueRef,
    ],
  );

  // Core press-end logic shared by manual release and auto-release.
  const triggerPressEnd = useCallback(() => {
    if (!isPressingRef.current || pressStartRef.current === null) return;
    isPressingRef.current = false;
    clearDashAutoRelease();
    clearDashDetectTimer();

    const elapsed = Date.now() - pressStartRef.current;
    pressStartRef.current = null;

    // Symbol was already committed early once the press crossed the dot
    // threshold (see dashDetectTimerRef below) — this release is just the
    // physical finger lifting, so only stop the tone and clean up.
    if (dashDetectedRef.current) {
      dashDetectedRef.current = false;
      stopPressTone(0);
      return;
    }

    // Ghost touch: discard sub-threshold presses without registering a symbol.
    // Real human taps are always longer; ghost touches are typically < 10ms.
    if (elapsed < getMinPressDurationMs(settings)) {
      stopPressTone(0);
      return;
    }

    if (isDisabledRef.current || phaseRef.current === "completing" || phaseRef.current === "cooldown") {
      stopPressTone(0);
      return;
    }

    stopPressTone(Math.max(0, getDotMax(settings) - elapsed));
    const symbol = pressDurationToSymbol(elapsed, settings);
    handleSymbolInput(symbol);
  }, [clearDashAutoRelease, clearDashDetectTimer, handleSymbolInput, settings]);

  const onPressStart = useCallback(() => {
    if (
      isDisabledRef.current ||
      phaseRef.current === "completing" ||
      phaseRef.current === "cooldown" ||
      queueRef.current.length >= MAX_SYMBOL_QUEUE_LENGTH
    ) {
      return;
    }
    if (isPressingRef.current) return;
    clearBetweenQueueTimer();
    startPressTone(audioSettings);
    isPressingRef.current = true;
    pressStartRef.current = Date.now();
    dashDetectedRef.current = false;

    // The instant the hold crosses the dot threshold, the symbol is
    // guaranteed to resolve as a dash — commit it and light the path now
    // instead of waiting for the finger to actually lift. The press tone
    // keeps playing until the real release.
    dashDetectTimerRef.current = setTimeout(() => {
      dashDetectTimerRef.current = null;
      if (!isPressingRef.current) return;
      dashDetectedRef.current = true;
      handleSymbolInput(CODE_TYPES.DASH);
    }, getDotMax(settings) + 1);

    // Safety fallback: force a real release if the physical press somehow
    // never ends (e.g. stuck touch) once it reaches dash max duration.
    dashAutoReleaseTimerRef.current = setTimeout(() => {
      dashAutoReleaseTimerRef.current = null;
      triggerPressEnd();
    }, getDashMax(settings));
  }, [audioSettings, clearBetweenQueueTimer, handleSymbolInput, settings, triggerPressEnd]);

  const onPressEnd = useCallback(() => {
    triggerPressEnd();
  }, [triggerPressEnd]);

  useEffect(() => {
    return () => {
      clearBetweenQueueTimer();
      clearEndOfQueueTimer();
      clearAnimationTimers();
      clearDashAutoRelease();
      clearDashDetectTimer();
    };
  }, [clearAnimationTimers, clearBetweenQueueTimer, clearDashAutoRelease, clearDashDetectTimer, clearEndOfQueueTimer]);

  return {
    phase,
    queue,
    previewLetter,
    activeNodeIds,
    activeLineIds,
    antennaActive,
    finalNodeId,
    isDisabled,
    onPressStart,
    onPressEnd,
  };
}
