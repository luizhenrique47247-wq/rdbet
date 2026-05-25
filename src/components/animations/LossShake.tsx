import React from 'react'
import { motion } from 'framer-motion'

interface LossShakeProps {
  isLoss: boolean
  children: React.ReactNode
}

export const LossShake: React.FC<LossShakeProps> = ({ isLoss, children }) => {
  return (
    <motion.div
      animate={
        isLoss
          ? {
              x: [0, -10, 10, -8, 8, -5, 5, -2, 2, 0],
              y: [0, 5, -5, 3, -3, 2, -2, 1, -1, 0],
            }
          : {}
      }
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
