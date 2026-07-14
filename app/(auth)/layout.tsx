import { siteConfig } from "@/config/site"
import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <Link href="/" className="flex items-center gap-2 font-medium">
                    <div className="relative flex size-8 items-center justify-center ">
                        <Image
                            src={siteConfig.logo.icon}
                            className="size-full rounded-md"
                            alt={siteConfig.name}
                            width={32}
                            height={32}
                            priority
                        />
                    </div>
                    <span className="text-lg font-semibold">{siteConfig.name}</span>
                </Link>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-sm">
                        {children}
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-linear-to-br from-primary/10 via-muted to-primary/5 lg:flex lg:flex-col lg:items-center lg:justify-center">
                <div className="relative z-10 mx-auto max-w-md space-y-6 p-10 text-center">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-medium leading-relaxed text-balance">
                            &ldquo;Kelola keuangan rumah tangga Anda dengan mudah. Catat pemasukan,
                            pengeluaran, dan pantau dompet dalam satu aplikasi.&rdquo;
                        </p>
                        <footer className="text-sm text-muted-foreground">
                            {siteConfig.description}
                        </footer>
                    </blockquote>
                </div>
                {/* Decorative pattern */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--primary)_1%,transparent_60%)] opacity-[0.07]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--primary)_1%,transparent_30%)] opacity-[0.05]" />
            </div>
        </div>
    )
}
