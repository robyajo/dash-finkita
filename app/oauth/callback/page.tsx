"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2Icon, AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { authClient } from "@/lib/auth-client"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  )
  const [message, setMessage] = useState("Processing authentication...")

  useEffect(() => {
    async function handleCallback() {
      const errorParam = searchParams.get("error")

      if (errorParam) {
        setStatus("error")
        setMessage(errorParam || "Authentication failed.")
        toast.error(errorParam || "Authentication failed.")
        setTimeout(() => router.replace("/login"), 2000)
        return
      }

      try {
        // Fetch the session using Better Auth client
        const { data: session, error } = await authClient.getSession()

        if (error || !session) {
          setStatus("error")
          setMessage(error?.message || "Failed to retrieve user session.")
          toast.error("Authentication failed: No active session found.")
          return
        }

        const redirectUrl = searchParams.get("redirect") || "/dashboard"

        setStatus("success")
        setMessage(`Login successful! Welcome back, ${session.user.name}. Redirecting...`)
        toast.success("Logged in successfully!")
        setTimeout(() => {
          router.push(redirectUrl)
          router.refresh()
        }, 1500)
      } catch (err) {
        setStatus("error")
        setMessage("An unexpected error occurred during verification.")
        toast.error("An unexpected error occurred")
        console.error(err)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#020617] p-6 font-mono text-white select-none">
      {/* Background ambient grids */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[4rem_4rem] opacity-45" />

      {/* Subtle background glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-125 w-125 rounded-full bg-cyan-500/1.5 blur-[150px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-125 w-125 rounded-full bg-blue-500/1.5 blur-[150px]" />

      <div className="relative z-10 w-full max-w-md">
        {status === "processing" && (
          <div className="transition-all duration-300">
            <Card className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-8 text-center shadow-2xl backdrop-blur-xl">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="absolute h-16 w-16 animate-ping rounded-full border border-cyan-500/20 opacity-25" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                    <Loader2Icon className="h-6 w-6 animate-spin" />
                  </div>
                </div>
                <h2 className="mb-2 text-sm font-bold tracking-wider text-white uppercase">
                  Authenticating
                </h2>
                <p className="max-w-xs font-sans text-xs leading-relaxed text-white/50">
                  {message}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {status === "success" && (
          <div className="transition-all duration-300">
            <Card className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-8 text-center shadow-2xl backdrop-blur-xl">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="absolute h-16 w-16 animate-ping rounded-full border border-emerald-500/20 opacity-25" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2Icon className="h-6 w-6" />
                  </div>
                </div>
                <h2 className="mb-2 text-sm font-bold tracking-wider text-emerald-400 uppercase">
                  Success
                </h2>
                <p className="max-w-xs font-sans text-xs leading-relaxed text-white/50">
                  {message}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {status === "error" && (
          <div className="transition-all duration-300">
            <Card className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-8 text-center shadow-2xl backdrop-blur-xl">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="absolute h-16 w-16 animate-ping rounded-full border border-red-500/20 opacity-25" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                    <AlertCircleIcon className="h-6 w-6" />
                  </div>
                </div>
                <h2 className="mb-2 text-sm font-bold tracking-wider text-red-400 uppercase">
                  Authentication Failed
                </h2>
                <p className="mb-6 max-w-xs font-sans text-xs leading-relaxed text-white/50">
                  {message}
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full cursor-pointer rounded-xl bg-cyan-500 py-2 font-mono text-xs font-bold text-white uppercase transition-all hover:bg-cyan-400 active:scale-[0.98]"
                >
                  Back to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OauthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#020617] font-mono text-white">
          <div className="animate-pulse text-xs tracking-wider text-white/40 uppercase">
            Loading Callback...
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
