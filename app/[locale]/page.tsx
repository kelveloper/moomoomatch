"use client"

import { useState, useRef, useEffect } from "react"
import {
  IconSend,
  IconMapPin,
  IconBuilding,
  IconRobot,
  IconUser
} from "@tabler/icons-react"

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

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
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
          message: input,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="text-2xl font-bold text-blue-600">MooMooMatch</div>
          <div className="ml-2 text-sm text-gray-600">
            AI Business Connector
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`shrink-0 ${message.role === "user" ? "ml-2" : "mr-2"}`}
                >
                  <div
                    className={`flex size-8 items-center justify-center rounded-full${
                      message.role === "user" ? "bg-blue-500" : "bg-green-500"
                    }`}
                  >
                    {message.role === "user" ? (
                      <IconUser size={16} className="text-white" />
                    ) : (
                      <IconRobot size={16} className="text-white" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "border border-gray-200 bg-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>

                  {message.businesses && message.businesses.length > 0 && (
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {message.businesses.slice(0, 6).map((business, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                        >
                          <div className="mb-2 font-semibold text-blue-700">
                            {business.vendor_dba || business.vendor_formal_name}
                          </div>

                          <div className="mb-1 flex items-center text-gray-600">
                            <IconMapPin size={14} className="mr-1" />
                            <span className="text-sm">
                              {business.address1}, {business.city}
                            </span>
                          </div>

                          <div className="mb-2 flex items-center text-gray-600">
                            <IconBuilding size={14} className="mr-1" />
                            <span className="text-sm">
                              {business.naics_title}
                            </span>
                          </div>

                          {business.borough && (
                            <div className="mb-2 inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                              {business.borough}
                            </div>
                          )}

                          <div className="flex gap-2 text-xs">
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
                  )}

                  <div className="mt-1 text-xs text-gray-500">
                    {isClient ? message.timestamp.toLocaleTimeString() : ""}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex">
                <div className="mr-2 shrink-0">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-500">
                    <IconRobot size={16} className="text-white" />
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="size-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div
                      className="size-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="size-2 animate-bounce rounded-full bg-gray-400"
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

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto max-w-4xl">
          <div className="flex space-x-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to find NYC businesses... (e.g., 'Find Italian restaurants in Brooklyn')"
              className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              <IconSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
