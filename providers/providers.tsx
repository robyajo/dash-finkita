"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/theme-provider"

import QueryProvider from "./query-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <QueryProvider>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors closeButton position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  )
}
