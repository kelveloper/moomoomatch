import { FC } from "react"
import { MooMooMascot } from "@/components/ui/moomoo-mascot"

interface SimpleHeaderProps {
  title?: string
  onMenuClick?: () => void
  onSearchClick?: () => void
  onSettingsClick?: () => void
  onProfileClick?: () => void
}

export const SimpleHeader: FC<SimpleHeaderProps> = ({
  title = "MooMooMatch",
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
            ☰
          </button>

          <div className="flex items-center space-x-2">
            <MooMooMascot size={32} animate={false} />
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
          {title !== "MooMooMatch" && (
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
            title="Search"
          >
            🔍
          </button>

          <button
            onClick={onSettingsClick}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
            title="Settings"
          >
            ⚙️
          </button>

          <button
            onClick={onProfileClick}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
            title="Profile"
          >
            👤
          </button>
        </div>
      </div>
    </header>
  )
}
