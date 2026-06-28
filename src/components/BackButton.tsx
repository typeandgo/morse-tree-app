import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { useLocale } from "@/context/LocaleContext";
import { THEME } from "@/constants/theme";

export default function BackButton() {
  const { t } = useLocale();

  return (
    <Pressable
      style={styles.back}
      onPress={() => router.back()}
      accessibilityLabel={t("common.back")}
      accessibilityRole="button"
    >
      <Text style={styles.arrow}>{"←"}</Text>
      
      <Text style={styles.label}>{t("common.back")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: THEME.goldBorder,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  arrow: {
    color: THEME.gold,
    fontSize: 20,
    lineHeight: 20,
    top: -3,
  },
  label: {
    color: THEME.gold,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});
