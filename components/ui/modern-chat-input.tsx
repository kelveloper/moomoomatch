import {
  IconPaperclip,
  IconMicrophone,
  IconBulb,
  IconSend,
  IconPlayerStopFilled
} from "@tabler/icons-react"
import { FC, useRef } from "react"

interface ModernChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  onAttachClick?: () => void
  onVoiceClick?: () => void
  onPromptsClick?: () => void
  maxLength?: number
}

export const ModernChatInput: FC<ModernChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  isLoading = false,
  disabled = false,
  placeholder = "Ask me about NYC businesses...",
  onAttachClick,
  onVoiceClick,
  onPromptsClick,
  maxLength = 1500
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && value.trim()) {
      e.preventDefault()
      onSubmit()
    }
    onKeyDown?.(e)
  }

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    adjustHeight()
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Input Container */}
      <div className="bg-background shadow-soft focus-within:border-primary/50 focus-within:shadow-medium relative rounded-xl border transition-all">
        {/* Main Input Area */}
        <div className="flex items-end gap-2 p-3">
          {/* Attach Button */}
          <button
            onClick={onAttachClick}
            disabled={disabled}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors disabled:opacity-50"
            title="Attach file"
          >
            <IconPaperclip size={18} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="input-focus placeholder:text-muted-foreground flex-1 resize-none border-0 bg-transparent py-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            rows={1}
            style={{ minHeight: "24px", maxHeight: "120px" }}
            maxLength={maxLength}
          />

          {/* Send/Stop Button */}
          <button
            onClick={isLoading ? undefined : onSubmit}
            disabled={disabled || (!isLoading && !value.trim())}
            className={`rounded-lg p-2 transition-all ${
              isLoading
                ? "text-destructive hover:bg-destructive/10"
                : value.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground cursor-not-allowed opacity-50"
            }`}
            title={isLoading ? "Stop generation" : "Send message"}
          >
            {isLoading ? (
              <IconPlayerStopFilled size={18} />
            ) : (
              <IconSend size={18} />
            )}
          </button>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="via-primary/5 absolute inset-0 animate-pulse rounded-xl bg-gradient-to-r from-transparent to-transparent" />
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-2 flex items-center justify-between px-1">
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onVoiceClick}
            disabled={disabled}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-1.5 text-xs transition-colors disabled:opacity-50"
            title="Voice input"
          >
            <IconMicrophone size={16} />
          </button>

          <button
            onClick={onPromptsClick}
            disabled={disabled}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-1.5 text-xs transition-colors disabled:opacity-50"
            title="Browse prompts"
          >
            <IconBulb size={16} />
          </button>
        </div>

        {/* Character Counter */}
        <div className="text-muted-foreground text-xs">
          <span
            className={value.length > maxLength * 0.9 ? "text-warning" : ""}
          >
            {value.length}
          </span>
          <span>/{maxLength}</span>
        </div>
      </div>
    </div>
  )
}
