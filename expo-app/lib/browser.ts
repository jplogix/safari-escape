import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import type { BrowserHandoffResult, BrowserPreference } from "../types";

// Key for AsyncStorage
const PREF_KEY = "@safari_escape_browser_pref";

/**
 * Gets the user's preferred browser from AsyncStorage.
 * No sensitive data is saved here, simply "safari" or "chrome".
 */
export async function getBrowserPreference(): Promise<BrowserPreference> {
	try {
		const val = await AsyncStorage.getItem(PREF_KEY);
		if (val === "chrome") return "chrome";
		return "safari"; // Default
	} catch {
		return "safari";
	}
}

export async function setBrowserPreference(
	pref: BrowserPreference,
): Promise<void> {
	try {
		await AsyncStorage.setItem(PREF_KEY, pref);
	} catch (err) {
		console.error("Failed to save browser preference");
	}
}

export async function openDestination(
	url: string,
): Promise<BrowserHandoffResult> {
	try {
		const pref = await getBrowserPreference();
		const targetURL =
			pref === "chrome" ? url.replace(/^https?:\/\//, "googlechromes://") : url;

		// 1. Attempt OS-level native linking (Default OS behavior, jumps out of app)
		const canOpen = await Linking.canOpenURL(targetURL);
		if (canOpen) {
			const opened = await Linking.openURL(targetURL);
			if (opened) {
				return { type: "success", method: "linking" };
			}
		}

		// 2. If Linking fails, fallback to Expo's WebBrowser, rendering a
		//    native SFSafariViewController which provides full cookies and
		//    session state (still much better than Instagram WKWebView).
		//    If originally requested Chrome, fallback URL must be the HTTPS one.
		const fallbackUrl = pref === "chrome" ? url : targetURL;
		const result = await WebBrowser.openBrowserAsync(fallbackUrl);

		if (result.type !== "cancel" && result.type !== "dismiss") {
			return { type: "success", method: "webbrowser" };
		}

		return { type: "error", reason: "User cancelled or failed" };
	} catch (err: unknown) {
		return {
			type: "error",
			reason: err instanceof Error ? err.message : "Unknown error",
		};
	}
}
