import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function IndexScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const errorMsg = typeof params.error === "string" ? params.error : null;
    const linkUrl = typeof params.link === "string" ? params.link : "";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Safari Escape</Text>

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

            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => router.push("/settings")}
            >
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
        marginTop: 'auto',
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
