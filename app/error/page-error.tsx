"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-6 text-foreground">
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center space-y-6 text-center">
        <Image
          src="/assets/500.png"
          alt="500 Server Error"
          width={280}
          height={280}
          priority
        />

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
            System Error
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Something went wrong!
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            An unexpected error occurred while processing this page. Please try
            reloading or contact system support.
          </p>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-3 pt-2 sm:w-auto sm:flex-row">
          <Button
            onClick={() => reset()}
            className="w-full cursor-pointer sm:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full cursor-pointer sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>

        <div className="w-full overflow-hidden rounded-xl border bg-muted/30 text-left">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between p-4 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              Error Details
              {error.digest && (
                <span className="font-mono text-[10px] text-muted-foreground/60">
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
            <div className="relative border-t bg-muted/20 p-4">
              <button
                onClick={copyToClipboard}
                className="absolute top-2.5 right-2.5 rounded-md border bg-background p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                title="Copy Error stack"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <pre className="max-h-48 overflow-y-auto pr-6 font-mono text-[10px] whitespace-pre-wrap text-destructive select-text">
                {error.stack || error.message || String(error)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
