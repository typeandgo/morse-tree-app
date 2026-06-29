import {
  ALHPABET,
  type AlphabetEntry,
  type AlphabetKey,
} from "@/constants/main.constants";

const KEY_TO_NODE_ID: Record<string, string> = {
  key0: "key0",
  keyA: "p-A", keyB: "p-B", keyC: "p-C", keyD: "p-D", keyE: "p-E",
  keyF: "p-F", keyG: "p-G", keyH: "p-H", keyI: "p-I", keyJ: "p-J",
  keyK: "p-K", keyL: "p-L", keyM: "p-M", keyN: "p-N", keyO: "p-0",
  keyP: "p-P", keyQ: "p-Q", keyR: "p-R", keyS: "p-S", keyT: "p-T",
  keyU: "p-U", keyV: "p-V", keyW: "p-W", keyX: "p-X", keyY: "p-Y",
  keyZ: "p-Z",
};

const MORSE_CODE_MAP = new Map<string, { entry: AlphabetEntry; alphabetKey: AlphabetKey }>(
  (Object.keys(ALHPABET) as AlphabetKey[]).map((alphabetKey) => [
    ALHPABET[alphabetKey].morseCode,
    { entry: ALHPABET[alphabetKey], alphabetKey },
  ]),
);

export function findByMorseCode(code: string): {
  entry: AlphabetEntry;
  alphabetKey: AlphabetKey;
} | null {
  return MORSE_CODE_MAP.get(code) ?? null;
}

export type PathSegment =
  | { type: "antenna" }
  | { type: "line"; lineId: string }
  | { type: "node"; nodeId: string };

export function buildPathSegments(
  entry: AlphabetEntry,
  alphabetKey: AlphabetKey,
): PathSegment[] {
  const segments: PathSegment[] = [{ type: "antenna" }];

  entry.prevLines.forEach((lineId, index) => {
    segments.push({ type: "line", lineId });
    const keyAfterLine = entry.prevKeys[index + 1];
    if (keyAfterLine && keyAfterLine !== "key0") {
      segments.push({ type: "node", nodeId: KEY_TO_NODE_ID[keyAfterLine] });
    }
  });

  const terminalNodeId = KEY_TO_NODE_ID[alphabetKey];
  const lastSegment = segments[segments.length - 1];
  if (
    lastSegment?.type !== "node" ||
    lastSegment.nodeId !== terminalNodeId
  ) {
    segments.push({ type: "node", nodeId: terminalNodeId });
  }

  return segments;
}

export function segmentsToActiveSets(segments: PathSegment[]): {
  nodeIds: Set<string>;
  lineIds: Set<string>;
  antennaActive: boolean;
} {
  const nodeIds = new Set<string>();
  const lineIds = new Set<string>();
  let antennaActive = false;

  for (const segment of segments) {
    if (segment.type === "antenna") {
      antennaActive = true;
    } else if (segment.type === "line") {
      lineIds.add(segment.lineId);
    } else {
      nodeIds.add(segment.nodeId);
    }
  }

  return { nodeIds, lineIds, antennaActive };
}
