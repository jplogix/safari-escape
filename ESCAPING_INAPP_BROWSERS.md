# Escaping iOS In-App Browsers (Instagram/Facebook)

## The Problem

When users click links within native apps like Instagram, Facebook, or TikTok on iOS, they are not taken to the native Safari browser. Instead, they are trapped inside highly restrictive, in-app `WKWebView` environments.

This causes several major issues for developers:

- Broken session states and login loops (cookies don't share with Safari).
- Broken payment gateways (Apple Pay is frequently disabled or buggy).
- Restricted native APIs (camera, geolocation, etc.).
- Overall degraded user experience.

The goal of this project (`browser-escape`) is to forcibly "break out" of the Instagram/Facebook iOS in-app browser and seamlessly load the destination URL in a native browser (Safari or Chrome).

---

## Our Findings & Roadblocks

Through iterative testing on iOS and iPadOS within the Instagram app environment, we discovered that Meta is engaged in an active cat-and-mouse game to trap users in their ecosystem:

1. **The Classic `x-safari-https://` Hack is Blocked**
   - Historically, forcing a redirect to `x-safari-https://[URL]` would force iOS to launch Safari. Meta now actively intercepts and drops this scheme within their `WKWebView` delegates without triggering an error.
2. **The "White Screen of Death"**
   - Attempting to use `window.open('x-safari-https://...', '_blank')` as a fallback mechanism backfires. Instagram blocks the unapproved scheme but still opens the empty `_blank` child view, leaving the user permanently trapped on a white screen.
3. **No Automatic Escapes**
   - Attempting hidden `<a>` tag clicks, `iframe` injections, or `top.location` reassignments natively on load are completely ignored unless strongly coupled to an explicit, recent, user gesture (a physical tap).
4. **Third-Party Schemes are Whitelisted**
   - While Meta actively blocks Apple's internal `x-safari-https://` scheme to prevent Safari escapes, they do not universally block non-competitor third-party app schemes like `googlechromes://`.
5. **iOS Shortcuts Integration**
   - The native Apple Shortcuts scheme (`shortcuts://run-shortcut`) is an unrestricted, powerful vector for breaking out of any app sandbox, but it carries a friction point: the user must have the designated shortcut previously installed on their device.

---

## Our Solutions Architecture

Because a 100% invisible, automatic escape is no longer possible on modern Instagram iOS versions, we implemented a progressive degradation fallback strategy:

### 1. Graceful Degradation & Visual Fallback

Our script first attempts a lightweight automatic escape. When that inevitably fails, we present the user with manual UI buttons.

- **Safari Button**: If the user taps "Tap to open in Safari", we fire the `x-safari-https://` scheme.
- **Instructional Pivot**: If the app silently intercepts and blocks the tap (detected via a 1.5-second timeout), the button immediately turns red with explicit visual instructions: `Safari Blocked. Tap ••• (top right) → Open in System Browser`. This matches the industry standard for link-in-bio services.

### 2. The iOS Shortcut "Escape Hatch"

We implemented an iOS Shortcut button that calls `shortcuts://run-shortcut?name=OpenSafari&input=[TARGET_URL]`.

- **How it works:** It forces the OS to immediately open the Shortcuts app, run a 1-action script configured to accept `Shortcut Input` (URLs only) explicitly passed to an `Open URLs` block. This breaks out of the Instagram sandbox entirely into Safari seamlessly.
- **UX Enhancement:** Since users need the strictly-named `"OpenSafari"` shortcut installed locally, we designed a refined, subtle text link installer placed directly beneath the button (`https://www.icloud.com/shortcuts/2ae0484bf4454ef2a8fc413012ebc967`) that launches the OS Shortcut gallery so they only need to install it once.

### 3. The Chrome "Piggyback Bridge"

Since Instagram allows the Chrome URI scheme but aggressively blocks Safari, we implemented a bridge sequence:

- User taps "Tap to open in Chrome". We launch Chrome not with the final destination, but with our own app's URL (`googlechromes://[OUR_APP_URL]`).
- Instagram successfully hands off the session and the native Chrome app securely opens our escape script.
- Once the page loads natively in Chrome, our script detects the Chrome user agent (`CriOS`) instead of the Instagram in-app browser.
- It instantly attempts to automatically re-fire `x-safari-https://` to bridge the user from Chrome directly into Safari.
- **The OS Prompt:** Apple iOS securely catches this jump and presents a native prompt: *"Chrome wants to open another application"*. This is a mandatory OS-level security feature and cannot be bypassed.
- **Extended Timeout & Fallback:** To ensure the user has enough time to tap "Allow", we use an extended 3.5-second fallback timer.
  - If they tap **Allow**, they successfully escape fully into native Safari.
  - If they ignore it or hit **Cancel** (or if Chrome natively blocks it), the timer fires, gracefully aborts the Safari escape, and simply loads the target destination URL inside Chrome natively. Either way, they have successfully escaped Instagram.
