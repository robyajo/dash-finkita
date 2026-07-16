"use client"

import AdminMainPageAdmin from "@/components/common/admin-main-page"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import React from "react"
import DashboardContentAdmin from "./content-admin"
import DashboardContentUser from "./content-user"

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

export default function VPageDashboard() {
    const router = useRouter()
    const { data: session, isPending, error, refetch } = authClient.useSession()

    const [newPassword, setNewPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [dialogError, setDialogError] = React.useState<string | null>(null)

    React.useEffect(() => {
        console.log("[DASHBOARD] useSession →", { session, isPending, error })
    }, [session, isPending, error])

    React.useEffect(() => {
        if (!isPending && !session) {
            console.log("[DASHBOARD] No session, redirecting to /")
            router.push("/")
        }
    }, [session, isPending, router])

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

    if (isPending) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm font-medium text-muted-foreground">
                        Checking session...
                    </p>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <p className="text-sm text-muted-foreground">Redirecting...</p>
            </div>
        )
    }

    const showSetPasswordModal = !isPending && session && !(session.user as any)?.hasPassword

    return (
        <>
            <AdminMainPageAdmin breadcrumb={[{ label: "Dashboard" }]}>
                {(session.user as any)?.role === "ADMIN" ? (
                    <DashboardContentAdmin />
                ) : (
                    <DashboardContentUser />
                )}
            </AdminMainPageAdmin>

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
        </>
    )
}
