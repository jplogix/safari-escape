import type { EscapeResult } from "../types";

export function parseUniversalLink(url: string | null): EscapeResult {
	if (!url) {
		return { success: false, error: "No URL provided" };
	}

	try {
		const parsed = new URL(url);
		const destination = parsed.searchParams.get("to");

		if (!destination) {
			return { success: false, error: "Missing 'to' parameter in URL" };
		}

		const destinationURL = new URL(destination);
		if (destinationURL.protocol !== "https:") {
			return {
				success: false,
				error: "Destination must be HTTPS",
				destinationURL: destination,
			};
		}

		return { success: true, destinationURL: destinationURL.toString() };
	} catch (err: unknown) {
		return {
			success: false,
			error: "Invalid URL format",
			destinationURL: typeof url === "string" ? url : undefined,
		};
	}
}
