import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { Cherry, Gem, Clover, Crown, Heart, Minus, Plus, Rows, ShieldAlert, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { casinoAudio } from '../../utils/audioEngine'
import { CoinShower } from '../animations/CoinShower'
import { Confetti } from '../ui/Confetti'
import { LossShake } from '../animations/LossShake'
import { CognitiveOverlay } from '../ui/CognitiveOverlay'
import { cn } from '../../utils/cn'

interface SlotsGameProps {
  onBack?: () => void
}

export const SlotsGame: React.FC<SlotsGameProps> = () => {
  const { spendBalance, addBalance, incrementSimulatedStats, incrementBetsCount, balance, setActiveGame } = useStore()
  const [spinning, setSpinning] = useState(false)
  
  const [reels, setReels] = useState([
    { top: 'gem', mid: 'cherry', bot: 'clover' },
    { top: 'clover', mid: 'cherry', bot: 'crown' },
    { top: 'crown', mid: 'cherry', bot: 'gem' }
  ])

  const [bet, setBet] = useState(5.00)
  const [multiplier, setMultiplier] = useState(3.50)
  const [isLoss, setIsLoss] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })

  const [accumulatedSpent, setAccumulatedSpent] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayAmount, setOverlayAmount] = useState(0)
  const [insight, setInsight] = useState<string | null>(null)
  
  const [screenMessage, setScreenMessage] = useState<{ text: string; colorClass: string; duration: number } | null>(null)

  const symbols = [
    { id: 'cherry', color: 'text-red-500' },
    { id: 'gem', color: 'text-blue-400' },
    { id: 'clover', color: 'text-green-400' },
    { id: 'crown', color: 'text-yellow-400' },
    { id: 'heart', color: 'text-pink-500' }
  ]

  // Auto-hide screen messages
  useEffect(() => {
    if (screenMessage && screenMessage.duration > 0) {
      const t = setTimeout(() => {
        setScreenMessage(null)
      }, screenMessage.duration)
      return () => clearTimeout(t)
    }
  }, [screenMessage])

  const handleMinus = () => {
    if (spinning) return
    casinoAudio.playTick()
    setBet(prev => prev > 5 ? prev - 5 : 1)
  }

  const handlePlus = () => {
    if (spinning) return
    casinoAudio.playTick()
    setBet(prev => prev < 5 ? 5 : prev + 5)
  }

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (spinning) return
    const val = parseFloat(e.target.value) || 1
    setBet(val)
  }

  const getSymbolIcon = (symbolId: string, isMid: boolean) => {
    const iconClass = isMid 
      ? "w-11 h-11 text-[#a855f7] scale-110 drop-shadow-[0_0_12px_rgba(168,85,247,0.45)] transition-transform duration-75"
      : "w-8 h-8 text-white/40 opacity-30 scale-75 transition-transform duration-75"

    switch (symbolId) {
      case 'cherry': return <Cherry className={cn(iconClass, "text-red-500")} />
      case 'gem': return <Gem className={cn(iconClass, "text-blue-400")} />
      case 'clover': return <Clover className={cn(iconClass, "text-green-400")} />
      case 'crown': return <Crown className={cn(iconClass, "text-yellow-400")} />
      case 'heart': return <Heart className={cn(iconClass, "text-pink-500")} />
      default: return null
    }
  }

  const handleSpin = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (spinning) return

    if (bet > balance) {
      casinoAudio.playWarning()
      alert("Saldo insuficiente na banca virtual!")
      return
    }

    casinoAudio.playTick()
    setSpinning(true)
    setInsight(null)
    setIsLoss(false)
    setShowConfetti(false)
    setMultiplier(0.00)
    setScreenMessage({ text: "SORTEANDO...", colorClass: "text-white/60", duration: 0 })

    // Deduct bet from balance
    spendBalance(bet)

    // Curva de ganância: 20% de ganhar
    const won = Math.random() < 0.20
    let finalResult: string[]

    if (won) {
      const winSym = symbols[Math.floor(Math.random() * symbols.length)].id
      finalResult = [winSym, winSym, winSym]
    } else {
      // Perdeu: 80% chance. Near-miss (2 iguais e 1 diferente)
      const sym1 = symbols[Math.floor(Math.random() * symbols.length)].id
      const sym2 = sym1
      let sym3 = symbols[Math.floor(Math.random() * symbols.length)].id
      while (sym3 === sym1) {
        sym3 = symbols[Math.floor(Math.random() * symbols.length)].id
      }
      finalResult = [sym1, sym2, sym3]
    }

    let ticks = 0
    const maxTicks = 15

    const interval = setInterval(() => {
      ticks++

      setReels(prev => prev.map((reel, rIdx) => {
        if (ticks < maxTicks - (2 - rIdx) * 3) {
          casinoAudio.playTick()
          return {
            top: symbols[Math.floor(Math.random() * symbols.length)].id,
            mid: symbols[Math.floor(Math.random() * symbols.length)].id,
            bot: symbols[Math.floor(Math.random() * symbols.length)].id
          }
        }
        return reel
      }))

      if (ticks >= maxTicks) {
        clearInterval(interval)

        // Set final reels alignment
        const finalReels = finalResult.map((midSymId) => {
          const idx = symbols.findIndex(s => s.id === midSymId)
          const topSymId = symbols[(idx + 1) % symbols.length].id
          const botSymId = symbols[(idx - 1 + symbols.length) % symbols.length].id
          return {
            top: topSymId,
            mid: midSymId,
            bot: botSymId
          }
        })

        setReels(finalReels)
        setSpinning(false)

        if (won) {
          casinoAudio.playWinMelody()
          setShowConfetti(true)
          const mult = 3.50
          const payout = bet * mult
          setMultiplier(mult)
          addBalance(payout)

          setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
          setShowerTrigger(true)

          setScreenMessage({
            text: "LUCRO!",
            colorClass: "text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.85)]",
            duration: 1500
          })

          setInsight(
            `💰 SIMULAÇÃO GANHA! Ganhou R$ ${payout.toFixed(2).replace('.', ',')} virtuais. No entanto, na vida real, grandes vitórias esporádicas reiniciam a tolerância do cérebro, fazendo com que você esqueça as perdas acumuladas anteriores. Esse é o "Viés de Sobrevivência".`
          )
        } else {
          casinoAudio.playLossSweep()
          setIsLoss(true)
          setMultiplier(0.00)
          incrementSimulatedStats(bet, 15)

          setScreenMessage({
            text: "PERDEU!",
            colorClass: "text-red-500 drop-shadow-[0_0_20px_rgba(255,51,51,0.85)]",
            duration: 2000
          })

          const isNearMiss = finalResult[0] === finalResult[1] && finalResult[0] !== finalResult[2]
          if (isNearMiss) {
            setInsight(
              `💡 EFEITO QUASE-VITÓRIA (NEAR-MISS): O algoritmo alinhou 2 rolos idênticos e o 3º parou logo em seguida. Seu cérebro processa isso como uma 'quase-vitória', liberando dopamina rápida e induzindo a ilusão de que você está 'perto'.`
            )
          } else {
            setInsight(
              `⚠️ PERDA FRIA: Símbolos distintos. Na vida real, o jogo de azar é programado matematicamente para acumular perdas. Você acabou de poupar R$ ${bet.toFixed(2).replace('.', ',')} reais da sua vida financeira.`
            )
          }
        }

        incrementBetsCount()

        // Track session spent for cognitive interruption overlay
        const newAccumulated = accumulatedSpent + bet
        if (newAccumulated >= 150) {
          setOverlayAmount(newAccumulated)
          setAccumulatedSpent(0)
          setTimeout(() => {
            setOverlayOpen(true)
          }, 1200)
        } else {
          setAccumulatedSpent(newAccumulated)
        }
      }
    }, 100)
  }

  return (
    <LossShake isLoss={isLoss} className="h-full flex flex-col">
      <Card className="p-5 flex flex-col justify-between flex-1 relative overflow-hidden bg-gradient-to-b from-[#150d22] via-[#09060d] to-[#040306] border border-[#a855f7]/25 shadow-[0_0_40px_rgba(168,85,247,0.1)] rounded-2xl">
        <Confetti active={showConfetti} />
        
        <CoinShower
          trigger={showerTrigger}
          startX={showerCoords.x}
          startY={showerCoords.y}
          targetId="header-balance-container"
          onCoinArrived={() => casinoAudio.playCoinChime()}
          onComplete={() => setShowerTrigger(false)}
        />

        <CognitiveOverlay 
          isOpen={overlayOpen}
          amountSpent={overlayAmount}
          onClose={() => setOverlayOpen(false)}
        />

        {/* Top Header Row with Back Button */}
        <div className="flex items-center justify-between shrink-0 mb-4 z-20">
          <button 
            onClick={() => {
              casinoAudio.playTick()
              setActiveGame(null)
            }}
            className="bg-[#111]/80 p-1.5 rounded-xl text-white hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          
          <h2 className="font-display font-black text-xl uppercase text-[#a855f7] flex items-center gap-2 select-none">
            <Cherry className="w-5 h-5 fill-current text-[#a855f7]" /> Slots RD
          </h2>
          
          <div className="w-8 h-8 flex items-center justify-center" />
        </div>

        {/* Reels Slot Box */}
        <div className="w-full max-w-[350px] mx-auto bg-black/60 rounded-2xl p-4 border border-[#a855f7]/30 shrink-0 shadow-[0_0_40px_rgba(168,85,247,0.15)] relative overflow-hidden my-auto">
          
          {/* Horizontal Payline Light Bar */}
          <div className="absolute inset-y-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#a855f7]/50 to-transparent m-auto z-20 pointer-events-none" />
          
          {/* Sorteando / Perdeu / Lucro Message overlays */}
          <AnimatePresence>
            {screenMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[1px]"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={cn("font-display font-black text-4xl uppercase text-white tracking-widest", screenMessage.colorClass)}
                >
                  {screenMessage.text}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slots Reels Grid */}
          <div className="grid grid-cols-3 gap-3 relative z-10 select-none">
            {reels.map((reel, rIdx) => (
              <div key={rIdx} className="bg-[#0f0a18] border border-[#a855f7]/25 rounded-xl h-44 overflow-hidden relative">
                <motion.div
                  animate={spinning ? { y: [-15, 15, -15] } : {}}
                  transition={{ repeat: spinning ? Infinity : 0, duration: 0.12, ease: "linear" }}
                  className="flex flex-col justify-between items-center h-full py-2"
                >
                  <div className="opacity-30 scale-75">{getSymbolIcon(reel.top, false)}</div>
                  <div className="scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.25)]">{getSymbolIcon(reel.mid, true)}</div>
                  <div className="opacity-30 scale-75">{getSymbolIcon(reel.bot, false)}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Insight Box (Placed above controls) */}
        <AnimatePresence>
          {insight && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-3.5 bg-black/50 border border-[#a855f7]/20 rounded-xl text-[10.5px] text-zinc-300 leading-relaxed space-y-2 border-l-2 border-l-neon-green mb-4 text-left relative z-20"
            >
              <div className="flex items-center gap-1.5 text-neon-green font-bold select-none">
                <ShieldAlert size={14} />
                <Badge variant="green" glow>Análise Terapêutica</Badge>
              </div>
              <p>{insight}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Box */}
        <div className="w-full bg-black/50 border border-[#a855f7]/25 rounded-xl p-3 flex flex-col gap-3 shrink-0 shadow-2xl relative z-20">
          
          <div className="flex gap-2">
            {/* Bet configuration */}
            <div className="flex-1">
              <label className="text-[8px] font-black text-[#a855f7] uppercase tracking-widest block mb-1 pl-1">Aposta</label>
              <div className="bg-black/40 border border-[#a855f7]/30 rounded-lg flex items-center h-9">
                <button 
                  onClick={handleMinus}
                  disabled={spinning}
                  className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-l-lg transition-colors active:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 flex items-center justify-center h-full border-x border-[#a855f7]/30">
                  <span className="text-[#fbbf24] font-black text-[10px] mr-1">R$</span>
                  <input 
                    type="number" 
                    value={bet.toFixed(2)} 
                    onChange={handleBetChange}
                    disabled={spinning}
                    step="1.00" 
                    min="1.00" 
                    className="bg-transparent text-white font-black w-14 text-center focus:outline-none text-xs p-0 appearance-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <button 
                  onClick={handlePlus}
                  disabled={spinning}
                  className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-r-lg transition-colors active:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Lines configuration (non-interactive) */}
            <div className="w-[85px]">
              <label className="text-[8px] font-black text-[#a855f7] uppercase tracking-widest block mb-1 pl-1">Linhas</label>
              <div className="bg-black/40 border border-[#a855f7]/35 text-zinc-500 rounded-lg flex items-center justify-center h-9 text-[10px] font-black cursor-not-allowed select-none">
                <Rows className="w-3.5 h-3.5 mr-1 text-zinc-700" /> 1 Linha
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-stretch h-11">
            {/* Multiplier display */}
            <div className="w-[110px] flex flex-col justify-center items-center bg-black/40 rounded-lg border border-[#a855f7]/30">
              <span className="text-[7px] font-black text-[#a855f7] uppercase tracking-widest mb-0.5">Multiplicador</span>
              <span className="font-display font-black text-xl text-[#a855f7] leading-none select-none">
                {multiplier.toFixed(2)}x
              </span>
            </div>

            {/* Play button */}
            <button 
              onClick={handleSpin}
              disabled={spinning}
              className={cn(
                "flex-1 font-display font-black uppercase rounded-lg transition-all text-xs tracking-widest flex items-center justify-center cursor-pointer border-none",
                spinning 
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : isLoss 
                    ? "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    : "bg-[#a855f7] hover:bg-[#b46ef8] text-white shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:scale-[1.01]"
              )}
            >
              {spinning ? 'Girando...' : isLoss ? 'Girar Novamente' : 'Girar'}
            </button>
          </div>

        </div>
      </Card>
    </LossShake>
  )
}
