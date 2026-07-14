"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NotificationBadge from "@/components/smoothui/notification-badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { NotificationIcon } from "@hugeicons/core-free-icons"

export interface NotificationItem {
  id: string
  user: string
  avatar?: string
  initials: string
  action: string
  target: string
  time: string
  unread: boolean
}

export interface NotificationDropdownProps {
  notifications?: NotificationItem[]
  totalCount?: number
}

const defaultNotifications: NotificationItem[] = [
  {
    id: "1",
    user: "Sarah Chen",
    initials: "SC",
    action: "commented on",
    target: "Design System v2",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    user: "James Wilson",
    initials: "JW",
    action: "shared",
    target: "Q4 Report",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    user: "Emily Davis",
    initials: "ED",
    action: "invited you to",
    target: "Project Alpha",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: "4",
    user: "Alex Rivera",
    initials: "AR",
    action: "assigned you to",
    target: "API Integration",
    time: "5 hours ago",
    unread: false,
  },
]

export default function NotificationDropdown({
  notifications = defaultNotifications,
  totalCount,
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter((n) => n.unread).length
  const count = totalCount ?? unreadCount

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <NotificationBadge variant="count" count={count} showZero>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <HugeiconsIcon
                icon={NotificationIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
          </NotificationBadge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <button className="text-xs font-normal text-muted-foreground underline-offset-2 hover:underline">
              Mark all as read
            </button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 py-2.5 cursor-pointer"
                >
                  <Avatar className="mt-0.5 size-8 shrink-0">
                    {notification.avatar && (
                      <AvatarImage
                        src={notification.avatar}
                        alt={notification.user}
                      />
                    )}
                    <AvatarFallback>{notification.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <p className="text-sm leading-snug truncate">
                      <span className="font-medium">{notification.user}</span>{" "}
                      <span className="text-muted-foreground">
                        {notification.action}
                      </span>{" "}
                      <span className="font-medium">{notification.target}</span>
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  {notification.unread && (
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
          {notifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer text-sm text-muted-foreground">
                View all notifications
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
