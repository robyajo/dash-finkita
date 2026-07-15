/**
 * Native Mobile Auth API Client
 *
 * Digunakan oleh aplikasi native Android/iOS untuk Google Sign-In dan email/password auth.
 * App native mendapatkan Google ID token via Google Credential Manager,
 * lalu memanggil fungsi di sini untuk login/register.
 *
 * --- Flow Google Sign-In di Android (Kotlin) ---
 *
 * 1. App menggunakan Google Credential Manager untuk mendapatkan ID token
 * 2. App memanggil POST /api/auth/google-mobile dengan { idToken }
 * 3. Backend memverifikasi token Google, membuat/update user, mengembalikan accessToken + refreshToken
 * 4. App menyimpan token untuk request API selanjutnya
 *
 * --- Request ---
 * POST https://api.finkita.com/api/auth/google-mobile
 * Body: { "idToken": "eyJhbGciOiJS..." }
 *
 * --- Response sukses ---
 * {
 *   "accessToken": "eyJ...",      // JWT, expire 15 menit
 *   "refreshToken": "a1b2c3...",  // Refresh token, expire 7 hari
 *   "expiresAt": "2026-07-14T12:30:00.000Z",
 *   "user": {
 *     "id": "uuid",
 *     "name": "Budi",
 *     "email": "budi@gmail.com",
 *     "role": "USER",
 *     "image": "/storage/avatars/uuid.jpg",
 *     "createdFrom": "google",
 *     "createdAt": "...",
 *     "updatedAt": "..."
 *   }
 * }
 *
 * --- Penggunaan token di Android ---
 * Setiap request API yang butuh auth, tambahkan header:
 * Authorization: Bearer <accessToken>
 *
 * Jika accessToken expired (401), panggil nativeRefreshToken() untuk dapat token baru.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface MobileAuthUser {
  id: string
  name: string
  email: string
  role: string
  image: string | null
  createdFrom: string | null
  createdAt: string
  updatedAt: string
}

export interface MobileAuthResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: MobileAuthUser
}

// ─── Google Sign-In (Native Mobile) ──────────────────────────────────────────

/**
 * Sign in / Sign up via Google ID Token (untuk native Android/iOS).
 *
 * Tidak perlu bedakan login vs register — backend auto-detect:
 * - Jika email sudah ada → login
 * - Jika email belum ada → register + langsung login
 *
 * @param idToken - Google ID token dari Credential Manager (Android) atau Sign-In SDK (iOS)
 */
export async function googleSignIn(idToken: string): Promise<MobileAuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/google-mobile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || `Google Sign-In failed (${response.status})`)
  }

  return response.json()
}

// ─── Email/Password Auth (Native Mobile) ─────────────────────────────────────

/**
 * Register via email/password (untuk native Android/iOS).
 */
export async function nativeRegister(
  email: string,
  password: string,
  confirmPassword: string,
  name?: string,
): Promise<{ user: MobileAuthUser }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirmPassword, name }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || `Registration failed (${response.status})`)
  }

  return response.json()
}

/**
 * Login via email/password (untuk native Android/iOS).
 */
export async function nativeLogin(
  email: string,
  password: string,
): Promise<MobileAuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || `Login failed (${response.status})`)
  }

  return response.json()
}

// ─── Token Refresh (Native Mobile) ────────────────────────────────────────────

/**
 * Refresh access token yang sudah expired (untuk native Android/iOS).
 *
 * Access token expire dalam 15 menit. Setiap kali expire,
 * panggil fungsi ini dengan refresh token untuk mendapatkan access token baru.
 *
 * Refresh token di-rotate — token lama dihapus, token baru dibuat.
 *
 * @param currentRefreshToken - Refresh token yang aktif
 */
export async function nativeRefreshToken(currentRefreshToken: string): Promise<{
  accessToken: string
  refreshToken: string
  expiresAt: string
}> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: currentRefreshToken }),
  })

  if (!response.ok) {
    throw new Error("Failed to refresh token — please login again")
  }

  return response.json()
}

// ─── Logout (Native Mobile) ───────────────────────────────────────────────────

/**
 * Logout — invalidasi refresh token (untuk native Android/iOS).
 *
 * @param accessToken - Access token untuk identifikasi user
 * @param refreshToken - Refresh token yang akan di-invalidasi
 */
export async function nativeLogout(
  accessToken: string,
  refreshToken?: string,
): Promise<void> {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  })
}
