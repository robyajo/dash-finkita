// import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { createMetadata } from "@/lib/metadata"
import { siteConfig } from "@/config/site"
import ErrorBoundary from "@/providers/error-boundary"
import { Providers } from "@/providers/providers"
import { Inter } from "next/font/google";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


// const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

// const fontMono = Geist_Mono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// })
export const metadata = createMetadata({
  metadataBase: new URL(siteConfig.url.base),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url.author,
    },
  ],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url.base,
    languages: {
      "id-ID": "/",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    // apple: "/apple-touch-icon.png",
  },
  category: "government",
  classification: "government services",
  applicationName: siteConfig.name,
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning className={cn("font-sans", inter.variable)}

    >
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
