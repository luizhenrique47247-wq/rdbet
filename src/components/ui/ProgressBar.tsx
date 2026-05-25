import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // Percentage 0 to 100
  variant?: 'green' | 'red' | 'yellow'
  height?: 'sm' | 'md' | 'lg'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
  variant = 'green',
  height = 'md',
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full bg-zinc-950 border border-cyber-border rounded-full overflow-hidden relative",
        {
          "h-1.5": height === 'sm',
          "h-3": height === 'md',
          "h-5": height === 'lg',
        },
        className
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "h-full rounded-full transition-all",
          {
            "bg-gradient-to-r from-neon-green to-emerald-500 glow-green": variant === 'green',
            "bg-gradient-to-r from-neon-red to-rose-600 glow-red": variant === 'red',
            "bg-gradient-to-r from-neon-yellow to-amber-500 glow-yellow": variant === 'yellow',
          }
        )}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        transition={{ duration: 0.8 }}
      />
    </div>
  )
}
