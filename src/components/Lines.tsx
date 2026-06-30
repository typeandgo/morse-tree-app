import { StyleSheet, View } from "react-native";
import { useMorseGameContext } from "@/context/MorseGameContext";
import { THEME } from "@/constants/theme";

type LineConfig = {
  lineId: string;
  top: number;
  left: number;
  width?: number;
  height?: number;
  isVertical: boolean;
};

const LINES: LineConfig[] = [
  // Horizontal lines — extended 2px into each node to eliminate sub-pixel gaps
  { lineId: "l0T",  top: 115, left: 150, width: 29,  isVertical: false }, // +2 into T right
  { lineId: "l0E",  top: 115, left: 176, width: 25,  isVertical: false }, // +2 into E left
  { lineId: "lTM",  top: 115, left: 99,  width: 24,  isVertical: false }, // +2 into M/T
  { lineId: "lMO",  top: 115, left: 49,  width: 24,  isVertical: false }, // +2 into O/M
  { lineId: "lEI",  top: 115, left: 219, width: 24,  isVertical: false }, // +2 into E/I (was 0px)
  { lineId: "lIS",  top: 115, left: 259, width: 24,  isVertical: false }, // +2 into I/S (was 0px)
  { lineId: "lSH",  top: 115, left: 299, width: 24,  isVertical: false }, // +2 into S/H (was 0px)
  { lineId: "lGQ",  top: 165, left: 49,  width: 29,  isVertical: false }, // +2 into Q/G (was 0px G)
  { lineId: "lNK",  top: 265, left: 99,  width: 29,  isVertical: false }, // +2 into K/N (was 0px N)
  { lineId: "lKY",  top: 265, left: 49,  width: 24,  isVertical: false }, // +2 into Y/K
  { lineId: "lDX",  top: 365, left: 99,  width: 29,  isVertical: false }, // +2 into X/D (was 0px D)
  { lineId: "lAR",  top: 265, left: 216, width: 27,  isVertical: false }, // +2 into A/R (was 0px)
  { lineId: "lRL",  top: 265, left: 259, width: 24,  isVertical: false }, // +2 into R/L (was 0px)
  { lineId: "lWP",  top: 365, left: 216, width: 27,  isVertical: false }, // +2 into W/P (was 0px)
  // Vertical lines — extended 2px into each node on both ends
  { lineId: "lTN",  top: 121, left: 135, height: 137, isVertical: true },
  { lineId: "lND",  top: 274, left: 135, height: 84,  isVertical: true },
  { lineId: "lDB",  top: 374, left: 135, height: 34,  isVertical: true },
  { lineId: "lMG",  top: 121, left: 85,  height: 37,  isVertical: true },
  { lineId: "lGZ",  top: 174, left: 85,  height: 34,  isVertical: true },
  { lineId: "lKC",  top: 271, left: 85,  height: 37,  isVertical: true },
  { lineId: "lEA",  top: 124, left: 210, height: 129, isVertical: true },
  { lineId: "lAW",  top: 279, left: 210, height: 74,  isVertical: true },
  { lineId: "lWJ",  top: 379, left: 210, height: 24,  isVertical: true },
  { lineId: "lIU",  top: 124, left: 250, height: 29,  isVertical: true },
  { lineId: "lUF",  top: 179, left: 250, height: 29,  isVertical: true },
  { lineId: "lSV",  top: 124, left: 290, height: 29,  isVertical: true },
];

export default function Lines() {
  const { activeLineIds } = useMorseGameContext();

  return (
    <View style={[StyleSheet.absoluteFill]} pointerEvents="none">
      {LINES.map(({ lineId, top, left, width, height, isVertical }) => {
        const active = activeLineIds.has(lineId);
        return (
          <View
            key={lineId}
            style={[
              styles.line,
              isVertical ? styles.lineV : styles.lineH,
              { top, left },
              !isVertical && width != null ? { width } : {},
              isVertical && height != null ? { height } : {},
              active && styles.lineActive,
              active && (isVertical ? styles.glowV : styles.glowH),
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    position: "absolute",
    backgroundColor: THEME.gold,
  },
  lineH: {
    height: 2,
  },
  lineV: {
    width: 2,
  },
  lineActive: {
    backgroundColor: THEME.activeColor,
    zIndex: 3,
  },
  glowH: {
    shadowColor: THEME.activeColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  glowV: {
    shadowColor: THEME.activeColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
});
