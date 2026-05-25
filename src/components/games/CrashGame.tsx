import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { Play, ShieldAlert } from 'lucide-react'
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

export const CrashGame: React.FC = () => {
  const { spendBalance, addBalance, incrementSimulatedStats } = useStore()
  const [gameState, setGameState] = useState<'idle' | 'running' | 'cashed' | 'crashed'>('idle')
  const [multiplier, setMultiplier] = useState(1.0)
  const [insight, setInsight] = useState<string | null>(null)
  
  const [isLoss, setIsLoss] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })
  const [outcomeMessage, setOutcomeMessage] = useState<{ type: 'win' | 'loss'; text: string } | null>(null)

  // Interruption overlay states
  const [accumulatedSpent, setAccumulatedSpent] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayAmount, setOverlayAmount] = useState(0)

  const timerRef = useRef<any>(null)
  const crashPointRef = useRef(1.0)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const triggerInterruption = (costSpent: number) => {
    const newAccumulated = accumulatedSpent + costSpent
    if (newAccumulated >= 10) {
      setOverlayAmount(newAccumulated)
      setAccumulatedSpent(0)
      setTimeout(() => {
        setOverlayOpen(true)
      }, 1500)
    } else {
      setAccumulatedSpent(newAccumulated)
    }
  }

  const handleStart = () => {
    if (gameState === 'running') return
    const cost = 100
    if (!spendBalance(cost)) {
      casinoAudio.playWarning()
      alert("Moedas virtuais insuficientes! Recarregue no topo.")
      return
    }

    casinoAudio.playTick()
    setGameState('running')
    setMultiplier(1.0)
    setInsight(null)
    setIsLoss(false)
    setShowConfetti(false)
    setOutcomeMessage(null)
    incrementSimulatedStats(cost, 30)

    const rng = Math.random()
    if (rng < 0.3) {
      crashPointRef.current = 1.0 + Math.random() * 0.3
    } else if (rng < 0.7) {
      crashPointRef.current = 1.3 + Math.random() * 0.8
    } else {
      crashPointRef.current = 2.1 + Math.random() * 3.5
    }

    let currentMult = 1.0
    timerRef.current = setInterval(() => {
      casinoAudio.playTick()
      
      currentMult += 0.05 + (currentMult * 0.015)
      setMultiplier(parseFloat(currentMult.toFixed(2)))
      
      if (currentMult >= crashPointRef.current) {
        clearInterval(timerRef.current!)
        casinoAudio.playLossSweep()
        setIsLoss(true)
        setGameState('crashed')
        
        setOutcomeMessage({
          type: 'loss',
          text: `CRASHOU EM ${currentMult.toFixed(2)}x! PERDEU R$ 100,00`
        })

        setInsight(
          "💥 ANTAGONISMO DA PERDA RÁPIDA: Você perdeu tudo! O crash game atua diretamente na ansiedade. O multiplicador subindo dispara cortisol. O cérebro fica dividido entre o pânico de 'crachar' e a ganância do 'subir mais'. Quando cracha, gera arrependimento severo ('eu devia ter retirado') e te impulsiona a apostar valores maiores na sequência para recuperar o prejuízo. É o ciclo de reforço que esvazia contas em minutos."
        )

        triggerInterruption(100)
      }
    }, 120)
  }

  const handleCashout = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (gameState !== 'running') return
    clearInterval(timerRef.current!)
    casinoAudio.playWinMelody()
    setGameState('cashed')
    setShowConfetti(true)

    // Reward payout
    const winAmount = Math.round(100 * multiplier)
    addBalance(winAmount)

    // Trigger coin shower
    setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
    setShowerTrigger(true)

    setOutcomeMessage({
      type: 'win',
      text: `RETIROU EM ${multiplier.toFixed(2)}x! GANHOU R$ ${winAmount.toFixed(2).replace('.', ',')}`
    })

    setInsight(
      `🎉 RETIRADA COM SUCESSO! Você garantiu ${multiplier}x de retorno virtual. Porém, analise: durante a subida, seus batimentos cardíacos aceleraram? O cérebro foi inundado de dopamina temporária. Na vida real, esse pico de estresse cobra um preço caro da saúde cardiovascular e mental, além do fato de que na próxima rodada, a chance de perder tudo logo no início (ex: 1.00x) é alta. Vale a pena gastar saúde por moedas de mentira?`
    )

    triggerInterruption(100)
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

        {/* Cognitive Interruption Overlay */}
        <CognitiveOverlay 
          isOpen={overlayOpen}
          amountSpent={overlayAmount}
          onClose={() => setOverlayOpen(false)}
        />

        <div className="text-center space-y-1">
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Crash da Ansiedade</h3>
          <p className="text-[10px] text-zinc-400">Custo da rodada: 100 moedas fictícias</p>
        </div>

        <div className="h-44 bg-zinc-950 border border-cyber-border rounded-xl relative overflow-hidden flex flex-col justify-end p-4">
          <div className="absolute top-4 left-4 z-10 select-none">
            <span className="text-[9px] text-zinc-500 uppercase font-black block">Nível de Cortisol</span>
            <span className={cn(
              "text-2xl font-black tabular-nums transition-colors",
              gameState === 'crashed' ? 'text-neon-red text-glow-red' : 
              gameState === 'cashed' ? 'text-neon-green text-glow-green' : 'text-white'
            )}>
              {multiplier}x
            </span>
          </div>

          <AnimatePresence>
            {outcomeMessage && (
              <div className="absolute top-4 right-4 z-10 select-none">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                    outcomeMessage.type === 'win' 
                      ? 'bg-emerald-950/40 border-emerald-500 text-neon-green glow-green' 
                      : 'bg-red-950/40 border-red-500 text-neon-red glow-red'
                  )}
                >
                  {outcomeMessage.text}
                </motion.span>
              </div>
            )}
          </AnimatePresence>

          {gameState === 'crashed' && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-950/20 z-10 select-none">
              <span className="text-xl font-black text-neon-red text-glow-red uppercase tracking-widest animate-pulse">
                CRASHED @ {multiplier}x
              </span>
            </div>
          )}

          <svg className="w-full h-24 overflow-visible">
            <motion.path
              d={`M 0,96 Q 100,${96 - (multiplier - 1.0) * 15} 350,${96 - (multiplier - 1.0) * 35}`}
              fill="none"
              stroke={gameState === 'crashed' ? '#ff3344' : gameState === 'cashed' ? '#00ff3c' : '#00e676'}
              strokeWidth="3.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              className="transition-colors"
            />
          </svg>
        </div>

        <div className="flex gap-3">
          {gameState !== 'running' ? (
            <Button
              onClick={handleStart}
              variant="primary"
              glow
              className="w-full relative overflow-hidden"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] animate-shimmer" />
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <Play size={16} />
                INICIAR SIMULAÇÃO
              </span>
            </Button>
          ) : (
            <Button
              onClick={handleCashout}
              variant="danger"
              glow
              className="w-full"
            >
              RETIRAR AGORA
            </Button>
          )}
        </div>

        {insight && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 leading-relaxed space-y-2 border-l-2 border-l-neon-red"
          >
            <div className="flex items-center gap-1.5 text-neon-red font-bold">
              <ShieldAlert size={14} />
              <Badge variant="red" glow>Mecanismo Neuroquímico</Badge>
            </div>
            <p>{insight}</p>
          </motion.div>
        )}
      </Card>
    </LossShake>
  )
}
