import { router, usePathname } from "expo-router";
import { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LOCALES, getLocaleLabel } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";
import { THEME } from "@/constants/theme";

const MENU_ROUTES = [
  { href: "/about" as const, labelKey: "nav.about" },
  { href: "/settings" as const, labelKey: "nav.settings" },
];

export default function CardMenu() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  const navigate = (href: "/about" | "/settings") => {
    close();
    router.push(href);
  };

  return (
    <View style={styles.menu}>
      <Pressable
        style={[styles.trigger, isOpen && styles.triggerOpen]}
        onPress={() => setIsOpen((o) => !o)}
        accessibilityLabel={t("common.menu")}
        accessibilityRole="button"
      >
        <View style={[styles.bar, isOpen && styles.barTop]} />
        <View style={[styles.bar, isOpen && styles.barMid]} />
        <View style={[styles.bar, isOpen && styles.barBot]} />
      </Pressable>

      <Modal
        transparent
        visible={isOpen}
        animationType="none"
        onRequestClose={close}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.dropdown}>
          {pathname !== "/" && (
            <TouchableOpacity style={styles.item} onPress={() => { close(); router.push("/"); }}>
              <Text style={styles.itemText}>{t("common.morseTree")}</Text>
            </TouchableOpacity>
          )}

          {MENU_ROUTES.map(({ href, labelKey }) => (
            <TouchableOpacity
              key={href}
              style={[styles.item, pathname === href && styles.itemActive]}
              onPress={() => navigate(href)}
            >
              <Text
                style={[
                  styles.itemText,
                  pathname === href && styles.itemTextActive,
                ]}
              >
                {t(labelKey)}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.langGroup}>
            {LOCALES.map((code) => (
              <TouchableOpacity
                key={code}
                style={[styles.langBtn, locale === code && styles.langBtnActive]}
                onPress={() => setLocale(code)}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    locale === code && styles.langBtnTextActive,
                  ]}
                >
                  {getLocaleLabel(code)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "relative",
  },
  trigger: {
    width: 44,
    height: 44,
    padding: 8,
    justifyContent: "center",
    gap: 5,
    borderWidth: 2,
    borderColor: THEME.goldBorder,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  triggerOpen: {
    borderColor: THEME.gold,
  },
  bar: {
    width: "100%",
    height: 2,
    backgroundColor: THEME.gold,
    borderRadius: 1,
  },
  barTop: {
    transform: [{ translateY: 7 }, { rotate: "45deg" }],
  },
  barMid: {
    opacity: 0,
  },
  barBot: {
    transform: [{ translateY: -7 }, { rotate: "-45deg" }],
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "transparent",
  },
  dropdown: {
    position: "absolute",
    top: 100,
    right: 20,
    minWidth: 160,
    padding: 6,
    borderWidth: 2,
    borderColor: THEME.goldBorder,
    borderRadius: 12,
    backgroundColor: THEME.cardBg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  itemActive: {
    backgroundColor: "rgba(46,213,115,0.1)",
  },
  itemText: {
    color: THEME.gold,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1,
  },
  itemTextActive: {
    color: THEME.activeColor,
  },
  langGroup: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(229,193,125,0.2)",
  },
  langBtn: {
    flex: 1,
    minHeight: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(229,193,125,0.35)",
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  langBtnActive: {
    borderColor: THEME.activeColor,
    backgroundColor: "rgba(46,213,115,0.12)",
  },
  langBtnText: {
    color: THEME.gold,
    fontSize: 12,
    fontWeight: "500",
  },
  langBtnTextActive: {
    color: THEME.activeColor,
  },
});
