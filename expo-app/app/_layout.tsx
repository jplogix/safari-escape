import { JetBrainsMono_400Regular, JetBrainsMono_600SemiBold, useFonts } from "@expo-google-fonts/jetbrains-mono";
import * as Linking from "expo-linking";
import { Slot, useRouter } from "expo-router";

import React from "react";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { openDestination } from "../lib/browser";
import { parseUniversalLink } from "../lib/escape";

export default function RootLayout() {
    const url = Linking.useURL();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        JetBrainsMono_400Regular,
        JetBrainsMono_600SemiBold,
    });

    useEffect(() => {
        async function handleIncomingLink() {
            if (!url) return;
            const result = parseUniversalLink(url);

            if (result.success) {
                // Attempt the handoff
                const handoff = await openDestination(result.destinationURL);
                if (handoff.type === "error") {
                    // If we fail, redirect to an in-app error/fallback screen
                    router.replace({
                        pathname: "/",
                        params: { error: handoff.reason, link: result.destinationURL },
                    });
                }
            } else {
                // Invalid link
                router.replace({
                    pathname: "/",
                    params: { error: result.error, link: result.destinationURL ?? "" },
                });
            }
        }

        handleIncomingLink();
    }, [url, router]);

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ffffff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Slot />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0a0a0a",
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
    }
});