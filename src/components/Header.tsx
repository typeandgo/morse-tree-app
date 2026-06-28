import { usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import BackButton from "./BackButton";
import CardMenu from "./CardMenu";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();

  return (
    <View style={styles.header}>
      <Logo />

      { pathname === "/" ? <CardMenu /> : <BackButton /> }
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
});
