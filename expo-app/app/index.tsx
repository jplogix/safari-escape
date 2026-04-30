import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { openDestination } from "../lib/browser";

export default function IndexScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [manualUrl, setManualUrl] = useState("");
  const [isOpening, setIsOpening] = useState(false);

  const errorMsg = typeof params.error === "string" ? params.error : null;
  const linkUrl = typeof params.link === "string" ? params.link : "";

  const handleManualOpen = async () => {
    const trimmed = manualUrl.trim();

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "https:") {
        Alert.alert("Invalid URL", "Please enter a secure HTTPS URL.");
        return;
      }

      setIsOpening(true);
      const result = await openDestination(parsed.toString());

      if (result.type === "error") {
        Alert.alert("Could not open link", result.reason);
      }
    } catch {
      Alert.alert("Invalid URL", "Please enter a valid HTTPS URL.");
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browser Escape</Text>

      {errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorLabel}>HANDOFF FAILED:</Text>
          <Text style={styles.errorMessage}>{errorMsg}</Text>

          {linkUrl && (
            <View style={styles.linkContainer}>
              <Text style={styles.instructionText}>
                Please copy the link below and open it manually:
              </Text>
              <Text selectable style={styles.linkText}>
                {linkUrl}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.loadingText}>Waiting for Universal Link...</Text>
      )}

      <View style={styles.manualContainer}>
        <Text style={styles.manualTitle}>No link received?</Text>
        <Text style={styles.manualSubtext}>
          Paste any HTTPS destination and we will open it in your preferred browser.
        </Text>
        <TextInput
          value={manualUrl}
          onChangeText={setManualUrl}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          placeholder="https://example.com"
          placeholderTextColor="#6b7280"
        />
        <TouchableOpacity
          style={[styles.openButton, isOpening && styles.openButtonDisabled]}
          onPress={handleManualOpen}
          disabled={isOpening}
        >
          <Text style={styles.openButtonText}>{isOpening ? "Opening..." : "Open Destination"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/settings")}>
        <Text style={styles.settingsButtonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontFamily: "JetBrainsMono_600SemiBold",
    fontSize: 24,
    color: "#f3f4f6",
    marginBottom: 40,
    textAlign: "center",
  },
  loadingText: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
  },
  manualContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#0f1115",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  manualTitle: {
    fontFamily: "JetBrainsMono_600SemiBold",
    fontSize: 13,
    color: "#e5e7eb",
  },
  manualSubtext: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 12,
    color: "#9ca3af",
    lineHeight: 18,
  },
  input: {
    fontFamily: "JetBrainsMono_400Regular",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: "#e5e7eb",
    backgroundColor: "#000",
    fontSize: 13,
  },
  openButton: {
    borderWidth: 1,
    borderColor: "#2563eb",
    backgroundColor: "#1d4ed8",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  openButtonDisabled: {
    opacity: 0.6,
  },
  openButtonText: {
    fontFamily: "JetBrainsMono_600SemiBold",
    color: "#dbeafe",
    fontSize: 13,
  },
  errorContainer: {
    backgroundColor: "#1f1212",
    borderWidth: 1,
    borderColor: "#511f1f",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorLabel: {
    fontFamily: "JetBrainsMono_600SemiBold",
    fontSize: 12,
    color: "#ef4444",
    marginBottom: 8,
  },
  errorMessage: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 14,
    color: "#fca5a5",
    marginBottom: 24,
  },
  linkContainer: {
    marginTop: 12,
  },
  instructionText: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 12,
    color: "#d1d5db",
    marginBottom: 8,
  },
  linkText: {
    fontFamily: "JetBrainsMono_400Regular",
    backgroundColor: "#000",
    color: "#60a5fa",
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
  },
  settingsButton: {
    marginTop: "auto",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#374151",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  settingsButtonText: {
    fontFamily: "JetBrainsMono_400Regular",
    color: "#d1d5db",
    fontSize: 14,
  },
});
