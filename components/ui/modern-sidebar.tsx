import {
  IconPlus,
  IconClock,
  IconBookmark,
  IconSettings,
  IconChevronLeft
} from "@tabler/icons-react"
import { FC, useState } from "react"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onNewChat: () => void
}

export const ModernSidebar: FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onNewChat
}) => {
  const recentChats = [
    { id: "1", title: "Brooklyn Restaurants", timestamp: "2 hours ago" },
    { id: "2", title: "Manhattan Accounting", timestamp: "Yesterday" },
    { id: "3", title: "Queens Retail Stores", timestamp: "2 days ago" }
  ]

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-background fixed left-0 top-0 z-50 h-full w-80 border-r transition-transform duration-200 ease-in-out md:relative md:translate-x-0${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-foreground font-semibold">Chats</h2>
            <button
              onClick={onToggle}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-1.5 md:hidden"
            >
              <IconChevronLeft size={20} />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={onNewChat}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors"
            >
              <IconPlus size={20} />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          {/* Recent Chats */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pb-4">
              <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                <IconClock size={16} />
                Recent
              </div>

              <div className="space-y-1">
                {recentChats.map(chat => (
                  <button
                    key={chat.id}
                    className="hover:bg-muted flex w-full flex-col items-start rounded-lg p-3 text-left transition-colors"
                  >
                    <span className="text-foreground line-clamp-1 font-medium">
                      {chat.title}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {chat.timestamp}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t p-4">
            <div className="space-y-1">
              <button className="text-muted-foreground hover:bg-muted hover:text-foreground flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors">
                <IconBookmark size={18} />
                <span className="text-sm">Saved Businesses</span>
              </button>

              <button className="text-muted-foreground hover:bg-muted hover:text-foreground flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors">
                <IconSettings size={18} />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
