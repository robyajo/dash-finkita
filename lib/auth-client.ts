"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "./axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface User {
  id: string
  name: string
  email: string
  image: string | null
  role: string
}

export interface Session {
  user: User
}

const listeners = new Set<() => void>()
const notifyListeners = () => listeners.forEach((l) => l())

export const authClient = {
  useSession() {
    const [session, setSession] = useState<Session | null>(null)
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState<any>(null)

    const fetchSession = useCallback(async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("finkita_access_token") : null
      if (!token) {
        setSession(null)
        setIsPending(false)
        return
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/me`)
        if (response.data?.success && response.data?.data) {
          const u = response.data.data
          const sess: Session = {
            user: {
              id: u.uuid,
              name: u.name,
              email: u.email,
              image: u.avatar,
              role: u.role,
            },
          }
          localStorage.setItem("finkita_user", JSON.stringify(sess.user))
          setSession(sess)
        } else {
          authClient.clearSession()
          setSession(null)
        }
      } catch (err: any) {
        setError(err)
        if (err?.response?.status === 401) {
          authClient.clearSession()
          setSession(null)
        } else {
          const cached = localStorage.getItem("finkita_user")
          if (cached) {
            setSession({ user: JSON.parse(cached) })
          }
        }
      } finally {
        setIsPending(false)
      }
    }, [])

    useEffect(() => {
      fetchSession()
      listeners.add(fetchSession)
      return () => {
        listeners.delete(fetchSession)
      }
    }, [fetchSession])

    return {
      data: session,
      isPending,
      error,
      refetch: fetchSession,
    }
  },

  async getSession() {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const qAccessToken = urlParams.get("accessToken")
      const qRefreshToken = urlParams.get("refreshToken")
      if (qAccessToken && qRefreshToken) {
        authClient.setSession(qAccessToken, qRefreshToken, null)
      }
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("finkita_access_token") : null
    if (!token) return { data: null, error: null }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/me`)
      if (response.data?.success && response.data?.data) {
        const u = response.data.data
        const sess: Session = {
          user: {
            id: u.uuid,
            name: u.name,
            email: u.email,
            image: u.avatar,
            role: u.role,
          },
        }
        localStorage.setItem("finkita_user", JSON.stringify(sess.user))
        return { data: sess, error: null }
      }
      return { data: null, error: new Error("Invalid session") }
    } catch (err: any) {
      return { data: null, error: err }
    }
  },

  clearSession() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("finkita_access_token")
      localStorage.removeItem("finkita_refresh_token")
      localStorage.removeItem("finkita_user")
      document.cookie = "better-auth.session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      notifyListeners()
    }
  },

  setSession(accessToken: string, refreshToken: string, user: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem("finkita_access_token", accessToken)
      localStorage.setItem("finkita_refresh_token", refreshToken)
      if (user) {
        const sessUser: User = {
          id: user.uuid,
          name: user.name,
          email: user.email,
          image: user.avatar,
          role: user.role,
        }
        localStorage.setItem("finkita_user", JSON.stringify(sessUser))
      }
      document.cookie = `better-auth.session_token=${accessToken}; path=/; max-age=31536000; SameSite=Lax`
      notifyListeners()
    }
  },

  signIn: {
    async email({ email, password }: any) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/login`, { email, password })
        if (response.data?.success && response.data?.data) {
          const { tokens, user } = response.data.data
          authClient.setSession(tokens.accessToken, tokens.refreshToken, user)
          return { data: { user }, error: null }
        }
        return { data: null, error: new Error(response.data?.message || "Login failed") }
      } catch (err: any) {
        const errMsg = err.response?.data?.message || err.message || "Login failed"
        return { data: null, error: new Error(errMsg) }
      }
    },

    async social({ provider }: { provider: string; callbackURL?: string }) {
      if (provider === "google") {
        window.location.href = `${API_BASE_URL}/api/auth/google`
      }
    },
  },

  signUp: {
    async email({ name, email, password }: any) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/register`, { name, email, password })
        if (response.data?.success && response.data?.data) {
          const { tokens, user } = response.data.data
          authClient.setSession(tokens.accessToken, tokens.refreshToken, user)
          return { data: { user }, error: null }
        }
        return { data: null, error: new Error(response.data?.message || "Registration failed") }
      } catch (err: any) {
        const errMsg = err.response?.data?.message || err.message || "Registration failed"
        return { data: null, error: new Error(errMsg) }
      }
    },
  },

  async signOut() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("finkita_access_token") : null
      if (token) {
        await axios.post(`${API_BASE_URL}/api/logout`)
      }
      authClient.clearSession()
      return { error: null }
    } catch (err: any) {
      authClient.clearSession()
      return { error: err }
    }
  },
}
