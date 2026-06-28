export const CODE_TYPES = {
  DOT: "DOT",
  DASH: "DASH",
} as const;

export type CodeType = (typeof CODE_TYPES)[keyof typeof CODE_TYPES];

export type AlphabetEntry = {
  key: string;
  morseCode: string;
  codeType: CodeType;
  prevKeys: string[];
  prevLines: string[];
};

export type AlphabetKey =
  | "keyA" | "keyB" | "keyC" | "keyD" | "keyE" | "keyF" | "keyG"
  | "keyH" | "keyI" | "keyJ" | "keyK" | "keyL" | "keyM" | "keyN"
  | "keyO" | "keyP" | "keyQ" | "keyR" | "keyS" | "keyT" | "keyU"
  | "keyV" | "keyW" | "keyX" | "keyY" | "keyZ";

export const ALHPABET: Record<AlphabetKey, AlphabetEntry> = {
  keyA: { key: "A", morseCode: ".-", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyE"], prevLines: ["l0E", "lEA"] },
  keyB: { key: "B", morseCode: "-...", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyT", "keyN", "keyD"], prevLines: ["l0T", "lTN", "lND", "lDB"] },
  keyC: { key: "C", morseCode: "-.-.", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyT", "keyN", "keyK"], prevLines: ["l0T", "lTN", "lNK", "lKC"] },
  keyD: { key: "D", morseCode: "-..", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyT", "keyN"], prevLines: ["l0T", "lTN", "lND"] },
  keyE: { key: "E", morseCode: ".", codeType: CODE_TYPES.DOT, prevKeys: ["key0"], prevLines: ["l0E"] },
  keyF: { key: "F", morseCode: "..-.", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyE", "keyI", "keyU"], prevLines: ["l0E", "lEI", "lIU", "lUF"] },
  keyG: { key: "G", morseCode: "--.", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyT", "keyM"], prevLines: ["l0T", "lTM", "lMG"] },
  keyH: { key: "H", morseCode: "....", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyE", "keyI", "keyS"], prevLines: ["l0E", "lEI", "lIS", "lSH"] },
  keyI: { key: "I", morseCode: "..", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyE"], prevLines: ["l0E", "lEI"] },
  keyJ: { key: "J", morseCode: ".---", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyE", "keyA", "keyW"], prevLines: ["l0E", "lEA", "lAW", "lWJ"] },
  keyK: { key: "K", morseCode: "-.-", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyT", "keyN"], prevLines: ["l0T", "lTN", "lNK"] },
  keyL: { key: "L", morseCode: ".-..", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyE", "keyA", "keyR"], prevLines: ["l0E", "lEA", "lAR", "lRL"] },
  keyM: { key: "M", morseCode: "--", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyT"], prevLines: ["l0T", "lTM"] },
  keyN: { key: "N", morseCode: "-.", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyT"], prevLines: ["l0T", "lTN"] },
  keyO: { key: "O", morseCode: "---", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyT", "keyM"], prevLines: ["l0T", "lTM", "lMO"] },
  keyP: { key: "P", morseCode: ".--.", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyE", "keyA", "keyW"], prevLines: ["l0E", "lEA", "lAW", "lWP"] },
  keyQ: { key: "Q", morseCode: "--.-", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyT", "keyM", "keyG"], prevLines: ["l0T", "lTM", "lMG", "lGQ"] },
  keyR: { key: "R", morseCode: ".-.", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyE", "keyA"], prevLines: ["l0E", "lEA", "lAR"] },
  keyS: { key: "S", morseCode: "...", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyE", "keyI"], prevLines: ["l0E", "lEI", "lIS"] },
  keyT: { key: "T", morseCode: "-", codeType: CODE_TYPES.DASH, prevKeys: ["key0"], prevLines: ["l0T"] },
  keyU: { key: "U", morseCode: "..-", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyE", "keyI"], prevLines: ["l0E", "lEI", "lIU"] },
  keyV: { key: "V", morseCode: "...-", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyE", "keyI", "keyS"], prevLines: ["l0E", "lEI", "lIS", "lSV"] },
  keyW: { key: "W", morseCode: ".--", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyE", "keyA"], prevLines: ["l0E", "lEA", "lAW"] },
  keyX: { key: "X", morseCode: "-..-", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyT", "keyN", "keyD"], prevLines: ["l0T", "lTN", "lND", "lDX"] },
  keyY: { key: "Y", morseCode: "-.--", codeType: CODE_TYPES.DASH, prevKeys: ["key0", "keyT", "keyN", "keyK"], prevLines: ["l0T", "lTN", "lNK", "lKY"] },
  keyZ: { key: "Z", morseCode: "--..", codeType: CODE_TYPES.DOT, prevKeys: ["key0", "keyT", "keyM", "keyG"], prevLines: ["l0T", "lTM", "lMG", "lGZ"] },
};
