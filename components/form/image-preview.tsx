"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface ImagePreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string | null
  alt?: string
}

export default function ImagePreview({
  open,
  onOpenChange,
  src,
  alt = "Image preview",
}: ImagePreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    if (open) {
      window.addEventListener("keydown", handleEsc)
    }
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, onOpenChange])

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex animate-in items-center justify-center bg-black/85 p-4 backdrop-blur-sm duration-200 fade-in"
      onClick={() => onOpenChange(false)}
    >
      <button
        className="absolute top-4 right-4 z-9999 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        onClick={() => onOpenChange(false)}
        type="button"
      >
        <X className="size-5" />
      </button>
      {src && (
        <Image
          width={640}
          height={480}
          src={src}
          alt={alt}
          className="max-h-[90vh] max-w-[95vw] animate-in rounded-xl border border-white/10 object-contain shadow-2xl duration-200 zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>,
    document.body
  )
}
