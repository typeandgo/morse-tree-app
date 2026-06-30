import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useMorseGameContext } from "@/context/MorseGameContext";
import { THEME } from "@/constants/theme";

type SymbolKind = "dot" | "dashH" | "dashV";

type NodeConfig = {
  letter: string;
  symbol: SymbolKind;
  top: number;
  left: number;
  nodeId: string;
};

const NODES: NodeConfig[] = [
  { letter: "O", symbol: "dashH", top: 100, left: 20,  nodeId: "p-0" },
  { letter: "M", symbol: "dashH", top: 100, left: 70,  nodeId: "p-M" },
  { letter: "T", symbol: "dashH", top: 100, left: 120, nodeId: "p-T" },
  { letter: "E", symbol: "dot",   top: 100, left: 195, nodeId: "p-E" },
  { letter: "I", symbol: "dot",   top: 100, left: 235, nodeId: "p-I" },
  { letter: "S", symbol: "dot",   top: 100, left: 275, nodeId: "p-S" },
  { letter: "H", symbol: "dot",   top: 100, left: 315, nodeId: "p-H" },
  { letter: "Q", symbol: "dashH", top: 150, left: 20,  nodeId: "p-Q" },
  { letter: "G", symbol: "dot",   top: 150, left: 70,  nodeId: "p-G" },
  { letter: "Z", symbol: "dot",   top: 200, left: 70,  nodeId: "p-Z" },
  { letter: "U", symbol: "dashV", top: 150, left: 235, nodeId: "p-U" },
  { letter: "V", symbol: "dashV", top: 150, left: 275, nodeId: "p-V" },
  { letter: "F", symbol: "dot",   top: 200, left: 235, nodeId: "p-F" },
  { letter: "Y", symbol: "dashH", top: 250, left: 20,  nodeId: "p-Y" },
  { letter: "K", symbol: "dashH", top: 250, left: 70,  nodeId: "p-K" },
  { letter: "C", symbol: "dot",   top: 300, left: 70,  nodeId: "p-C" },
  { letter: "N", symbol: "dot",   top: 250, left: 120, nodeId: "p-N" },
  { letter: "A", symbol: "dashV", top: 250, left: 195, nodeId: "p-A" },
  { letter: "R", symbol: "dot",   top: 250, left: 235, nodeId: "p-R" },
  { letter: "L", symbol: "dot",   top: 250, left: 275, nodeId: "p-L" },
  { letter: "X", symbol: "dashH", top: 350, left: 70,  nodeId: "p-X" },
  { letter: "D", symbol: "dot",   top: 350, left: 120, nodeId: "p-D" },
  { letter: "B", symbol: "dot",   top: 400, left: 120, nodeId: "p-B" },
  { letter: "W", symbol: "dashV", top: 350, left: 195, nodeId: "p-W" },
  { letter: "P", symbol: "dot",   top: 350, left: 235, nodeId: "p-P" },
  { letter: "J", symbol: "dashV", top: 400, left: 195, nodeId: "p-J" },
];

const ACTIVE_DURATION = 80;
const FINAL_DURATION = 150;

type NodeItemProps = {
  node: NodeConfig;
  active: boolean;
  isFinal: boolean;
};

const NodeItem = React.memo(
  function NodeItem({ node, active, isFinal }: NodeItemProps) {
    const activeAnim = useSharedValue(active ? 1 : 0);
    const finalAnim = useSharedValue(isFinal ? 1 : 0);

    useEffect(() => {
      activeAnim.value = withTiming(active ? 1 : 0, { duration: ACTIVE_DURATION });
    }, [active, activeAnim]);

    useEffect(() => {
      finalAnim.value = withTiming(isFinal ? 1 : 0, { duration: FINAL_DURATION });
    }, [isFinal, finalAnim]);

    const symbolAnimStyle = useAnimatedStyle(() => ({
      borderColor: interpolateColor(
        activeAnim.value,
        [0, 1],
        [THEME.gold, THEME.activeColor],
      ),
      backgroundColor: interpolateColor(
        activeAnim.value,
        [0, 1],
        [`${THEME.activeColor}33`, THEME.activeColor],
      ),
      shadowOpacity: interpolate(activeAnim.value, [0, 1], [0, 0.9]),
      shadowRadius: interpolate(activeAnim.value, [0, 1], [0, 8]),
    }));

    const labelAnimStyle = useAnimatedStyle(() => ({
      opacity: interpolate(activeAnim.value, [0, 1], [0.6, 1]),
      color: interpolateColor(
        finalAnim.value,
        [0, 1],
        [THEME.gold, THEME.activeColor],
      ),
      transform: [{ scale: interpolate(finalAnim.value, [0, 1], [1, 1.6]) }],
      textShadowRadius: interpolate(finalAnim.value, [0, 1], [0, 8]),
    }));

    const symbolBase =
      node.symbol === "dot"
        ? styles.dot
        : node.symbol === "dashH"
          ? [styles.dash, styles.dashH]
          : [styles.dash, styles.dashV];

    return (
      <View style={[styles.node, { top: node.top, left: node.left }]}>
        <Animated.View
          style={[
            symbolBase,
            styles.symbolShadowBase,
            symbolAnimStyle,
          ]}
        />
        <Animated.Text style={[styles.label, styles.labelShadowBase, labelAnimStyle]}>
          {node.letter}
        </Animated.Text>
      </View>
    );
  },
  (prev, next) => prev.active === next.active && prev.isFinal === next.isFinal,
);

export default function Nodes() {
  const { activeNodeIds, finalNodeId } = useMorseGameContext();

  return (
    <>
      {NODES.map((node) => (
        <NodeItem
          key={node.nodeId}
          node={node}
          active={activeNodeIds.has(node.nodeId)}
          isFinal={finalNodeId === node.nodeId}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  node: {
    position: "absolute",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
  },
  dash: {
    borderWidth: 3,
    borderRadius: 4,
  },
  dashH: {
    width: 32,
    height: 14,
  },
  dashV: {
    width: 14,
    height: 30,
  },
  symbolShadowBase: {
    shadowOffset: { width: 0, height: 0 },
    shadowColor: THEME.activeColor,
  },
  label: {
    position: "absolute",
    top: -10,
    right: -8,
    fontWeight: "500",
    fontSize: 16,
  },
  labelShadowBase: {
    textShadowColor: THEME.activeColor,
    textShadowOffset: { width: 0, height: 0 },
  },
});
