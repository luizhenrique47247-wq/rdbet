import React, { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { cn } from '../../utils/cn'

interface BalanceCounterProps {
  value: number
}

export const BalanceCounter: React.FC<BalanceCounterProps> = ({ value }) => {
  const count = useMotionValue(value)
  const [statusColor, setStatusColor] = useState<'normal' | 'up' | 'down'>('normal')
  const prevValueRef = useRef(value)

  const formatted = useTransform(count, (latest) => {
    return latest.toFixed(2).replace('.', ',')
  })

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.8,
      ease: 'easeOut',
    })

    if (value > prevValueRef.current) {
      setStatusColor('up')
      const timeout = setTimeout(() => setStatusColor('normal'), 1800)
      return () => {
        controls.stop()
        clearTimeout(timeout)
      }
    } else if (value < prevValueRef.current) {
      setStatusColor('down')
      const timeout = setTimeout(() => setStatusColor('normal'), 1800)
      return () => {
        controls.stop()
        clearTimeout(timeout)
      }
    }

    prevValueRef.current = value
    return controls.stop
  }, [value, count])

  useEffect(() => {
    // Keep the ref updated with the latest value
    prevValueRef.current = value
  }, [value])

  return (
    <span className="font-black text-sm select-none leading-none tracking-tight transition-all duration-300">
      <span className={cn(
        "mr-0.5 transition-colors duration-300",
        statusColor === 'up' && "text-neon-green text-glow-green scale-105",
        statusColor === 'down' && "text-neon-red text-glow-red scale-95",
        statusColor === 'normal' && "text-neon-green"
      )}>
        R$
      </span>
      <motion.span 
        className={cn(
          "font-black tabular-nums transition-all duration-300 inline-block",
          statusColor === 'up' && "text-neon-green text-glow-green scale-110",
          statusColor === 'down' && "text-neon-red text-glow-red scale-95",
          statusColor === 'normal' && "text-white"
        )}
      >
        {formatted}
      </motion.span>
    </span>
  )
}
