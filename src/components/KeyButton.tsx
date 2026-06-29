import { Pressable, StyleSheet, Text, View } from "react-native";
import { useMorseGameContext } from "@/context/MorseGameContext";
import { useLocale } from "@/context/LocaleContext";
import { THEME } from "@/constants/theme";

export default function KeyButton() {
  const { t } = useLocale();
  const { isDisabled, onPressStart, onPressEnd } = useMorseGameContext();
  const pushLabel = t("common.push");

  const handlePressIn = () => {
    if (isDisabled) return;
    onPressStart();
  };

  const handlePressOut = () => {
    onPressEnd();
  };

  return (
    <Pressable
      style={[styles.keyButton, isDisabled && styles.disabled]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={pushLabel}
      accessibilityRole="button"
    >
      <View style={styles.hitArea}>
        <View style={styles.waveOuter} />
        <View style={styles.waveInner} />
        <View style={styles.centerDot} />
      </View>
      
      <Text style={styles.text}>{pushLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  keyButton: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -36 }],
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  hitArea: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-90deg" }],
  },
  centerDot: {
    width: 15,
    height: 15,
    backgroundColor: THEME.gold,
    borderRadius: 7.5,
    zIndex: 2,
  },
  waveInner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: THEME.gold,
    borderBottomColor: THEME.gold,
  },
  waveOuter: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: THEME.gold,
    borderBottomColor: THEME.gold,
  },
  text: {
    color: THEME.gold,
    marginTop: -10,
    fontSize: 14,
    letterSpacing: 1,
  },
});
