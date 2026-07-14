import { type ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "../site-header"
import { AppSidebar } from "../app-sidebar"
import { SidebarRight } from "../sidebar-right"
import { SidebarLeft } from "../sidebar-left"

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
    </SidebarProvider>
  )
}
