"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { BreadcrumbItemType } from "@/types"
import { PanelLeftIcon } from "lucide-react"
import { Fragment, type ReactNode } from "react"

export function SiteHeader({
  breadcrumb,
}: {
  breadcrumb?: BreadcrumbItemType[]
}) {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
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

        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
      </div>
    </header>
  )
}
