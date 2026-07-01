import { StyleSheet, Text, View } from "react-native";
import { useMorseGameContext } from "@/context/MorseGameContext";
import { symbolToChar } from "@/lib/morse-timing";
import { THEME } from "@/constants/theme";

export default function CodePreview() {
  const { queue, previewLetter } = useMorseGameContext();
  const code = queue.map(symbolToChar).join("");

  return (
    <View style={styles.container}>
      {code.length > 0 && (
        <Text style={styles.text} numberOfLines={1}>
          {code}
          {previewLetter ? `  ${previewLetter}` : ""}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 2,
    color: THEME.activeColor,
  },
});
