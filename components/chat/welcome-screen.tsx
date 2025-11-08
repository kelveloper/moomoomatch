import {
  IconBuilding,
  IconMapPin,
  IconToolsKitchen2
} from "@tabler/icons-react"
import { FC } from "react"

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void
}

export const WelcomeScreen: FC<WelcomeScreenProps> = ({
  onSuggestionClick
}) => {
  const suggestions = [
    {
      icon: <IconToolsKitchen2 size={24} className="text-orange-500" />,
      title: "Brooklyn Restaurants",
      subtitle: "Find dining spots in Brooklyn",
      query: "Find Italian restaurants in Brooklyn"
    },
    {
      icon: <IconBuilding size={24} className="text-blue-500" />,
      title: "Manhattan Accounting",
      subtitle: "Professional services in Manhattan",
      query: "Find accounting firms in Manhattan"
    },
    {
      icon: <IconMapPin size={24} className="text-green-500" />,
      title: "Food Services",
      subtitle: "Discover food businesses across NYC",
      query: "Show me food service businesses in NYC"
    }
  ]

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      {/* Hero Orb */}
      <div className="mb-8 flex items-center justify-center">
        <div className="gradient-orb size-24 rounded-full opacity-80" />
      </div>

      {/* Welcome Text */}
      <div className="mb-12 text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Welcome to Business Finder
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover NYC small businesses in seconds
        </p>
        <p className="text-muted-foreground text-base">
          Connect builders with opportunities
        </p>
      </div>

      {/* Suggestion Cards */}
      <div className="mb-8 grid w-full max-w-4xl gap-4 md:grid-cols-3">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="card-hover bg-card shadow-soft hover:border-primary/20 group rounded-lg border p-6 text-left transition-all"
          >
            <div className="mb-3 flex items-center space-x-3">
              <div className="bg-muted group-hover:bg-primary/10 rounded-lg p-2">
                {suggestion.icon}
              </div>
            </div>
            <h3 className="text-card-foreground mb-1 font-semibold">
              {suggestion.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {suggestion.subtitle}
            </p>
          </button>
        ))}
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
