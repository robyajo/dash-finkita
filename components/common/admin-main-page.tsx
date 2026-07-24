"use client"

import * as React from "react"
import { type ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "../site-header"
import { AppSidebar } from "../app-sidebar"
import { SidebarRight } from "../sidebar-right"
import { SidebarLeft } from "../sidebar-left"
import { authClient } from "@/lib/auth-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputPassword } from "@/components/form/input-password"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axios from "@/lib/axios"

export interface BreadcrumbItemType {
  label: string
  href?: string
}

export default function AdminMainPageAdmin({
  children,
  breadcrumb,
  CtaBanner,
  SummaryCard,
}: {
  children: ReactNode
  breadcrumb?: BreadcrumbItemType[]
  CtaBanner?: ReactNode
  SummaryCard?: ReactNode
}) {
  const { data: session, isPending, refetch } = authClient.useSession()

  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [dialogError, setDialogError] = React.useState<string | null>(null)

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setDialogError(null)

    if (newPassword.length < 8) {
      setDialogError("Password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setDialogError("Passwords do not match")
      return
    }

    try {
      setIsSubmitting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      await axios.put(`${apiUrl}/api/profile`, {
        password: newPassword,
        confirmPassword: confirmPassword,
      })
      toast.success("Password configured successfully")
      await refetch()
    } catch (err: any) {
      console.error("Failed to set password:", err)
      const errMsg = err.response?.data?.error || "Failed to configure password. Please try again."
      setDialogError(errMsg)
      toast.error(errMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const showSetPasswordModal = !!(
    !isPending &&
    session &&
    session.user.role === "USER" &&
    !(session.user as any)?.hasPassword
  )

  return (
    <SidebarProvider
    >
      <SidebarLeft />
      {/* <AppSidebar variant="inset" /> */}
      <SidebarInset>
        <SiteHeader breadcrumb={breadcrumb} />
        <div className="flex flex-1 flex-col gap-4 p-4">

          {CtaBanner}
          {SummaryCard}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </SidebarInset>
      <SidebarRight />

      <Dialog open={showSetPasswordModal}>
        <DialogContent 
          className="sm:max-w-md" 
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Set Up Your Password</DialogTitle>
            <DialogDescription>
              You logged in using Google. For security and to allow email login later, please configure a password for your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSetPassword} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <InputPassword
                id="new-password"
                placeholder="Enter new password (min 8 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <InputPassword
                id="confirm-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            {dialogError && (
              <p className="text-sm font-medium text-destructive">{dialogError}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Password"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
