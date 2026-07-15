"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2Icon, AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { isMobile } from "@/lib/auth-mobile"

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
        setTimeout(() => router.replace("/"), 2000)
        return
      }

      try {
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
          // On mobile, use deep link to redirect back to the app
          // The app's WebView or native handler will pick up this URL
          if (isMobile()) {
            const appScheme = process.env.NEXT_PUBLIC_APP_SCHEME || "finkita"
            const deepLink = `${appScheme}://auth/success?path=${encodeURIComponent(redirectUrl)}`
            window.location.href = deepLink
          } else {
            router.push(redirectUrl)
            router.refresh()
          }
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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-6 text-foreground">
      <div className="relative z-10 w-full max-w-md">
        {status === "processing" && (
          <div className="transition-all duration-300">
            <Card className="overflow-hidden rounded-2xl border p-8 text-center shadow-2xl">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Loader2Icon className="h-6 w-6 animate-spin" />
                  </div>
                </div>
                <h2 className="mb-2 text-sm font-bold tracking-wider uppercase">
                  Authenticating
                </h2>
                <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                  {message}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {status === "success" && (
          <div className="transition-all duration-300">
            <Card className="overflow-hidden rounded-2xl border p-8 text-center shadow-2xl">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2Icon className="h-6 w-6" />
                  </div>
                </div>
                <h2 className="mb-2 text-sm font-bold tracking-wider text-emerald-500 uppercase">
                  Success
                </h2>
                <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                  {message}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {status === "error" && (
          <div className="transition-all duration-300">
            <Card className="overflow-hidden rounded-2xl border p-8 text-center shadow-2xl">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
                    <AlertCircleIcon className="h-6 w-6" />
                  </div>
                </div>
                <h2 className="mb-2 text-sm font-bold tracking-wider text-destructive uppercase">
                  Authentication Failed
                </h2>
                <p className="mb-6 max-w-xs text-xs leading-relaxed text-muted-foreground">
                  {message}
                </p>
                <Button
                  onClick={() => router.push("/")}
                  className="w-full cursor-pointer rounded-xl"
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
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <div className="animate-pulse text-xs tracking-wider text-muted-foreground uppercase">
            Loading Callback...
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
