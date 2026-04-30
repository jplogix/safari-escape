import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getBrowserPreference, setBrowserPreference } from "../lib/browser";
import type { BrowserPreference } from "../types";

export default function SettingsScreen() {
  const [pref, setPref] = useState<BrowserPreference>("safari");
  const router = useRouter();

  useEffect(() => {
    getBrowserPreference().then(setPref);
  }, []);

  const handleSelect = async (choice: BrowserPreference) => {
    await setBrowserPreference(choice);
    setPref(choice);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.label}>Preferred Fallback Browser:</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionCard, pref === "safari" && styles.optionCardActive]}
          onPress={() => handleSelect("safari")}
        >
          <Text style={[styles.optionTitle, pref === "safari" && styles.optionTextActive]}>
            Safari (Default)
          </Text>
          <Text style={styles.optionSub}>
            Opens destinations with the system browser using standard iOS URL handling.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, pref === "chrome" && styles.optionCardActive]}
          onPress={() => handleSelect("chrome")}
        >
          <Text style={[styles.optionTitle, pref === "chrome" && styles.optionTextActive]}>
            Google Chrome
          </Text>
          <Text style={styles.optionSub}>
            Uses Chrome URL schemes when available, with a system-browser fallback if not installed.
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 24,
    paddingTop: 64,
  },
  title: {
    fontFamily: "JetBrainsMono_600SemiBold",
    fontSize: 24,
    color: "#f3f4f6",
    marginBottom: 40,
  },
  label: {
    fontFamily: "JetBrainsMono_600SemiBold",
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    padding: 20,
    backgroundColor: "#111",
    borderWidth: 2,
    borderColor: "#222",
    borderRadius: 12,
  },
  optionCardActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#1a2a40",
  },
  optionTitle: {
    fontFamily: "JetBrainsMono_600SemiBold",
    fontSize: 16,
    color: "#d1d5db",
    marginBottom: 6,
  },
  optionTextActive: {
    color: "#bfdbfe",
  },
  optionSub: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18,
  },
  backButton: {
    marginTop: 40,
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    fontFamily: "JetBrainsMono_600SemiBold",
    color: "#e5e7eb",
  },
});
