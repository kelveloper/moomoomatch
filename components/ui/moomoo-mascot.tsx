import { FC } from "react"

interface MooMooMascotProps {
  className?: string
  size?: number
  animate?: boolean
}

export const MooMooMascot: FC<MooMooMascotProps> = ({
  className = "",
  size = 96,
  animate = true
}) => {
  return (
    <div
      className={`inline-block ${className} ${animate ? "animate-bounce" : ""}`}
      style={
        animate
          ? { animationDuration: "3s", animationIterationCount: "infinite" }
          : {}
      }
    >
      <img
        src="/untitled-design.png"
        alt="MooMoo Mascot"
        width={size}
        height={size}
        className="size-full object-contain drop-shadow-lg"
        style={{ width: size, height: size }}
      />
    </div>
  )
}
