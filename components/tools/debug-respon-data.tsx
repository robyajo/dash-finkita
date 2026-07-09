import React, { useState } from "react"
import { Copy, Check, Terminal, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DebugResponDataProps {
  data: any
  title?: string
}

export default function DebugResponData({
  data,
  title = "Debug Response Data",
}: DebugResponDataProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy data: ", err)
    }
  }

  return (
    <>
      {/* Trigger Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title={title}
          className="fixed top-1/2 right-0 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-l-2xl border border-r-0 border-zinc-200 bg-white text-zinc-600 shadow-2xl transition-all hover:w-14 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <Terminal className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        </button>
      )}

      {/* Floating Debug Panel */}
      {isOpen && (
        <div className="fixed top-1/2 right-4 z-50 flex max-h-[85vh] w-125 max-w-[calc(100vw-2rem)] -translate-y-1/2 flex-col rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Terminal className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>{title}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-1.5 rounded-lg border-zinc-200 px-3 text-xs font-semibold hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin Data</span>
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto rounded-b-2xl bg-zinc-950 p-5 dark:bg-black/40">
            <pre className="scrollbar-thin scrollbar-thumb-zinc-800 font-mono text-xs leading-relaxed text-zinc-300">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </>
  )
}
