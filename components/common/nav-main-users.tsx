"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  AirplayIcon,
  BotIcon,
  Coins,
  File,
  FileLineChart,
  FileSliders,
  Folder,
  HardDrive,
  HistoryIcon,
  LayoutGrid,
  PackageIcon,
  TrendingUp,
  Users2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CollapsibleMenu } from "./collapsible-menu"

export function NavMainUsers({ userType = "global" }: { userType?: string }) {
  const url = usePathname()
  const isInternal = userType === "internal"
  return (
    <div className="py-3">
      <SidebarGroup className="px-2 py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url === "/dashboard"}
              tooltip="Dashboard Sistem"
            >
              <Link href="/dashboard" prefetch>
                <LayoutGrid className="size-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Master Data</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/users/drive")}
              tooltip="Drive Config"
            >
              <Link href="/users/drive" prefetch>
                <HardDrive />
                <span>Drive Config</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/users/tiktok")}
              tooltip="TikTok"
            >
              <Link href="/users/tiktok" prefetch>
                <AirplayIcon />
                <span>TikTok Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/users/affilate/products/trend")}
              tooltip="Trend Produk"
            >
              <Link href="/users/affilate/products/trend" prefetch>
                <TrendingUp />
                <span>Trend Produk</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isInternal && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={url.startsWith("/users/affilate/products/internal")}
                tooltip="Internal Produk"
              >
                <Link href="/users/affilate/products/internal" prefetch>
                  <PackageIcon />
                  <span>Internal Produk</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Tugas</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/users/task/today")}
              tooltip="Tugas Hari Ini"
            >
              <Link href="/users/task/today" prefetch>
                <FileLineChart />
                <span>Tugas Hari Ini</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/users/task/all")}
              tooltip="Semua Tugas"
            >
              <Link href="/users/task/all" prefetch>
                <FileLineChart />
                <span>Tugas Saya</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/users/affilate/tiktok")}
              tooltip="TikTok"
            >
              <Link href="/users/affilate/tiktok" prefetch>
                <FileLineChart />
                <span>Data Tugas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}

          {/* <CollapsibleMenu
            item={{
              title: "Schedule",
              url: "/users/affilate/schedule",
              icon: FileSliders,
              isActive: url.includes("/users/affilate/schedule"),
              items: [
                {
                  title: "Schedule",
                  url: "/users/affilate/schedule",
                  isActive: url === "/users/affilate/schedule",
                },
              ],
            }}
          /> */}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  )
}
