import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { useLocale } from "@/context/LocaleContext";
import { useSettings } from "@/context/SettingsContext";
import {
  getDotMax,
  getDashMin,
  getDashMax,
  getDurationBetweenQueue,
  getDurationEndOfQueue,
} from "@/lib/morse-settings";
import { THEME } from "@/constants/theme";

export default function AboutScreen() {
  const { t } = useLocale();
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();

  const dotMax = getDotMax(settings);
  const dashMin = getDashMin(settings);
  const dashMax = getDashMax(settings);
  const durationBetweenQueue = getDurationBetweenQueue(settings);
  const durationEndOfQueue = getDurationEndOfQueue(settings);
  const push = t("common.push");
  const dot = t("common.dot");
  const dash = t("common.dash");
  const settingsLabel = t("nav.settings");

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      >
        <Text style={styles.title}>{t("about.title")}</Text>
        <Text style={styles.lead}>{t("about.lead")}</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>{t("about.howToTitle")}</Text>
          {[
            t("about.usageShort", { push, dotMax, dot }),
            t("about.usageLong", { push, dashMin, dashMax, dash }),
            t("about.usageQueueWait", { duration: durationBetweenQueue }),
            t("about.usageQueueGap", { duration: durationBetweenQueue }),
            t("about.usageCooldown", { duration: durationEndOfQueue }),
          ].map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>{"•"}</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>{t("about.treeTitle")}</Text>
          <Text style={styles.text}>
            {t("about.treeText", { settings: settingsLabel })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: THEME.cardBg,
  },
  scroll: {
    flex: 1,
    marginTop: 70,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 4,
    marginBottom: 16,
    color: THEME.gold,
  },
  lead: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
    color: THEME.gold,
    opacity: 0.9,
  },
  section: {
    marginBottom: 22,
  },
  heading: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
    color: THEME.activeColor,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  bullet: {
    color: THEME.gold,
    fontSize: 14,
    opacity: 0.9,
    marginTop: 1,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: THEME.gold,
    opacity: 0.9,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: THEME.gold,
    opacity: 0.9,
  },
});
