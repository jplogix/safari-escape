export type BrowserPreference = "safari" | "chrome";

export type EscapeResult =
	| { success: true; destinationURL: string }
	| { success: false; error: string; destinationURL?: string };

export type BrowserHandoffResult =
	| { type: "success"; method: "linking" | "webbrowser" }
	| { type: "error"; reason: string };
