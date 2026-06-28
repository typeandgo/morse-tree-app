import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "@/context/LocaleContext";
import { SettingsProvider } from "@/context/SettingsContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <SettingsProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#132529" },
              animation: "slide_from_right",
            }}
          />
        </SettingsProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
