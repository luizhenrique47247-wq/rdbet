import React from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glowing-green' | 'glowing-red' | 'glowing-yellow' | 'glass'
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all overflow-hidden relative",
        {
          "bg-zinc-900 border-cyber-border": variant === 'default',
          "bg-gradient-to-br from-zinc-900 to-zinc-950 border-neon-green/30 glow-green": variant === 'glowing-green',
          "bg-gradient-to-br from-zinc-900 to-zinc-950 border-neon-red/30 glow-red": variant === 'glowing-red',
          "bg-gradient-to-br from-zinc-900 to-zinc-950 border-neon-yellow/30 glow-yellow": variant === 'glowing-yellow',
          "glass-panel": variant === 'glass'
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
