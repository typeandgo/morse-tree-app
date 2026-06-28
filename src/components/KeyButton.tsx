import * as Haptics from "expo-haptics";
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
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      disabled={isDisabled}
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
    bottom: 24,
    left: "50%",
    marginLeft: -10,
    transform: [{ translateX: -31 }],
    alignItems: "center",
    padding: 0,
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  hitArea: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  centerDot: {
    width: 18,
    height: 18,
    backgroundColor: THEME.gold,
    borderRadius: 9,
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
