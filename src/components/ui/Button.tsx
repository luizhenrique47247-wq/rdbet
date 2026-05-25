import React from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  glow = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        "font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        {
          // Sizes
          "px-3 py-1.5 text-xs": size === 'sm',
          "px-4 py-2.5 text-xs md:text-sm": size === 'md',
          "px-6 py-3.5 text-sm md:text-base": size === 'lg',
          
          // Variants
          "bg-neon-green hover:bg-neon-green-glow text-black": variant === 'primary',
          "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800": variant === 'secondary',
          "bg-neon-red hover:bg-neon-red-glow text-white": variant === 'danger',
          "bg-neon-yellow hover:bg-neon-yellow-glow text-black": variant === 'warning',
          "bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white": variant === 'ghost',
          
          // Glows
          "glow-green": glow && variant === 'primary',
          "glow-red": glow && variant === 'danger',
          "glow-yellow": glow && variant === 'warning',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
