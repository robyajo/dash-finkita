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
  Database,
  FileSliders,
  HardDrive,
  LayoutGrid,
  PackageIcon,
  Users2,
  Clock,
  Image,
  FileLock,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CollapsibleMenu } from "./collapsible-menu"

export function NavMainAdmin() {
  const url = usePathname()
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
        <SidebarGroupLabel>Monitoring Sistem</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/admin/config/monitoring/logs")}
              tooltip="AI Config"
            >
              <Link href="/admin/config/monitoring/logs" prefetch>
                <BotIcon />
                <span>App</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/admin/config/monitoring/logs/nginx")}
              tooltip="Nginx Logs"
            >
              <Link href="/admin/config/monitoring/logs/nginx" prefetch>
                <FileText />
                <span>Nginx</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/admin/config/monitoring/redis")}
              tooltip="Redis Monitor"
            >
              <Link href="/admin/config/monitoring/redis" prefetch>
                <Database />
                <span>Redis</span>
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
              isActive={url.startsWith("/admin/config/ai")}
              tooltip="AI Config"
            >
              <Link href="/admin/config/ai" prefetch>
                <BotIcon />
                <span>AI Config</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/admin/config/logic-tren-fastmoss")}
              tooltip="Logic FastMoss"
            >
              <Link href="/admin/config/logic-tren-fastmoss" prefetch>
                <FileLock />
                <span>Logic FastMoss</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/admin/config/drive")}
              tooltip="Drive Config"
            >
              <Link href="/admin/config/drive" prefetch>
                <HardDrive />
                <span>Drive Config</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/admin/user")}
              tooltip="User"
            >
              <Link href="/admin/user" prefetch>
                <Users2 />
                <span>Pengguna</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/admin/config/background")}
              tooltip="Background"
            >
              <Link href="/admin/config/background" prefetch>
                <Image />
                <span>Background</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/admin/config/schedules")}
              tooltip="Waktu Posting"
            >
              <Link href="/admin/config/schedules" prefetch>
                <Clock />
                <span>Waktu Posting</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith("/admin/tiktok")}
              tooltip="TikTok"
            >
              <Link href="/admin/tiktok" prefetch>
                <AirplayIcon />
                <span>TikTok</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Master Data Produk  */}
          <CollapsibleMenu
            item={{
              title: "Produk",
              url: "/admin/config/products",
              icon: PackageIcon,
              isActive: url.startsWith("/admin/config/products"),
              items: [
                {
                  title: "Kategori Produk",
                  url: "/admin/config/products/categories",
                  isActive: url.startsWith("/admin/config/products/categories"),
                },
                {
                  title: "Tagar Produk",
                  url: "/admin/config/products/tagar",
                  isActive: url.startsWith("/admin/config/products/tagar"),
                },
                {
                  title: "Produk Internal",
                  url: "/admin/config/products/internal",
                  isActive: url.startsWith("/admin/config/products/internal"),
                },
                {
                  title: "Produk Fastmoss",
                  url: "/admin/config/products/fastmoss",
                  isActive: url.startsWith("/admin/config/products/fastmoss"),
                },
              ],
            }}
          />
        </SidebarMenu>
      </SidebarGroup>
      {/* <SidebarGroup>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url === "/master/account/tiktok"}
              tooltip="TikTok Account"
            >
              <Link href="/master/account/tiktok" prefetch>
                <FileSliders />
                <span>TikTok Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={url === "/data-penjua lan"}
              tooltip="Data Penjualan"
            >
              <Link href="/data-penjualan" prefetch>
                <FileSliders />
                <span>Shope Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup> */}
    </div>
  )
}
