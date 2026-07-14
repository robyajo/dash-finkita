"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import NotificationDropdown from "@/components/common/notification-dropdown"
import { BreadcrumbItemType } from "@/types"
import { useTheme } from "next-themes"
import { Fragment } from "react"

export function SiteHeader({
  breadcrumb,
}: {
  breadcrumb?: BreadcrumbItemType[]
}) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-full"
        />

        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb.map((item, index) => (
                <Fragment key={index}>
                  <BreadcrumbItem
                    className={
                      index < breadcrumb.length - 1
                        ? "hidden md:block"
                        : undefined
                    }
                  >
                    {item.href ? (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumb.length - 1 && (
                    <BreadcrumbSeparator
                      key={`sep-${index}`}
                      className="hidden md:block"
                    />
                  )}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <div className="flex items-center gap-2 ml-auto ">
          <NotificationDropdown />
          <AnimatedThemeToggler
            theme={theme as "light" | "dark" | undefined}
            onThemeChange={(newTheme) => setTheme(newTheme)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          />
        </div>
      </div>
    </header>
  )
}
