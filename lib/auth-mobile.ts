/**
 * Platform Detection Utilities
 *
 * Deteksi apakah app berjalan di browser web, WebView, atau native app.
 */

/**
 * Check if running inside a WebView (Android/iOS)
 */
export function isWebView(): boolean {
  if (typeof window === "undefined") return false

  const ua = navigator.userAgent.toLowerCase()

  // Android WebView
  if (ua.includes("wv") || ua.includes("; wv)")) return true

  // iOS WebView (WKWebView, UIWebView)
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    if (!ua.includes("safari") || ua.includes("crios")) return true
  }

  // Capacitor/Cordova
  if (typeof (window as any).cordova !== "undefined") return true
  if (typeof (window as any).Capacitor !== "undefined") return true

  return false
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  if (typeof window === "undefined") return false
  return /android/i.test(navigator.userAgent)
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

/**
 * Check if running on mobile device (Android or iOS)
 */
export function isMobile(): boolean {
  return isAndroid() || isIOS()
}

/**
 * Custom URL scheme for deep linking
 */
export function getAppScheme(): string {
  return process.env.NEXT_PUBLIC_APP_SCHEME || "finkita"
}

/**
 * Parse redirect path from deep link URL
 */
export function parseDeepLink(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.searchParams.get("redirect") || "/dashboard"
  } catch {
    return null
  }
}

