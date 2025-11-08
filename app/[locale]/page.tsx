"use client"

import { useState, useRef, useEffect } from "react"
import {
  IconRobot,
  IconUser,
  IconMapPin,
  IconBuilding,
  IconSend
} from "@tabler/icons-react"
import { SimpleWelcome } from "@/components/chat/simple-welcome"
import { SimpleBusinessCard } from "@/components/chat/simple-business-card"
import { SimpleHeader } from "@/components/ui/simple-header"
import { SimpleChatInput } from "@/components/ui/simple-chat-input"

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

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  businesses?: Business[]
  timestamp: Date
}

interface BusinessAnalysis {
  business: string
  fullBusinessData: any
  analysis: string
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm MooMooMatch, your AI assistant for connecting Pursuit builders with NYC small businesses. Ask me to find businesses like 'Italian restaurants in Brooklyn' or 'accounting firms in Manhattan' and I'll help you discover great opportunities!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [businessAnalysis, setBusinessAnalysis] =
    useState<BusinessAnalysis | null>(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    setIsClient(true)
    scrollToBottom()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const messageText = input

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat/moomoomatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: messageText,
          messages: messages
        })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        businesses: data.businesses,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat failed:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = async (suggestion: string) => {
    if (loading) return

    setInput(suggestion)

    // Create user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: suggestion,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat/moomoomatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: suggestion,
          messages: messages
        })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        businesses: data.businesses,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat failed:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleBusinessClick = async (business: Business) => {
    setLoadingAnalysis(true)
    setBusinessAnalysis(null)

    try {
      const response = await fetch("/api/businesses/mvp-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ business })
      })

      const data = await response.json()
      setBusinessAnalysis(data)
    } catch (error) {
      console.error("Failed to get business analysis:", error)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const showWelcome = messages.length <= 1 && !loading

  return (
    <div className="bg-background flex h-screen flex-col">
      {/* Modern Header */}
      <SimpleHeader
        title={messages.length > 1 ? "Business Discovery" : "MooMooMatch"}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {showWelcome ? (
          <SimpleWelcome onSuggestionClick={handleSuggestionClick} />
        ) : (
          <div className="p-4">
            <div className="mx-auto max-w-4xl space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`shrink-0 ${message.role === "user" ? "ml-3" : "mr-3"}`}
                    >
                      <div
                        className={`flex size-8 items-center justify-center rounded-full ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {message.role === "user" ? (
                          <IconUser size={16} />
                        ) : (
                          <IconRobot size={16} />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div
                        className={`rounded-xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card shadow-soft border"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                      </div>

                      {message.businesses && message.businesses.length > 0 && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          {message.businesses
                            .slice(0, 6)
                            .map((business, index) => (
                              <SimpleBusinessCard
                                key={index}
                                business={business}
                                onSave={(bus: Business) =>
                                  console.log("Saved:", bus)
                                }
                                onViewDetails={(bus: Business) =>
                                  handleBusinessClick(bus)
                                }
                                onShare={(bus: Business) =>
                                  console.log("Share:", bus)
                                }
                              />
                            ))}
                        </div>
                      )}

                      <div className="text-muted-foreground mt-2 text-xs">
                        {isClient ? message.timestamp.toLocaleTimeString() : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex">
                    <div className="mr-3 shrink-0">
                      <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
                        <IconRobot size={16} />
                      </div>
                    </div>
                    <div className="bg-card shadow-soft rounded-xl border px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="bg-muted-foreground/40 size-2 animate-bounce rounded-full"></div>
                        <div
                          className="bg-muted-foreground/40 size-2 animate-bounce rounded-full"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="bg-muted-foreground/40 size-2 animate-bounce rounded-full"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Business Analysis Panel */}
      {(businessAnalysis || loadingAnalysis) && (
        <div className="bg-card/50 border-t p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl">
            {loadingAnalysis ? (
              <div className="flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="bg-primary size-2 animate-bounce rounded-full"></div>
                  <div
                    className="bg-primary size-2 animate-bounce rounded-full"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="bg-primary size-2 animate-bounce rounded-full"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-foreground ml-3">
                  Analyzing business...
                </span>
              </div>
            ) : businessAnalysis ? (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-foreground text-lg font-semibold">
                    Business Analysis: {businessAnalysis.business}
                  </h3>
                  <button
                    onClick={() => setBusinessAnalysis(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-card shadow-soft rounded-lg border p-4">
                  <div className="text-foreground whitespace-pre-wrap text-sm">
                    {businessAnalysis.analysis}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Modern Input */}
      <div className="bg-background/80 border-t p-4 backdrop-blur-md">
        <SimpleChatInput
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          isLoading={loading}
          disabled={loading}
          placeholder="Ask me to find NYC businesses... (e.g., 'Find Italian restaurants in Brooklyn')"
          onAttachClick={() => console.log("Attach clicked")}
          onVoiceClick={() => console.log("Voice clicked")}
          onPromptsClick={() => console.log("Prompts clicked")}
        />
      </div>
    </div>
  )
}
