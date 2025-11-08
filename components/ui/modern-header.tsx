import {
  IconMenu2,
  IconSearch,
  IconSettings,
  IconUser
} from "@tabler/icons-react"
import { FC } from "react"

interface ModernHeaderProps {
  title?: string
  onMenuClick?: () => void
  onSearchClick?: () => void
  onSettingsClick?: () => void
  onProfileClick?: () => void
}

export const ModernHeader: FC<ModernHeaderProps> = ({
  title = "Business Finder",
  onMenuClick,
  onSearchClick,
  onSettingsClick,
  onProfileClick
}) => {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors md:hidden"
            title="Menu"
          >
            <IconMenu2 size={20} />
          </button>

          <div className="flex items-center space-x-2">
            <div className="gradient-orb size-8 rounded-full opacity-90" />
            <div className="flex flex-col">
              <span className="text-foreground text-lg font-bold">
                MooMooMatch
              </span>
              <span className="text-muted-foreground hidden text-xs sm:block">
                AI Business Connector
              </span>
            </div>
          </div>
        </div>

        {/* Center Section - Chat Title (Desktop) */}
        <div className="hidden md:block">
          {title !== "Business Finder" && (
            <div className="bg-muted/50 text-foreground rounded-lg px-3 py-1 text-sm font-medium">
              {title}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onSearchClick}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
            title="Search (⌘K)"
          >
            <IconSearch size={20} />
          </button>

          <button
            onClick={onSettingsClick}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
            title="Settings"
          >
            <IconSettings size={20} />
          </button>

          <button
            onClick={onProfileClick}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
            title="Profile"
          >
            <IconUser size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
