"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
export default function Page404() {
  const router = useRouter()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 text-white">
      {/* Background gradients */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/3 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative z-10 flex max-w-md flex-col items-center space-y-6 text-center">
        {/* Glow icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
          <AlertCircle className="h-10 w-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h1 className="bg-linear-to-b from-white to-zinc-400 bg-clip-text text-8xl font-black tracking-tighter text-transparent drop-shadow-sm select-none">
            404
          </h1>
          <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
          <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
            Oops! The page you are looking for doesn't exist, has been moved, or
            is temporarily unavailable.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3 pt-2 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            className="w-full cursor-pointer border-zinc-800 bg-zinc-900/50 text-zinc-300 backdrop-blur-sm hover:bg-zinc-900 hover:text-white sm:w-auto"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>

      {/* Decorative dots grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] opacity-40" />
    </div>
  )
}
