import { StyleSheet, Text, View } from "react-native";
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

function NodeSymbol({ symbol, active }: { symbol: SymbolKind; active: boolean }) {
  const borderColor = active ? THEME.activeColor : THEME.gold;
  const bgColor = active ? THEME.activeColor : `${THEME.activeColor}33`;

  if (symbol === "dot") {
    return (
      <View
        style={[
          styles.dot,
          { borderColor, backgroundColor: bgColor },
          active && styles.symbolGlow,
          active && { shadowColor: THEME.activeColor },
        ]}
      />
    );
  }
  if (symbol === "dashH") {
    return (
      <View
        style={[
          styles.dash, styles.dashH,
          { borderColor, backgroundColor: bgColor },
          active && styles.symbolGlow,
          active && { shadowColor: THEME.activeColor },
        ]}
      />
    );
  }
  return (
    <View
      style={[
        styles.dash, styles.dashV,
        { borderColor, backgroundColor: bgColor },
        active && styles.symbolGlow,
        active && { shadowColor: THEME.activeColor },
      ]}
    />
  );
}

export default function Nodes() {
  const { activeNodeIds, finalNodeId } = useMorseGameContext();

  return (
    <>
      {NODES.map((node) => {
        const active = activeNodeIds.has(node.nodeId);
        const isFinal = finalNodeId === node.nodeId;
        return (
          <View
            key={node.nodeId}
            style={[styles.node, { top: node.top, left: node.left }]}
          >
            <NodeSymbol symbol={node.symbol} active={active} />
            <Text
              style={[
                styles.label,
                isFinal && styles.labelFinal,
              ]}
            >
              {node.letter}
            </Text>
          </View>
        );
      })}
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
  symbolGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  label: {
    position: "absolute",
    top: -8,
    right: -6,
    color: THEME.gold,
    fontWeight: "500",
    fontSize: 16,
    opacity: 0.8,
  },
  labelFinal: {
    color: THEME.activeColor,
    opacity: 1,
    transform: [{ scale: 1.5 }],
    textShadowColor: THEME.activeColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
