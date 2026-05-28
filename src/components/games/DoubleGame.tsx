import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { ShieldAlert, Minus, Plus, Disc, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'
import { casinoAudio } from '../../utils/audioEngine'
import { CoinShower } from '../animations/CoinShower'
import { Confetti } from '../ui/Confetti'
import { LossShake } from '../animations/LossShake'
import { CognitiveOverlay } from '../ui/CognitiveOverlay'

export const DoubleGame: React.FC = () => {
  const { spendBalance, addBalance, incrementSimulatedStats, incrementBetsCount, balance, setActiveGame } = useStore()
  const [bet, setBet] = useState(5.00)
  const [betColor, setBetColor] = useState<'red' | 'white' | 'black' | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [rollHistory, setRollHistory] = useState<Array<'red' | 'white' | 'black'>>(['red', 'black', 'black', 'red', 'red', 'black', 'red'])
  const [insight, setInsight] = useState<string | null>(null)
  
  const [isLoss, setIsLoss] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })
  const [screenMessage, setScreenMessage] = useState<{ text: string; colorClass: string; duration: number } | null>(null)

  const [translateX, setTranslateX] = useState(0)
  const [duration, setDuration] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Interruption overlay states
  const [accumulatedSpent, setAccumulatedSpent] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayAmount, setOverlayAmount] = useState(0)

  const timeoutRef = useRef<any>(null)
  const tickIntervalRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current)
    }
  }, [])

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

  const pattern = ['black', 'red', 'black', 'red', 'black', 'red', 'white']
  const trackBlocks = Array.from({ length: 85 }, (_, i) => pattern[i % pattern.length] as 'red' | 'white' | 'black')

  const handleRoll = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (spinning || !betColor) return
    const cost = bet
    if (cost > balance) {
      casinoAudio.playWarning()
      alert("Saldo insuficiente na banca virtual!")
      return
    }

    casinoAudio.playTick()
    setSpinning(true)
    setInsight(null)
    setIsLoss(false)
    setShowConfetti(false)
    setScreenMessage({ text: "GIRANDO", colorClass: "text-white/60", duration: 0 })

    // Deduct bet from balance
    spendBalance(cost)

    // Curva de ganância (5% de chance conforme original)
    const won = Math.random() < 0.05
    let finalColor: 'red' | 'white' | 'black'

    if (won) {
      finalColor = betColor
    } else {
      if (betColor === 'white') {
        finalColor = Math.random() < 0.5 ? 'red' : 'black'
      } else {
        const oppositeColor = betColor === 'red' ? 'black' : 'red'
        finalColor = Math.random() < 0.05 ? 'white' : oppositeColor
      }
    }

    // Stop index
    let winningIndex = 48
    while (winningIndex < trackBlocks.length && trackBlocks[winningIndex % trackBlocks.length] !== finalColor) {
      winningIndex++
    }

    const containerWidth = containerRef.current?.clientWidth || 320
    const centerOffset = containerWidth / 2
    const randomOffset = (Math.random() * 40) - 20
    const totalBlockWidth = 72
    const targetTranslation = -((winningIndex * totalBlockWidth) - centerOffset + (totalBlockWidth / 2) + randomOffset)

    // Sound ticking
    let ticks = 0
    const maxTicks = 12
    tickIntervalRef.current = setInterval(() => {
      casinoAudio.playTick()
      ticks++
      if (ticks >= maxTicks) {
        clearInterval(tickIntervalRef.current)
      }
    }, 250)

    // Instant snap
    setTranslateX(0)
    setDuration(0)

    timeoutRef.current = setTimeout(() => {
      setTranslateX(targetTranslation)
      setDuration(4)
    }, 50)

    timeoutRef.current = setTimeout(() => {
      clearInterval(tickIntervalRef.current)
      setSpinning(false)

      setRollHistory(prev => [finalColor, ...prev.slice(0, 7)])

      if (won) {
        casinoAudio.playWinMelody()
        setShowConfetti(true)
        const multiplier = finalColor === 'white' ? 14 : 2
        const winAmount = cost * multiplier
        addBalance(winAmount)

        setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
        setShowerTrigger(true)

        setScreenMessage({
          text: "LUCRO!",
          colorClass: "text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.85)]",
          duration: 1500
        })

        setInsight(
          `💰 SIMULAÇÃO VITORIOSA! Ganhou R$ ${winAmount.toFixed(2).replace('.', ',')} fictícios. Cuidado: vitórias esporádicas reiniciam a tolerância do cérebro ao risco, fortalecendo a falsa impressão de ganho futuro.`
        )
      } else {
        casinoAudio.playLossSweep()
        setIsLoss(true)
        incrementSimulatedStats(cost, 20)

        setScreenMessage({
          text: "PERDEU!",
          colorClass: "text-red-500 drop-shadow-[0_0_20px_rgba(255,51,51,0.85)]",
          duration: 2000
        })

        if (finalColor === 'white') {
          setInsight(
            `💡 EFEITO QUASE-VITÓRIA: O branco (14x) quase parou na seta! Casas de apostas posicionam multiplicadores raros ao lado de perdas comuns de propósito para manter o jogador fissurado.`
          )
        } else {
          setInsight(
            `⚠️ RED REALMENTE POUPADO: Você perdeu R$ ${cost.toFixed(2).replace('.', ',')} fictícios. Na vida real, o jogo de azar é programado matematicamente para acumular perdas. Parabéns por se proteger.`
          )
        }
      }

      incrementBetsCount()

      // Track session spent for cognitive interruption overlay
      const newAccumulated = accumulatedSpent + cost
      if (newAccumulated >= 150) {
        setOverlayAmount(newAccumulated)
        setAccumulatedSpent(0)
        setTimeout(() => {
          setOverlayOpen(true)
        }, 1200)
      } else {
        setAccumulatedSpent(newAccumulated)
      }
    }, 4100)
  }

  return (
    <LossShake isLoss={isLoss} className="h-full flex flex-col">
      <Card className="p-5 flex flex-col justify-between flex-1 relative overflow-hidden bg-gradient-to-b from-[#1c0c0e] via-[#0d0607] to-[#050203] border border-[#ef4444]/25 shadow-[0_0_40px_rgba(239,68,68,0.1)] rounded-2xl">
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
          
          <h2 className="font-display font-black text-xl uppercase text-[#ef4444] flex items-center gap-2 select-none">
            <Disc className="w-5 h-5 fill-current text-[#ef4444]" /> Double RD
          </h2>
          
          <div className="w-8 h-8 flex items-center justify-center" />
        </div>

        {/* Roulette Box Container */}
        <div className="w-full max-w-[380px] mx-auto bg-black/60 rounded-2xl p-4 border border-[#ef4444]/30 shrink-0 shadow-[0_0_40px_rgba(239,68,68,0.15)] relative overflow-hidden my-auto flex flex-col gap-2">
          {/* History Indicators Bar */}
          <div className="bg-[#0a0f0d] rounded-xl p-2 border border-white/5 flex justify-end items-center gap-1.5 overflow-hidden h-8 w-full select-none">
            <span className="text-[7px] text-zinc-500 font-extrabold uppercase mr-auto tracking-widest pl-1">Histórico</span>
            {rollHistory.slice(0, 8).map((color, idx) => {
              const bgClass = color === 'red' ? 'bg-[#ef4444]' : color === 'white' ? 'bg-white shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'bg-[#1a1f1c] border border-zinc-800'
              return <div key={idx} className={cn("w-3.5 h-3.5 rounded-full flex-shrink-0", bgClass)} />
            })}
          </div>

          {/* Sliding Track Viewport */}
          <div 
            ref={containerRef} 
            className="w-full bg-black/60 rounded-xl p-2 border border-[#ef4444]/20 relative overflow-hidden h-28 flex items-center select-none"
          >
            {/* Center Selector Pointer Lines */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white/20 z-20 pointer-events-none flex flex-col justify-between items-center">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-white"></div>
            </div>

            {/* Sorteando / Perdeu / Lucro Message overlays */}
            <AnimatePresence>
              {screenMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/50 backdrop-blur-[1px]"
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

            {/* Translation Track */}
            <motion.div 
              className="flex items-center h-full relative left-0"
              animate={{ x: translateX }}
              transition={{ 
                type: "tween",
                duration: duration, 
                ease: duration > 0 ? [0.15, 0.85, 0.3, 1] : "linear"
              }}
            >
              {trackBlocks.map((color, idx) => {
                const bgClass = color === 'red' ? 'bg-[#ef4444]' : color === 'white' ? 'bg-white' : 'bg-[#1a1f1c]'
                const shadowClass = color === 'white' ? 'shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''
                const textClass = color === 'white' ? 'text-black' : 'text-white/30'
                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "w-16 h-16 rounded-xl flex-shrink-0 mx-1 flex items-center justify-center border border-black/25",
                      bgClass,
                      shadowClass
                    )}
                  >
                    <Disc className={cn("w-8 h-8", textClass)} />
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* Analysis Insight Box (Placed above controls) */}
        <AnimatePresence>
          {insight && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-3.5 bg-black/50 border border-[#ef4444]/20 rounded-xl text-[10.5px] text-zinc-300 leading-relaxed space-y-2 border-l-2 border-l-neon-green mb-4 text-left relative z-20"
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
        <div className="w-full bg-black/50 border border-[#ef4444]/25 rounded-xl p-3 flex flex-col gap-3 shrink-0 shadow-2xl relative z-20">
          
          <div className="flex gap-2">
            {/* Bet Input */}
            <div className="flex-1">
              <label className="text-[8px] font-black text-[#ef4444] uppercase tracking-widest block mb-1 pl-1">Aposta</label>
              <div className="bg-black/40 border border-[#ef4444]/30 rounded-lg flex items-center h-9">
                <button 
                  onClick={handleMinus}
                  disabled={spinning}
                  className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-l-lg transition-colors active:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 flex items-center justify-center h-full border-x border-[#ef4444]/30">
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

            {/* Color buttons grid */}
            <div className="flex gap-1.5 items-end select-none">
              <button
                onClick={() => {
                  if (spinning) return
                  casinoAudio.playTick()
                  setBetColor('red')
                }}
                disabled={spinning}
                className={cn(
                  "w-9 h-9 rounded-lg bg-[#ef4444] border-2 hover:scale-95 transition-all flex items-center justify-center text-white font-bold text-[10px] cursor-pointer",
                  betColor === 'red' ? 'border-white shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'border-transparent'
                )}
              >
                2x
              </button>
              <button
                onClick={() => {
                  if (spinning) return
                  casinoAudio.playTick()
                  setBetColor('white')
                }}
                disabled={spinning}
                className={cn(
                  "w-9 h-9 rounded-lg bg-white border-2 hover:scale-95 transition-all flex items-center justify-center text-black font-bold text-[10px] cursor-pointer",
                  betColor === 'white' ? 'border-zinc-500 shadow-[0_0_15px_rgba(255,255,255,0.45)]' : 'border-transparent'
                )}
              >
                14x
              </button>
              <button
                onClick={() => {
                  if (spinning) return
                  casinoAudio.playTick()
                  setBetColor('black')
                }}
                disabled={spinning}
                className={cn(
                  "w-9 h-9 rounded-lg bg-[#1a1f1c] border-2 hover:scale-95 transition-all flex items-center justify-center text-white font-bold text-[10px] cursor-pointer",
                  betColor === 'black' ? 'border-white shadow-[0_0_10px_rgba(255,255,255,0.15)]' : 'border-transparent'
                )}
              >
                2x
              </button>
            </div>
          </div>

          <div className="flex gap-2 items-stretch h-11">
            {/* Return Payout display */}
            <div className="w-[110px] flex flex-col justify-center items-center bg-black/40 rounded-lg border border-[#ef4444]/30">
              <span className="text-[7px] font-black text-[#ef4444] uppercase tracking-widest mb-0.5">Retorno</span>
              <span className="font-display font-black text-xs text-[#ef4444] leading-none select-none">
                {betColor ? `R$ ${(bet * (betColor === 'white' ? 14 : 2)).toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
              </span>
            </div>

            {/* Action Play button */}
            <button 
              onClick={handleRoll}
              disabled={spinning || !betColor}
              className={cn(
                "flex-1 font-display font-black uppercase rounded-lg transition-all text-xs tracking-widest flex items-center justify-center cursor-pointer border-none shadow-xl",
                spinning
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed animate-pulse"
                  : !betColor
                    ? "bg-zinc-950/60 text-zinc-500 cursor-not-allowed border border-zinc-800/40"
                    : betColor === 'red'
                      ? "bg-[#ef4444] hover:bg-[#f87171] text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-[1.01]"
                      : betColor === 'black'
                        ? "bg-[#1a1f1c] border border-[#ef4444]/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:scale-[1.01]"
                        : "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:scale-[1.01]"
              )}
            >
              {spinning ? 'ROLANDO...' : !betColor ? 'SELECIONE A COR' : 'COMEÇAR JOGO'}
            </button>
          </div>

        </div>
      </Card>
    </LossShake>
  )
}
