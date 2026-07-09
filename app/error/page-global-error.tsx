"use client"

import { useEffect, useState } from "react"
import { AlertOctagon, RotateCcw, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageGlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PageGlobalError({
  error,
  reset,
}: PageGlobalErrorProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    console.error("Critical root app crash:", error)
  }, [error])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(error.stack || error.message || String(error))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <html lang="en" className="dark">
      <body className="relative flex min-h-screen w-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 font-sans text-white antialiased">
        {/* Background gradients */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[90px]" />

        <div className="relative z-10 flex w-full max-w-lg flex-col items-center space-y-6 text-center">
          {/* Warning Icon Box */}
          <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_60px_rgba(239,68,68,0.15)]">
            <AlertOctagon className="h-10 w-10 text-red-500" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
              Critical Crash
            </span>
            <h2 className="bg-linear-to-b from-white to-zinc-400 bg-clip-text text-3xl font-black tracking-tight text-transparent">
              System Crash Detected
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
              A critical core system layout error has occurred. You can attempt
              to refresh the app layout cache below or contact support.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex w-full flex-col items-center justify-center gap-3 pt-2 sm:w-auto sm:flex-row">
            <Button
              onClick={() => reset()}
              className="w-full cursor-pointer bg-red-600 text-white shadow-lg shadow-red-600/10 transition-all hover:bg-red-500 hover:shadow-red-600/25 sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset App Session
            </Button>

            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full cursor-pointer border-zinc-800 bg-zinc-900/50 text-zinc-300 backdrop-blur-sm hover:bg-zinc-900 hover:text-white sm:w-auto"
            >
              {copied ? (
                <Check className="mr-2 h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? "Copied Logs" : "Copy Crash Logs"}
            </Button>
          </div>
        </div>

        {/* Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-size-[14px_24px] opacity-40" />
      </body>
    </html>
  )
}
