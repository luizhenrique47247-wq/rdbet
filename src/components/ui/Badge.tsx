import React from 'react'
import { cn } from '../../utils/cn'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'red' | 'yellow' | 'blue' | 'gray'
  glow?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'gray',
  glow = false,
  ...props
}) => {
  return (
    <span
      className={cn(
        "text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border leading-none shrink-0 inline-flex items-center gap-1",
        {
          "bg-emerald-950/40 border-emerald-500/30 text-emerald-400": variant === 'green',
          "bg-red-950/40 border-red-500/30 text-red-400": variant === 'red',
          "bg-yellow-950/40 border-yellow-500/30 text-yellow-400": variant === 'yellow',
          "bg-blue-950/40 border-blue-500/30 text-blue-400": variant === 'blue',
          "bg-zinc-950 border-zinc-800 text-zinc-400": variant === 'gray',
          
          "text-glow-green": glow && variant === 'green',
          "text-glow-red": glow && variant === 'red',
          "text-glow-yellow": glow && variant === 'yellow',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
