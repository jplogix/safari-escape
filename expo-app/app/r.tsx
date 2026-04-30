import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function RedirectScreen() {
  const params = useLocalSearchParams();
  const to = typeof params.to === "string" ? params.to : "destination";

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#ffffff" size="large" />
      <Text style={styles.text}>Handing off to {to}...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "JetBrainsMono_400Regular",
    color: "#9ca3af",
    marginTop: 20,
  },
});
