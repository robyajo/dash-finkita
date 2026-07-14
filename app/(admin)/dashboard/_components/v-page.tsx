"use client"

import AdminMainPageAdmin from "@/components/common/admin-main-page"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import React from "react"
import DashboardContentAdmin from "./content-admin"
import DashboardContentUser from "./content-user"

export default function VPageDashboard() {
    const router = useRouter()
    const { data: session, isPending, error } = authClient.useSession()

    React.useEffect(() => {
        console.log("[DASHBOARD] useSession →", { session, isPending, error })
    }, [session, isPending, error])

    React.useEffect(() => {
        if (!isPending && !session) {
            console.log("[DASHBOARD] No session, redirecting to /")
            router.push("/")
        }
    }, [session, isPending, router])

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

    return (
        <AdminMainPageAdmin breadcrumb={[{ label: "Dashboard" }]}>
            {(session.user as any)?.role === "ADMIN" ? (
                <DashboardContentAdmin />
            ) : (
                <DashboardContentUser />
            )}
        </AdminMainPageAdmin>
    )
}
