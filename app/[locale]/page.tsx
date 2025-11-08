"use client"

import { useState } from "react"
import { IconSearch, IconMapPin, IconBuilding } from "@tabler/icons-react"

interface Business {
  vendor_formal_name: string
  vendor_dba?: string
  address1: string
  city: string
  borough?: string
  naics_sector: string
  naics_title: string
  telephone?: string
  website?: string
  business_description?: string
}

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTime, setSearchTime] = useState<number | null>(null)

  const searchBusinesses = async () => {
    if (!query.trim()) return

    setLoading(true)
    const startTime = Date.now()

    try {
      const response = await fetch(
        `/api/businesses/search?q=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      setBusinesses(data.businesses || [])
      setSearchTime(Date.now() - startTime)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchBusinesses()
    }
  }

  return (
    <div className="flex size-full flex-col">
      {/* Header */}
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-2 text-5xl font-bold text-blue-600">MooMooMatch</div>
        <div className="mb-8 max-w-2xl text-center text-xl text-gray-600">
          Connect Pursuit builders with NYC small businesses in seconds
        </div>

        {/* Search Bar */}
        <div className="flex w-full max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Try: 'Italian restaurants in Brooklyn' or 'accounting firms in Manhattan'"
            className="flex-1 rounded-l-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchBusinesses}
            disabled={loading}
            className="flex items-center rounded-r-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            <IconSearch size={20} />
          </button>
        </div>

        {searchTime && (
          <div className="mt-2 text-sm text-gray-500">
            Found {businesses.length} businesses in {searchTime}ms
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 px-4 pb-4">
        {loading && (
          <div className="py-8 text-center">
            <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <div className="mt-2 text-gray-600">
              Searching NYC businesses...
            </div>
          </div>
        )}

        {businesses.length > 0 && (
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {businesses.slice(0, 20).map((business, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 text-lg font-semibold text-blue-700">
                    {business.vendor_dba || business.vendor_formal_name}
                  </div>

                  <div className="mb-1 flex items-center text-gray-600">
                    <IconMapPin size={16} className="mr-1" />
                    <span className="text-sm">
                      {business.address1}, {business.city}
                    </span>
                  </div>

                  <div className="mb-2 flex items-center text-gray-600">
                    <IconBuilding size={16} className="mr-1" />
                    <span className="text-sm">{business.naics_title}</span>
                  </div>

                  {business.borough && (
                    <div className="mb-2 inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                      {business.borough}
                    </div>
                  )}

                  {business.business_description && (
                    <p className="mb-2 line-clamp-3 text-sm text-gray-700">
                      {business.business_description}
                    </p>
                  )}

                  <div className="flex gap-2 text-sm">
                    {business.telephone && (
                      <span className="text-blue-600">
                        {business.telephone}
                      </span>
                    )}
                    {business.website && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && businesses.length === 0 && query && (
          <div className="py-8 text-center text-gray-600">
            No businesses found. Try a different search term.
          </div>
        )}
      </div>
    </div>
  )
}
