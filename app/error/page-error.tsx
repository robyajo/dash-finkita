"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  RotateCcw,
  Home,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}
export default function PageError({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    console.error("Dashboard error boundary:", error)
  }, [error])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(error.stack || error.message || String(error))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 p-6 text-white shadow-2xl">
      {/* Background gradients */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/3 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[80px]" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center space-y-6 text-center">
        {/* Warning Icon Box */}
        <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
            System Error
          </span>
          <h2 className="bg-linear-to-b from-white to-zinc-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl">
            Something went wrong!
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
            An unexpected error occurred while processing this page. Please try
            reloading or contact system support.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex w-full flex-col items-center justify-center gap-3 pt-2 sm:w-auto sm:flex-row">
          <Button
            onClick={() => reset()}
            className="w-full cursor-pointer bg-red-600 text-white shadow-lg shadow-red-600/10 transition-all hover:bg-red-500 hover:shadow-red-600/25 sm:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full cursor-pointer border-zinc-800 bg-zinc-900/50 text-zinc-300 backdrop-blur-sm hover:bg-zinc-900 hover:text-white sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>

        {/* Expandable Error Details */}
        <div className="w-full overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/80 text-left shadow-inner">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between p-4 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-900/40 hover:text-white"
          >
            <span className="flex items-center gap-2">
              Error Details
              {error.digest && (
                <span className="font-mono text-[10px] text-zinc-600">
                  (Digest: {error.digest})
                </span>
              )}
            </span>
            {showDetails ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {showDetails && (
            <div className="relative border-t border-zinc-900 bg-zinc-950 p-4">
              <button
                onClick={copyToClipboard}
                className="absolute top-2.5 right-2.5 rounded-md border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:text-white"
                title="Copy Error stack"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <pre className="max-h-48 overflow-y-auto pr-6 font-mono text-[10px] whitespace-pre-wrap text-red-300 select-text">
                {error.stack || error.message || String(error)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-size-[14px_24px] opacity-40" />
    </div>
  )
}
