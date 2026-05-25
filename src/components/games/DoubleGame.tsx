import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'
import { casinoAudio } from '../../utils/audioEngine'
import { CoinShower } from '../animations/CoinShower'
import { Confetti } from '../ui/Confetti'
import { LossShake } from '../animations/LossShake'

export const DoubleGame: React.FC = () => {
  const { spendBalance, addBalance, incrementSimulatedStats } = useStore()
  const [betColor, setBetColor] = useState<'red' | 'black' | 'green'>('red')
  const [spinning, setSpinning] = useState(false)
  const [rollHistory, setRollHistory] = useState<string[]>(['🔴', '⚫', '🔴', '⚫', '🔴'])
  const [insight, setInsight] = useState<string | null>(null)
  
  const [isLoss, setIsLoss] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })

  const timeoutRef = useRef<any>(null)
  const tickIntervalRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current)
    }
  }, [])

  const handleRoll = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (spinning) return
    const cost = 100
    if (!spendBalance(cost)) {
      casinoAudio.playWarning()
      alert("Saldo fictício insuficiente!")
      return
    }

    casinoAudio.playTick()
    setSpinning(true)
    setInsight(null)
    setIsLoss(false)
    setIsWin(false)
    setShowConfetti(false)

    // Trigger tick sounds during rolling
    let tickCount = 0
    tickIntervalRef.current = setInterval(() => {
      casinoAudio.playTick()
      tickCount++
      if (tickCount >= 10) {
        clearInterval(tickIntervalRef.current)
      }
    }, 180)

    timeoutRef.current = setTimeout(() => {
      clearInterval(tickIntervalRef.current)
      const rng = Math.random()
      let winningColor: 'red' | 'black' | 'green'
      let winningEmoji: string
      
      if (rng < 0.47) {
        winningColor = 'red'
        winningEmoji = '🔴'
      } else if (rng < 0.94) {
        winningColor = 'black'
        winningEmoji = '⚫'
      } else {
        winningColor = 'green'
        winningEmoji = '🟢'
      }

      setRollHistory(prev => [winningEmoji, ...prev.slice(0, 4)])
      setSpinning(false)

      const won = betColor === winningColor
      if (won) {
        casinoAudio.playWinMelody()
        setIsWin(true)
        setShowConfetti(true)
        
        // Reward payouts
        const multiplier = winningColor === 'green' ? 14 : 2
        const winAmount = cost * multiplier
        addBalance(winAmount)
        
        // Trigger coin shower upwards
        setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
        setShowerTrigger(true)

        setInsight(
          `🟢 VOCÊ VENCEU A SIMULAÇÃO! Porém, atente-se à "Falácia do Jogador". Vencer uma rodada não aumenta a probabilidade de vencer a próxima; os eventos são independentes. Casas de aposta mostram históricos e listas de rodadas anteriores de propósito para tentar fazer seu cérebro identificar "padrões" inexistentes no azar.`
        )
      } else {
        casinoAudio.playLossSweep()
        setIsLoss(true)
        incrementSimulatedStats(cost, 20)

        setInsight(
          `🔴 VOCÊ PERDEU. Se você estivesse usando a tática clássica do "Martingale" (dobrar a aposta após perder para tentar recuperar), seu prejuízo agora seria de 200 moedas virtuais. Essa tática matematicamente quebra qualquer carteira muito rápido por causa do crescimento exponencial e limites da mesa. O Double é desenhado especificamente para explorar esse viés lógico.`
        )
      }
    }, 2000)
  }

  return (
    <LossShake isLoss={isLoss}>
      <Card className="p-5 space-y-4 relative overflow-hidden bg-[#12161a]">
        <Confetti active={showConfetti} />
        
        <CoinShower
          trigger={showerTrigger}
          startX={showerCoords.x}
          startY={showerCoords.y}
          targetId="header-balance-container"
          onCoinArrived={() => casinoAudio.playCoinChime()}
          onComplete={() => setShowerTrigger(false)}
        />

        <div className="text-center space-y-1">
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Double da Dopamina</h3>
          <p className="text-[10px] text-zinc-400">Custo da rodada: 100 moedas fictícias</p>
        </div>

        <div className="flex justify-between items-center bg-zinc-950 border border-cyber-border rounded-xl px-4 py-2 text-xs">
          <span className="text-[9px] text-zinc-500 font-extrabold uppercase">Histórico:</span>
          <div className="flex gap-2">
            {rollHistory.map((emoji, idx) => (
              <span key={idx} className="text-base">{emoji}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              casinoAudio.playTick()
              setBetColor('red')
            }}
            className={cn(
              "py-2.5 rounded-lg font-bold text-xs border text-white transition-all cursor-pointer",
              betColor === 'red' ? 'bg-red-700 border-red-500 scale-105 shadow-lg' : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
            )}
          >
            🔴 Vermelho (2x)
          </button>
          <button
            onClick={() => {
              casinoAudio.playTick()
              setBetColor('green')
            }}
            className={cn(
              "py-2.5 rounded-lg font-bold text-xs border text-white transition-all cursor-pointer",
              betColor === 'green' ? 'bg-emerald-700 border-emerald-500 scale-105 shadow-lg' : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
            )}
          >
            🟢 Branco/Verde (14x)
          </button>
          <button
            onClick={() => {
              casinoAudio.playTick()
              setBetColor('black')
            }}
            className={cn(
              "py-2.5 rounded-lg font-bold text-xs border text-white transition-all cursor-pointer",
              betColor === 'black' ? 'bg-zinc-800 border-zinc-600 scale-105 shadow-lg' : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
            )}
          >
            ⚫ Preto (2x)
          </button>
        </div>

        <Button
          onClick={handleRoll}
          disabled={spinning}
          variant="primary"
          glow
          className="w-full relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <span className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] animate-shimmer" />
          <span className="relative z-10">{spinning ? 'ROLANDO CORRIDA...' : 'APOSTAR DOUBLE'}</span>
        </Button>

        {insight && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 leading-relaxed space-y-2 border-l-2 border-l-blue-400"
          >
            <div className="flex items-center gap-1.5 text-blue-400 font-bold">
              <ShieldAlert size={14} />
              <Badge variant="blue" glow>Mecanismo Estatístico</Badge>
            </div>
            <p>{insight}</p>
          </motion.div>
        )}
      </Card>
    </LossShake>
  )
}
