import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { RotateCw, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { casinoAudio } from '../../utils/audioEngine'
import { CoinShower } from '../animations/CoinShower'
import { Confetti } from '../ui/Confetti'
import { LossShake } from '../animations/LossShake'
import { CognitiveOverlay } from '../ui/CognitiveOverlay'
import { cn } from '../../utils/cn'

export const SlotsGame: React.FC = () => {
  const { spendBalance, addBalance, incrementSimulatedStats } = useStore()
  const [spinning, setSpinning] = useState(false)
  const [reels, setReels] = useState(['⏰', '⏰', '⏰'])
  const [insight, setInsight] = useState<string | null>(null)

  const [isLoss, setIsLoss] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })
  const [outcomeMessage, setOutcomeMessage] = useState<{ type: 'win' | 'loss'; text: string } | null>(null)

  const [accumulatedSpent, setAccumulatedSpent] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayAmount, setOverlayAmount] = useState(0)

  const intervalRef = useRef<any>(null)
  const timeoutRef = useRef<any>(null)

  const slotOptions = [
    { emoji: '⏰', name: 'Tempo Perdido', desc: 'Horas gastas que nunca mais voltam.' },
    { emoji: '❤️', name: 'Saúde Mental', desc: 'Desgaste e ansiedade crônica.' },
    { emoji: '👥', name: 'Família/Relacionamentos', desc: 'Isolamento e mentiras causadas pelo vício.' },
    { emoji: '💤', name: 'Sono Saudável', desc: 'Noites em claro tentando recuperar perdas.' },
    { emoji: '💸', name: 'Saldo Financeiro', desc: 'Seu dinheiro suado evaporando da conta.' }
  ]

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleSpin = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (spinning) return
    const cost = 50
    if (!spendBalance(cost)) {
      casinoAudio.playWarning()
      alert("Moedas virtuais insuficientes! Recarregue no botão '+' do topo gratuitamente.")
      return
    }

    casinoAudio.playTick()
    setSpinning(true)
    setInsight(null)
    setIsLoss(false)
    setShowConfetti(false)
    setOutcomeMessage(null)

    let spinTicks = 0
    intervalRef.current = setInterval(() => {
      casinoAudio.playTick()
      setReels([
        slotOptions[Math.floor(Math.random() * slotOptions.length)].emoji,
        slotOptions[Math.floor(Math.random() * slotOptions.length)].emoji,
        slotOptions[Math.floor(Math.random() * slotOptions.length)].emoji,
      ])
      spinTicks++
      
      if (spinTicks > 9) {
        clearInterval(intervalRef.current)
        
        // Random outcome selection
        const rand = Math.random()
        let finalReels: string[]
        let won = false
        let isNearMiss = false

        if (rand < 0.10) {
          // 10% Win
          const prizeEmoji = slotOptions[Math.floor(Math.random() * slotOptions.length)].emoji
          finalReels = [prizeEmoji, prizeEmoji, prizeEmoji]
          won = true
        } else if (rand < 0.70) {
          // 60% Near-Miss (2 matching, 1 different)
          const matchItem = slotOptions[Math.floor(Math.random() * slotOptions.length)].emoji
          let diffItem = slotOptions[Math.floor(Math.random() * slotOptions.length)].emoji
          while (diffItem === matchItem) {
            diffItem = slotOptions[Math.floor(Math.random() * slotOptions.length)].emoji
          }
          finalReels = [matchItem, matchItem, diffItem]
          isNearMiss = true
        } else {
          // 30% Cold Loss (3 distinct)
          const shuffled = [...slotOptions].sort(() => 0.5 - Math.random())
          finalReels = [shuffled[0].emoji, shuffled[1].emoji, shuffled[2].emoji]
        }

        setReels(finalReels)
        setSpinning(false)

        if (won) {
          casinoAudio.playWinMelody()
          setShowConfetti(true)
          
          // Reward payout (10x multiplier)
          const reward = cost * 10
          addBalance(reward)
          
          setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
          setShowerTrigger(true)

          setOutcomeMessage({
            type: 'win',
            text: `GANHOU R$ ${reward.toFixed(2).replace('.', ',')}!`
          })

          setInsight(
            `💰 VOCÊ VENCEU A SIMULAÇÃO! Ganhou +500 moedas virtuais. Na vida real, grandes vitórias esporádicas reiniciam a tolerância do cérebro, fazendo com que você esqueça as dezenas de perdas anteriores. Esse fenômeno é o "Viés de Sobrevivência": lembramos da vitória brilhante, mas ignoramos o saldo geral negativo.`
          )
        } else {
          casinoAudio.playLossSweep()
          setIsLoss(true)
          incrementSimulatedStats(cost, 15)

          setOutcomeMessage({
            type: 'loss',
            text: `PERDEU R$ ${cost.toFixed(2).replace('.', ',')}!`
          })

          if (isNearMiss) {
            setInsight(
              `💡 EFEITO QUASE-VITÓRIA (NEAR-MISS): O algoritmo parou 2 rolos idênticos e o 3º logo em seguida. Seu cérebro processa isso exatamente como uma 'quase-vitória', estimulando a liberação de dopamina rápida. Isso gera a falsa sensação de que você está 'perto' de ganhar, induzindo-o a rodar mais uma vez.`
            )
          } else {
            setInsight(
              `⚠️ PERDA FRIA: Três símbolos totalmente distintos. Em um cassino real, o som festivo diminui um pouco, mas a tela pisca incentivando o próximo clique. Você acabou de perder R$ 50 fictícios e 15 segundos de vida útil.`
            )
          }
        }

        // Track session spent for cognitive interruption
        const newAccumulated = accumulatedSpent + cost
        if (newAccumulated >= 10) {
          setOverlayAmount(newAccumulated)
          setAccumulatedSpent(0)
          setTimeout(() => {
            setOverlayOpen(true)
          }, 1200)
        } else {
          setAccumulatedSpent(newAccumulated)
        }
      }
    }, 150)
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
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Slots da Verdade</h3>
          <p className="text-[10px] text-zinc-400">Custo da rodada: 50 moedas fictícias</p>
        </div>

        <div className="relative flex justify-center gap-3 py-6 bg-zinc-950 border border-cyber-border rounded-xl">
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

          {reels.map((emoji, index) => (
            <motion.div 
              key={index}
              animate={spinning ? { y: [0, -15, 15, 0] } : {}}
              transition={{ repeat: spinning ? Infinity : 0, duration: 0.15 }}
              className="w-16 h-20 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-3xl shadow-inner select-none"
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <Button
          onClick={handleSpin}
          disabled={spinning}
          variant="primary"
          glow
          className="w-full relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <span className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] animate-shimmer" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <RotateCw size={16} className={spinning ? "animate-spin" : ""} />
            {spinning ? 'GIRANDO...' : 'GIRAR CORRIDA'}
          </span>
        </Button>

        <AnimatePresence>
          {insight && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 leading-relaxed space-y-2 border-l-2 border-l-neon-green"
            >
              <div className="flex items-center gap-1.5 text-neon-green font-bold">
                <ShieldAlert size={14} />
                <Badge variant="green" glow>Análise Terapêutica</Badge>
              </div>
              <p>{insight}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </LossShake>
  )
}
