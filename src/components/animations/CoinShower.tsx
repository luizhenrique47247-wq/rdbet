import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Coin {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  delay: number
}

interface CoinShowerProps {
  trigger: boolean
  startX: number
  startY: number
  targetId: string
  onCoinArrived: () => void
  onComplete: () => void
}

export const CoinShower: React.FC<CoinShowerProps> = ({
  trigger,
  startX,
  startY,
  targetId,
  onCoinArrived,
  onComplete,
}) => {
  const [coins, setCoins] = useState<Coin[]>([])

  useEffect(() => {
    if (!trigger) return

    // Find the current coordinates of the target (e.g. balance element in header)
    const targetEl = document.getElementById(targetId)
    if (!targetEl) {
      onComplete()
      return
    }

    const rect = targetEl.getBoundingClientRect()
    const endX = rect.left + rect.width / 2
    const endY = rect.top + rect.height / 2

    // Create a burst of 15 coins flying up in arches
    const newCoins = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      startX,
      startY,
      endX,
      endY,
      delay: i * 0.04,
    }))

    setCoins(newCoins)
  }, [trigger, startX, startY, targetId])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {coins.map((coin) => {
          // Add a random offset for the mid-arc to create a beautiful fountain effect
          const midX = coin.startX + (Math.random() - 0.5) * 180
          const midY = coin.startY - (Math.random() * 140 + 60)

          return (
            <motion.div
              key={coin.id}
              initial={{
                x: coin.startX,
                y: coin.startY,
                scale: 0.5,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: [coin.startX, midX, coin.endX],
                y: [coin.startY, midY, coin.endY],
                scale: [0.5, 1.2, 0.4],
                rotate: [0, 360, 720],
                opacity: [1, 1, 0.4],
              }}
              transition={{
                duration: 0.85,
                delay: coin.delay,
                ease: 'easeInOut',
              }}
              onAnimationComplete={() => {
                onCoinArrived()
                setCoins((prev) => {
                  const remaining = prev.filter((c) => c.id !== coin.id)
                  if (remaining.length === 0) {
                    onComplete()
                  }
                  return remaining
                })
              }}
              className="absolute w-5 h-5 bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-600 border border-yellow-200 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.85)]"
            >
              <div className="text-[10px] font-black text-amber-950 select-none leading-none">$</div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
