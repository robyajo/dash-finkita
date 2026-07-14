"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page403() {
  const router = useRouter()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 text-foreground">
      <div className="relative z-10 flex max-w-md flex-col items-center space-y-6 text-center">
        <Image
          src="/assets/403.png"
          alt="403 Access Denied"
          width={280}
          height={280}
          priority
        />

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Access Denied</h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            You don&apos;t have permission to access this resource. Please
            contact your administrator if you believe this is a mistake.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3 pt-2 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            className="w-full cursor-pointer sm:w-auto"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Link href="/">
            <Button className="w-full cursor-pointer sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
