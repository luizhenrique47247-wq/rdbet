import React, { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface BalanceCounterProps {
  value: number
}

export const BalanceCounter: React.FC<BalanceCounterProps> = ({ value }) => {
  const count = useMotionValue(value)
  
  const formatted = useTransform(count, (latest) => {
    return latest.toFixed(2).replace('.', ',')
  })

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.6,
      ease: 'easeOut',
    })
    return controls.stop
  }, [value, count])

  return (
    <span className="font-black text-sm text-white select-none leading-none tracking-tight">
      <span className="text-neon-green mr-0.5">R$</span>
      <motion.span className="text-white font-black tabular-nums">{formatted}</motion.span>
    </span>
  )
}
