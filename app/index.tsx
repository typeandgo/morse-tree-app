import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Antenna from "@/components/Antenna";
import CodePreview from "@/components/CodePreview";
import Header from "@/components/Header";
import KeyButton from "@/components/KeyButton";
import Lines from "@/components/Lines";
import Nodes from "@/components/Nodes";
import { MorseGameProvider } from "@/context/MorseGameContext";
import { THEME } from "@/constants/theme";

const CANVAS_W = 375;
const CANVAS_H = 670;

const { width: DEVICE_W } = Dimensions.get("window");
const scale = DEVICE_W / CANVAS_W;
const scaledH = CANVAS_H * scale;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <MorseGameProvider>
        <Header />
        <CodePreview />
        <View style={styles.canvasContainer}>
          <View
            style={[
              styles.canvas,
              {
                transform: [
                  { translateX: -(CANVAS_W * (1 - scale)) / 2 },
                  { translateY: -(CANVAS_H * (1 - scale)) / 2 },
                  { scale },
                ],
              },
            ]}
          >
            <Antenna />
            <Lines />
            <Nodes />
            <KeyButton />
          </View>
        </View>
      </MorseGameProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: THEME.cardBg,
  },
  canvasContainer: {
    width: DEVICE_W,
    height: scaledH,
    overflow: "hidden",
  },
  canvas: {
    width: CANVAS_W,
    height: CANVAS_H,
  },
});
