import { StyleSheet, View } from "react-native";
import { useMorseGameContext } from "@/context/MorseGameContext";
import { THEME } from "@/constants/theme";

export default function Antenna() {
  const { antennaActive } = useMorseGameContext();
  const color = antennaActive ? THEME.activeColor : THEME.gold;

  return (
    <View style={styles.antenna}>
      {/* Triangle outer */}
      <View style={styles.triangleOuter} />
      {/* Triangle inner cutout (card-bg color overlay) */}
      <View style={styles.triangleInner} />
      {/* Pole */}
      <View
        style={[
          styles.pole,
          { backgroundColor: color },
          antennaActive && styles.poleGlow,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  antenna: {
    position: "absolute",
    top: 40,
    left: "50%",
    marginLeft: -10,
    transform: [{ translateX: -16 }],
    width: 32,
    height: 77,
    alignItems: "center",
  },
  triangleOuter: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 26,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: THEME.gold,
  },
  triangleInner: {
    position: "absolute",
    top: 4,
    left: "50%",
    marginLeft: -12,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: THEME.cardBg,
  },
  pole: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -1,
    width: 2,
    height: 77,
    backgroundColor: THEME.gold,
    zIndex: 2,
  },
  poleGlow: {
    shadowColor: THEME.activeColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
});
