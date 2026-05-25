import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wind } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../utils/cn'

export const BreathingBox: React.FC = () => {
  const [breathingState, setBreathingState] = useState<'idle' | 'inhale' | 'hold1' | 'exhale' | 'hold2'>('idle')
  const [breathingSeconds, setBreathingSeconds] = useState(0)

  useEffect(() => {
    let timer: any
    if (breathingState !== 'idle') {
      timer = setInterval(() => {
        setBreathingSeconds(prev => {
          const next = prev + 1
          if (next >= 4) {
            setBreathingState(current => {
              if (current === 'inhale') return 'hold1'
              if (current === 'hold1') return 'exhale'
              if (current === 'exhale') return 'hold2'
              return 'inhale'
            })
            return 0
          }
          return next
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [breathingState])

  const startBreathing = () => {
    setBreathingState('inhale')
    setBreathingSeconds(0)
  }

  const stopBreathing = () => {
    setBreathingState('idle')
    setBreathingSeconds(0)
  }

  return (
    <div className="bg-zinc-900 border border-cyber-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-neon-green">
        <Wind size={18} className="text-glow-green" />
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
          Respiração do Autocontrole (Breathing Box)
        </h3>
      </div>

      {breathingState === 'idle' ? (
        <div className="text-center space-y-3">
          <p className="text-[10px] text-zinc-400 leading-relaxed">
            Exercício simples de respiração em caixa de 4 segundos. Excelente para diminuir o nível de cortisol no organismo em momentos de compulsão ou ansiedade extrema.
          </p>
          <Button
            onClick={startBreathing}
            variant="primary"
            size="sm"
            glow
            className="mx-auto"
          >
            Iniciar Respiração Terapêutica
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center py-2 space-y-4">
          {/* Animated breathing circle */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <motion.div
              animate={{
                scale: 
                  breathingState === 'inhale' ? 1.4 :
                  breathingState === 'exhale' ? 0.9 :
                  breathingState === 'hold1' ? 1.4 : 0.9
              }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className={cn(
                "absolute inset-0 rounded-full border-2 opacity-50",
                breathingState === 'inhale' ? 'bg-emerald-500/10 border-emerald-400 glow-green' :
                breathingState === 'exhale' ? 'bg-blue-500/10 border-blue-400' : 'bg-yellow-500/10 border-yellow-400'
              )}
            />
            <div className="z-10 text-center">
              <span className="text-xs font-black text-white uppercase block leading-none">
                {breathingState === 'inhale' && 'INSPIRE'}
                {breathingState === 'hold1' && 'SEGURE'}
                {breathingState === 'exhale' && 'EXPIRE'}
                {breathingState === 'hold2' && 'SEGURE'}
              </span>
              <span className="text-lg font-black text-white block mt-1.5 tabular-nums">
                {4 - breathingSeconds}s
              </span>
            </div>
          </div>

          <button
            onClick={stopBreathing}
            className="px-3.5 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Parar Exercício
          </button>
        </div>
      )}
    </div>
  )
}
