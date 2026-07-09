
import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutBottomIcon } from "@hugeicons/core-free-icons"
import { siteConfig } from "@/config/site"
import Image from "next/image"
import { Geist_Mono, Inter } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="id"
            suppressHydrationWarning
            className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
        >
            <body>
                {/* Layout UI */}
                {/* Place children where you want to render a page or nested layout */}
                <main>
                    <div className="grid min-h-svh lg:grid-cols-2">
                        <div className="flex flex-col gap-4 p-6 md:p-10">
                            <div className="flex justify-center gap-2 md:justify-start">
                                <a href="#" className="flex items-center gap-2 font-medium">
                                    <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                        <HugeiconsIcon icon={LayoutBottomIcon} strokeWidth={2} className="size-4" />
                                    </div>
                                    {siteConfig.name}
                                </a>
                            </div>
                            <div className="flex flex-1 items-center justify-center">
                                <div className="w-full max-w-xs">
                                    {children}
                                </div>
                            </div>
                        </div>
                        <div className="relative hidden bg-muted lg:block">
                            <Image
                                width={1287}
                                height={800}
                                src="https://images.unsplash.com/photo-1695009668450-c0f71243aefa?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Image"
                                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            />
                        </div>
                    </div>

                </main>
            </body>
        </html>
    )
}