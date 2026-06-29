import Slider from "@react-native-community/slider";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { useLocale } from "@/context/LocaleContext";
import { useSettings } from "@/context/SettingsContext";
import { playDashSound, playDotSound } from "@/lib/morse-audio";
import {
  WPM_MIN,
  WPM_MAX,
  WPM_STEP,
  getUnitMs,
  getDotMax,
  getDashMin,
  getDashMax,
  getDurationBetweenQueue,
  getDurationEndOfQueue,
} from "@/lib/morse-settings";
import { THEME } from "@/constants/theme";

export default function SettingsScreen() {
  const { t } = useLocale();
  const {
    settings,
    audioSettings,
    updateSettings,
    updateAudioSettings,
    resetSettings,
    resetAudioSettings,
  } = useSettings();
  const insets = useSafeAreaInsets();
  const [openKey, setOpenKey] = useState<string | null>(null);

  const unitMs = getUnitMs(settings);
  const dotMax = getDotMax(settings);
  const dashMin = getDashMin(settings);
  const dashMax = getDashMax(settings);
  const betweenQueue = getDurationBetweenQueue(settings);
  const endOfQueue = getDurationEndOfQueue();

  const preview = (type: "dot" | "dash") => {
    if (type === "dot") void playDotSound(audioSettings);
    else void playDashSound(audioSettings);
  };

  const dot = t("common.dot");
  const dash = t("common.dash");

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      >
        <Text style={styles.title}>{t("settings.title")}</Text>
        <Text style={styles.lead}>{t("settings.lead")}</Text>

        {/* Speed Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>{t("settings.speedTitle")}</Text>

          <View style={styles.wpmBlock}>
            <View style={styles.wpmDisplay}>
              <Text style={styles.wpmValue}>{settings.wpm}</Text>
              <Text style={styles.wpmUnit}>{t("settings.wpm.unit")}</Text>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={WPM_MIN}
              maximumValue={WPM_MAX}
              step={WPM_STEP}
              value={settings.wpm}
              onValueChange={(v) => updateSettings({ wpm: Math.round(v) })}
              minimumTrackTintColor={THEME.activeColor}
              maximumTrackTintColor="rgba(235,211,156,0.3)"
              thumbTintColor={THEME.activeColor}
            />
            <View style={styles.sliderMeta}>
              <Text style={styles.sliderMetaText}>{WPM_MIN} {t("settings.wpm.unit")}</Text>
              <Text style={styles.sliderCurrent}>{t("settings.wpm.format", { value: settings.wpm })}</Text>
              <Text style={styles.sliderMetaText}>{WPM_MAX} {t("settings.wpm.unit")}</Text>
            </View>
          </View>

          <View style={styles.derivedTable}>
            {[
              { label: t("settings.derived.unit"), value: `${unitMs} ms` },
              { label: t("settings.derived.dot"), value: `0–${dotMax} ms` },
              { label: t("settings.derived.dash"), value: `${dashMin}–${dashMax} ms` },
              { label: t("settings.derived.gap"), value: `${betweenQueue} ms` },
              { label: t("settings.derived.cooldown"), value: `${endOfQueue} ms` },
            ].map(({ label, value }) => (
              <View key={label} style={styles.derivedRow}>
                <Text style={styles.derivedLabel}>{label}</Text>
                <Text style={styles.derivedValue}>{value}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => { resetSettings(); setOpenKey(null); }}
          >
            <Text style={styles.resetBtnText}>{t("settings.resetTiming")}</Text>
          </TouchableOpacity>
        </View>

        {/* Sound Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>{t("settings.soundTitle")}</Text>

          <View style={styles.previewRow}>
            <TouchableOpacity style={styles.previewBtn} onPress={() => void preview("dot")}>
              <Text style={styles.previewBtnText}>{t("settings.sound.previewDot", { dot })}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.previewBtn} onPress={() => void preview("dash")}>
              <Text style={styles.previewBtnText}>{t("settings.sound.previewDash", { dash })}</Text>
            </TouchableOpacity>
          </View>

          <SliderRow
            label={t("settings.sound.frequencyHz.label")}
            value={audioSettings.frequencyHz}
            displayValue={t("settings.sound.frequencyHz.format", { value: audioSettings.frequencyHz })}
            min={200}
            max={1500}
            step={10}
            unitMin="200 Hz"
            unitMax="1500 Hz"
            rowKey="frequencyHz"
            openKey={openKey}
            onOpenKeyChange={setOpenKey}
            onChange={(v) => updateAudioSettings({ frequencyHz: v })}
            onTry={() => void preview("dot")}
          />

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => { resetAudioSettings(); setOpenKey(null); }}
          >
            <Text style={styles.resetBtnText}>{t("settings.resetSound")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

type SliderRowProps = {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  unitMin: string;
  unitMax: string;
  rowKey: string;
  openKey: string | null;
  onOpenKeyChange: (key: string | null) => void;
  onChange: (value: number) => void;
  onTry: () => void;
};

function SliderRow({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  unitMin,
  unitMax,
  rowKey,
  openKey,
  onOpenKeyChange,
  onChange,
  onTry,
}: SliderRowProps) {
  const { t } = useLocale();
  const isOpen = openKey === `audio:${rowKey}`;
  return (
    <View style={styles.rowWrap}>
      <TouchableOpacity
        style={[styles.row, isOpen && styles.rowOpen]}
        onPress={() => onOpenKeyChange(isOpen ? null : `audio:${rowKey}`)}
        accessibilityRole="button"
      >
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{displayValue}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.sliderPanel}>
          <Slider
            style={styles.slider}
            minimumValue={min}
            maximumValue={max}
            step={step}
            value={value}
            onValueChange={onChange}
            minimumTrackTintColor={THEME.activeColor}
            maximumTrackTintColor="rgba(235,211,156,0.3)"
            thumbTintColor={THEME.activeColor}
          />

          <View style={styles.sliderMeta}>
            <Text style={styles.sliderMetaText}>{unitMin}</Text>
            <Text style={styles.sliderCurrent}>{displayValue}</Text>
            <Text style={styles.sliderMetaText}>{unitMax}</Text>
          </View>

          <TouchableOpacity style={styles.tryBtn} onPress={onTry}>
            <Text style={styles.tryBtnText}>{"▶ "}{t("common.try")}</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 12,
    color: THEME.activeColor,
  },
  wpmBlock: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(229,193,125,0.25)",
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: 12,
  },
  wpmDisplay: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 14,
  },
  wpmValue: {
    fontSize: 48,
    fontWeight: "700",
    color: THEME.activeColor,
    lineHeight: 52,
    letterSpacing: -1,
  },
  wpmUnit: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    color: THEME.gold,
    opacity: 0.8,
    marginBottom: 4,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  sliderMetaText: {
    fontSize: 14,
    color: THEME.gold,
    opacity: 0.8,
  },
  sliderCurrent: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.activeColor,
  },
  derivedTable: {
    gap: 6,
    marginBottom: 12,
  },
  derivedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(229,193,125,0.15)",
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  derivedLabel: {
    fontSize: 14,
    color: THEME.gold,
    opacity: 0.75,
    letterSpacing: 0.5,
  },
  derivedValue: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.gold,
  },
  resetBtn: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(229,193,125,0.4)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  resetBtnText: {
    color: THEME.gold,
    fontSize: 14,
    letterSpacing: 1,
  },
  previewRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  previewBtn: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: THEME.goldBorder,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewBtnText: {
    color: THEME.gold,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  rowWrap: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(229,193,125,0.25)",
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  rowOpen: {
    borderColor: THEME.gold,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  rowLabel: {
    color: THEME.gold,
    fontSize: 14,
    opacity: 0.9,
  },
  rowValue: {
    color: THEME.gold,
    fontSize: 14,
    fontWeight: "600",
  },
  sliderPanel: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: THEME.goldBorder,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  tryBtn: {
    marginTop: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(229,193,125,0.35)",
    borderRadius: 8,
    alignItems: "center",
  },
  tryBtnText: {
    color: THEME.gold,
    fontSize: 14,
  },
});
