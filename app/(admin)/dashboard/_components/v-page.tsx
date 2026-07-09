"use client"

import AdminMainPageAdmin from "@/components/common/admin-main-page"
import { authClient } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense } from "react"
import { toast } from "sonner"
import DashboardContentAdmin from "./content-admin"
import DashboardContentUser from "./content-user"

function DashboardToast() {
    const searchParams = useSearchParams()

    React.useEffect(() => {
        if (searchParams.get("login") === "success") {
            toast.success("Logged in successfully!", { duration: 4000 })
            window.history.replaceState({}, "", "/dashboard")
        }
    }, [searchParams])

    return null
}

export default function VPageDashboard() {
    const router = useRouter()
    const [sessionData, setSessionData] = React.useState<any>(null)
    const [isPending, setIsPending] = React.useState(true)

    React.useEffect(() => {
        authClient.getSession().then(({ data, error }) => {
            if (error || !data) {
                console.error("[DASHBOARD] Session fetch failed:", error)
                setSessionData(null)
            } else {
                setSessionData(data)
            }
        }).finally(() => {
            setIsPending(false)
        })
    }, [])

    React.useEffect(() => {
        if (!isPending && !sessionData) {
            router.push("/")
        }
    }, [sessionData, isPending, router])

    // if (isPending) {
    //     return (
    //         <div className="flex h-screen w-screen items-center justify-center bg-background">
    //             <div className="flex flex-col items-center gap-2">
    //                 <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    //                 <p className="text-sm font-medium text-muted-foreground">
    //                     Checking session...
    //                 </p>
    //             </div>
    //         </div>
    //     )
    // }

    // if (!sessionData) {
    //     return null
    // }

    return (
        <AdminMainPageAdmin breadcrumb={[{ label: "Dashboard" }]}>
            <Suspense fallback={null}>
                <DashboardToast />
            </Suspense>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {(sessionData?.user as any)?.role === "ADMIN" ? (
                    <DashboardContentAdmin />
                ) : (
                    <DashboardContentUser />
                )}
            </div>
        </AdminMainPageAdmin>
    )
}
