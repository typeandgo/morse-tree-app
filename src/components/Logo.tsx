import { StyleSheet, Text } from "react-native";
import { THEME } from "@/constants/theme";

export default function Logo() {
  return (
    <Text style={styles.logo}>{"MORSE \nTREE"}</Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    color: THEME.gold,
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 3,
    lineHeight: 24,
  },
});
