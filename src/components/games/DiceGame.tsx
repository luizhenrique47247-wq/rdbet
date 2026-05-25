import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'
import { casinoAudio } from '../../utils/audioEngine'
import { CoinShower } from '../animations/CoinShower'
import { Confetti } from '../ui/Confetti'
import { LossShake } from '../animations/LossShake'
import { CognitiveOverlay } from '../ui/CognitiveOverlay'

export const DiceGame: React.FC = () => {
  const { spendBalance, addBalance, incrementSimulatedStats } = useStore()
  
  // Game states
  const [betAmount, setBetAmount] = useState<number>(10) // R$ 10,00 default
  const [targetNumber, setTargetNumber] = useState<number>(50)
  const [prediction, setPrediction] = useState<'above' | 'below'>('above')
  const [rolling, setRolling] = useState(false)
  const [rollResult, setRollResult] = useState<number | null>(null)
  
  // Interruption overlay states
  const [accumulatedSpent, setAccumulatedSpent] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayAmount, setOverlayAmount] = useState(0)

  // Visual effects
  const [isLoss, setIsLoss] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })
  const [outcomeMessage, setOutcomeMessage] = useState<{ type: 'win' | 'loss'; text: string } | null>(null)
  const [insight, setInsight] = useState<string | null>(null)

  const intervalRef = useRef<any>(null)
  const timeoutRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Calculate probability and multiplier
  const winProbability = prediction === 'above' ? 100 - targetNumber : targetNumber
  const winMultiplier = parseFloat((95 / winProbability).toFixed(2))

  const handleRoll = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (rolling) return

    if (betAmount <= 0) {
      alert("Aposta mínima é de R$ 1,00")
      return
    }

    if (!spendBalance(betAmount)) {
      casinoAudio.playWarning()
      alert("Saldo fictício insuficiente! Clique no '+' no topo para recarregar moedas gratuitas.")
      return
    }

    // Play initial sound, start roll state
    casinoAudio.playTick()
    setRolling(true)
    setRollResult(null)
    setIsLoss(false)
    setShowConfetti(false)
    setOutcomeMessage(null)
    setInsight(null)

    // Tick rolling animation
    let rollTicks = 0
    intervalRef.current = setInterval(() => {
      casinoAudio.playTick()
      setRollResult(Math.floor(Math.random() * 100) + 1)
      rollTicks++
      if (rollTicks >= 12) {
        clearInterval(intervalRef.current)
      }
    }, 100)

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current)
      
      // Final roll result between 1 and 100
      const finalResult = Math.floor(Math.random() * 100) + 1
      setRollResult(finalResult)
      setRolling(false)

      // Evaluate win or loss
      const isWin = prediction === 'above' 
        ? finalResult > targetNumber 
        : finalResult < targetNumber

      if (isWin) {
        casinoAudio.playWinMelody()
        setShowConfetti(true)
        
        const payout = betAmount * winMultiplier
        addBalance(payout)

        // Trigger coins animation
        setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
        setShowerTrigger(true)

        setOutcomeMessage({
          type: 'win',
          text: `GANHOU R$ ${payout.toFixed(2).replace('.', ',')}!`
        })

        setInsight(
          `🎲 SIMULAÇÃO: VOCÊ GANHOU! Note como um ganho rápido de R$ ${payout.toFixed(2)} estimula uma sensação imediata de euforia. Isso ocorre porque o cérebro evoluiu para valorizar recompensas inesperadas. No entanto, no Dice a casa ajusta a taxa para garantir margem de lucro de ~5%. No longo prazo, a estatística inevitavelmente zera sua banca.`
        )
      } else {
        casinoAudio.playLossSweep()
        setIsLoss(true)
        incrementSimulatedStats(betAmount, 15)

        setOutcomeMessage({
          type: 'loss',
          text: `PERDEU R$ ${betAmount.toFixed(2).replace('.', ',')}!`
        })

        setInsight(
          `🎲 SIMULAÇÃO: VOCÊ PERDEU. No Dice, ao ajustar a probabilidade para valores altos (ex: 80% de chance), o cérebro é induzido a acreditar que a derrota é 'impossível'. Mas a derrota de 20% ocorre com frequência. Quando ela acontece, a perda é grande e o ganho anterior é aniquilado.`
        )
      }

      // Track session spent for cognitive interruption
      const newAccumulated = accumulatedSpent + betAmount
      if (newAccumulated >= 10) {
        setOverlayAmount(newAccumulated)
        setAccumulatedSpent(0)
        // Delay opening overlay by 1 second to let user see win/loss message
        setTimeout(() => {
          setOverlayOpen(true)
        }, 1200)
      } else {
        setAccumulatedSpent(newAccumulated)
      }

    }, 1200)
  }

  return (
    <LossShake isLoss={isLoss}>
      <Card className="p-5 space-y-4 relative overflow-hidden bg-[#12161a] border border-cyber-border">
        <Confetti active={showConfetti} />
        
        <CoinShower
          trigger={showerTrigger}
          startX={showerCoords.x}
          startY={showerCoords.y}
          targetId="header-balance-container"
          onCoinArrived={() => casinoAudio.playCoinChime()}
          onComplete={() => setShowerTrigger(false)}
        />

        {/* Win/Loss Screen Flash overlays */}
        <AnimatePresence>
          {isLoss && (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-red-600/15 border-2 border-neon-red glow-red rounded-2xl pointer-events-none z-30"
            />
          )}
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-emerald-600/15 border-2 border-neon-green glow-green rounded-2xl pointer-events-none z-30"
            />
          )}
        </AnimatePresence>

        {/* Cognitive Interruption Overlay */}
        <CognitiveOverlay 
          isOpen={overlayOpen}
          amountSpent={overlayAmount}
          onClose={() => setOverlayOpen(false)}
        />

        <div className="text-center space-y-1">
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Dice da Ilusão</h3>
          <p className="text-[10px] text-zinc-400">Ajuste seu risco e role o dado de 1 a 100</p>
        </div>

        {/* Dice Result Display */}
        <div className="relative py-6 bg-zinc-950 border border-cyber-border rounded-xl flex flex-col items-center justify-center min-h-[110px]">
          <AnimatePresence mode="wait">
            {outcomeMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "absolute top-2 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border select-none",
                  outcomeMessage.type === 'win' 
                    ? 'bg-emerald-950/40 border-emerald-500 text-neon-green glow-green' 
                    : 'bg-red-950/40 border-red-500 text-neon-red glow-red'
                )}
              >
                {outcomeMessage.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-5xl font-black tracking-tight text-white select-none text-glow-green">
            {rollResult !== null ? rollResult : '??'}
          </div>
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mt-2">
            Resultado da Rodada
          </span>
        </div>

        {/* Betting Panel Controls */}
        <div className="space-y-4 bg-zinc-950/60 p-4 border border-cyber-border rounded-xl">
          {/* Bet size */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase">Valor da Aposta</span>
            <div className="flex gap-1.5">
              {[5, 10, 20, 50].map((val) => (
                <button
                  key={val}
                  disabled={rolling}
                  onClick={() => {
                    casinoAudio.playTick()
                    setBetAmount(val)
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider transition-all border cursor-pointer",
                    betAmount === val 
                      ? 'bg-neon-green text-black border-neon-green' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  )}
                >
                  R$ {val}
                </button>
              ))}
            </div>
          </div>

          {/* Prediction Selection */}
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={rolling}
              onClick={() => {
                casinoAudio.playTick()
                setPrediction('above')
              }}
              className={cn(
                "py-2 rounded-lg font-bold text-xs border text-white transition-all cursor-pointer",
                prediction === 'above' ? 'bg-emerald-950 border-emerald-500 text-neon-green shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              )}
            >
              Rolar Acima ↑
            </button>
            <button
              disabled={rolling}
              onClick={() => {
                casinoAudio.playTick()
                setPrediction('below')
              }}
              className={cn(
                "py-2 rounded-lg font-bold text-xs border text-white transition-all cursor-pointer",
                prediction === 'below' ? 'bg-emerald-950 border-emerald-500 text-neon-green shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              )}
            >
              Rolar Abaixo ↓
            </button>
          </div>

          {/* Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-zinc-400 font-extrabold uppercase">Número Alvo</span>
              <span className="text-white font-extrabold">{targetNumber}</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              disabled={rolling}
              value={targetNumber}
              onChange={(e) => {
                setTargetNumber(parseInt(e.target.value))
              }}
              className="w-full accent-neon-green bg-zinc-950 rounded-lg cursor-pointer h-2 border border-cyber-border"
            />
          </div>

          {/* Probabilities and Multiplier HUD */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-cyber-border text-center">
            <div className="space-y-0.5">
              <span className="text-[8px] text-zinc-500 font-extrabold uppercase">Multiplicador</span>
              <div className="text-sm font-black text-white">{winMultiplier}x</div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[8px] text-zinc-500 font-extrabold uppercase">Chance de Vitória</span>
              <div className="text-sm font-black text-neon-green">{winProbability}%</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleRoll}
          disabled={rolling}
          variant="primary"
          glow
          className="w-full relative overflow-hidden py-4"
        >
          <span className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] animate-shimmer" />
          <span className="relative z-10 font-black tracking-widest text-xs">
            {rolling ? 'ROLANDO DADO...' : `ROLAR R$ ${betAmount.toFixed(2).replace('.', ',')}`}
          </span>
        </Button>

        {/* Diagnostic Insight */}
        <AnimatePresence>
          {insight && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 leading-relaxed space-y-2 border-l-2 border-l-blue-400"
            >
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <ShieldAlert size={14} />
                <Badge variant="blue" glow>Mecanismo Probabilístico</Badge>
              </div>
              <p>{insight}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </LossShake>
  )
}
