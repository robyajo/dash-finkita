import { type ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "../site-header"
import { AppSidebar } from "../app-sidebar"

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
    <>

      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <SiteHeader breadcrumb={breadcrumb} />
        <div className="flex flex-1 min-w-0 w-full overflow-x-hidden">
          <AppSidebar variant="inset" />
          <SidebarInset className="flex min-h-0 flex-1 w-0 min-w-0">
            <div className="flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto p-4 sm:gap-4 sm:p-6 lg:gap-6 lg:p-8">
              {CtaBanner}
              {SummaryCard}
              <div className="flex-1 min-w-0">{children}</div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>

    </>
  )
}
