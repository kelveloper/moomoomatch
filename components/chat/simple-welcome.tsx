import { FC } from "react"
import { MooMooMascot } from "@/components/ui/moomoo-mascot"

interface SimpleWelcomeProps {
  onSuggestionClick: (suggestion: string) => void
}

export const SimpleWelcome: FC<SimpleWelcomeProps> = ({
  onSuggestionClick
}) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      {/* MooMoo Mascot */}
      <div className="mb-6 mt-8 flex items-center justify-center">
        <MooMooMascot size={120} className="drop-shadow-lg" />
      </div>

      {/* Welcome Text */}
      <div className="mb-10 text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Welcome to MooMooMatch
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover NYC small businesses in seconds
        </p>
        <p className="text-muted-foreground text-base">
          Connect builders with opportunities
        </p>
      </div>

      {/* Simple Suggestion Cards */}
      <div className="mb-8 grid w-full max-w-4xl gap-4 md:grid-cols-3">
        <button
          onClick={() =>
            onSuggestionClick("Find Italian restaurants in Brooklyn")
          }
          className="card-hover bg-card shadow-soft hover:border-primary/20 group rounded-lg border p-6 text-left transition-all"
        >
          <div className="mb-3 flex items-center space-x-3">
            <div className="bg-muted group-hover:bg-primary/10 rounded-lg p-2">
              🍕
            </div>
          </div>
          <h3 className="text-card-foreground mb-1 font-semibold">
            Brooklyn Restaurants
          </h3>
          <p className="text-muted-foreground text-sm">
            Find dining spots in Brooklyn
          </p>
        </button>

        <button
          onClick={() =>
            onSuggestionClick("Find accounting firms in Manhattan")
          }
          className="card-hover bg-card shadow-soft hover:border-primary/20 group rounded-lg border p-6 text-left transition-all"
        >
          <div className="mb-3 flex items-center space-x-3">
            <div className="bg-muted group-hover:bg-primary/10 rounded-lg p-2">
              🏢
            </div>
          </div>
          <h3 className="text-card-foreground mb-1 font-semibold">
            Manhattan Accounting
          </h3>
          <p className="text-muted-foreground text-sm">
            Professional services in Manhattan
          </p>
        </button>

        <button
          onClick={() =>
            onSuggestionClick("Show me food service businesses in NYC")
          }
          className="card-hover bg-card shadow-soft hover:border-primary/20 group rounded-lg border p-6 text-left transition-all"
        >
          <div className="mb-3 flex items-center space-x-3">
            <div className="bg-muted group-hover:bg-primary/10 rounded-lg p-2">
              📍
            </div>
          </div>
          <h3 className="text-card-foreground mb-1 font-semibold">
            Food Services
          </h3>
          <p className="text-muted-foreground text-sm">
            Discover food businesses across NYC
          </p>
        </button>
      </div>

      {/* Additional Quick Actions */}
      <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
        <span>Try:</span>
        <button
          onClick={() => onSuggestionClick("Find tech startups in Brooklyn")}
          className="bg-muted hover:bg-primary/10 hover:text-primary rounded-full px-3 py-1 transition-colors"
        >
          Tech startups
        </button>
        <button
          onClick={() => onSuggestionClick("Show me retail stores in Queens")}
          className="bg-muted hover:bg-primary/10 hover:text-primary rounded-full px-3 py-1 transition-colors"
        >
          Retail stores
        </button>
        <button
          onClick={() =>
            onSuggestionClick("Find healthcare businesses in Manhattan")
          }
          className="bg-muted hover:bg-primary/10 hover:text-primary rounded-full px-3 py-1 transition-colors"
        >
          Healthcare
        </button>
      </div>
    </div>
  )
}
