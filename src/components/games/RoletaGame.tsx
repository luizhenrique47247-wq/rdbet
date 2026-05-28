import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { ShieldAlert, Minus, Plus, RotateCw, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'
import { casinoAudio } from '../../utils/audioEngine'
import { CoinShower } from '../animations/CoinShower'
import { Confetti } from '../ui/Confetti'
import { LossShake } from '../animations/LossShake'
import { CognitiveOverlay } from '../ui/CognitiveOverlay'

export const RoletaGame: React.FC = () => {
  const { spendBalance, addBalance, incrementSimulatedStats, incrementBetsCount, balance, setActiveGame } = useStore()
  
  const [bet, setBet] = useState(5.00)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [insight, setInsight] = useState<string | null>(null)
  
  const [isLoss, setIsLoss] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })
  const [screenMessage, setScreenMessage] = useState<{ text: string; colorClass: string; duration: number } | null>(null)

  // Interruption overlay states
  const [accumulatedSpent, setAccumulatedSpent] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayAmount, setOverlayAmount] = useState(0)

  const timeoutRef = useRef<any>(null)
  const tickIntervalRef = useRef<any>(null)

  const roletaSectors = [
    { text: 'Nada', isBad: true, multiplier: 0 },
    { text: '0.25x', isBad: true, multiplier: 0.25 },
    { text: 'Jogue dnv', isBad: true, multiplier: 0 },
    { text: '0.50x', isBad: true, multiplier: 0.50 },
    { text: '10x', isBad: false, multiplier: 10 },
    { text: 'Nada', isBad: true, multiplier: 0 },
    { text: '2.5x', isBad: false, multiplier: 2.5 },
    { text: '1.5x', isBad: false, multiplier: 1.5 },
    { text: '0.10x', isBad: true, multiplier: 0.10 },
    { text: '5x', isBad: false, multiplier: 5 },
    { text: 'Nada', isBad: true, multiplier: 0 },
    { text: '0.75x', isBad: true, multiplier: 0.75 }
  ]

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

  const handleSpin = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (spinning) return
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

    // Stage 1: PREPARANDO Overlay (1.2 seconds block)
    setScreenMessage({
      text: "PREPARANDO",
      colorClass: "text-[#3b82f6] drop-shadow-[0_0_20px_rgba(59,130,246,0.85)] animate-pulse",
      duration: 0
    })

    spendBalance(cost)

    timeoutRef.current = setTimeout(() => {
      // Stage 2: Spin starts. Clear overlay completely so the wheel is fully visible!
      setScreenMessage(null)

      // Math probability check for 12 sectors
      const rng = Math.random()
      let winningIndex: number
      let payoutMultiplier = 0

      if (rng < 0.02) {
        winningIndex = 4 // 10x
        payoutMultiplier = 10
      } else if (rng < 0.05) {
        winningIndex = 9 // 5x
        payoutMultiplier = 5
      } else if (rng < 0.09) {
        winningIndex = 6 // 2.5x
        payoutMultiplier = 2.5
      } else if (rng < 0.15) {
        winningIndex = 7 // 1.5x
        payoutMultiplier = 1.5
      } else if (rng < 0.30) {
        winningIndex = 11 // 0.75x
        payoutMultiplier = 0.75
      } else if (rng < 0.45) {
        winningIndex = 3 // 0.50x
        payoutMultiplier = 0.50
      } else if (rng < 0.60) {
        winningIndex = 1 // 0.25x
        payoutMultiplier = 0.25
      } else if (rng < 0.72) {
        winningIndex = 8 // 0.10x
        payoutMultiplier = 0.10
      } else if (rng < 0.85) {
        winningIndex = 2 // Jogue dnv
        payoutMultiplier = 0
      } else {
        const nadaOptions = [0, 5, 10]
        winningIndex = nadaOptions[Math.floor(Math.random() * nadaOptions.length)]
        payoutMultiplier = 0
      }

      // Calculate next rotation target to land under top pointer (270 degrees)
      setRotation(prev => {
        const baseSpins = 360 * 5 // 5 spins
        const currentSpinBase = Math.floor(prev / 360) * 360
        return currentSpinBase + baseSpins + 270 - winningIndex * 30
      })

      // Audio ticks
      let ticks = 0
      const maxTicks = 14
      tickIntervalRef.current = setInterval(() => {
        casinoAudio.playTick()
        ticks++
        if (ticks >= maxTicks) {
          clearInterval(tickIntervalRef.current)
        }
      }, 220)

      // Spin finishes in 3.5s
      timeoutRef.current = setTimeout(() => {
        clearInterval(tickIntervalRef.current)
        setSpinning(false)

        // Stage 3: Wait 1.8 seconds before showing the results overlay
        timeoutRef.current = setTimeout(() => {
          const returnAmount = cost * payoutMultiplier
          if (payoutMultiplier > 0) {
            addBalance(returnAmount)
          }

          if (payoutMultiplier >= 1.0) {
            // Win
            casinoAudio.playWinMelody()
            setShowConfetti(true)

            setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
            setShowerTrigger(true)

            setScreenMessage({
              text: `${roletaSectors[winningIndex].text} RETORNO!`,
              colorClass: "text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.85)]",
              duration: 0
            })

            setInsight(
              `💰 GANHO ILUSÓRIO! Você caiu em "${roletaSectors[winningIndex].text}" e recebeu R$ ${returnAmount.toFixed(2).replace('.', ',')} fictícios. Cuidado: vitórias ocasionais são a isca principal para redefinir sua tolerância ao risco, fortalecendo a falsa impressão de ganho futuro.`
            )
          } else if (payoutMultiplier > 0) {
            // LDW (Loss Disguised as Win)
            casinoAudio.playLossSweep()
            setIsLoss(true)
            incrementSimulatedStats(cost - returnAmount, 20)

            setScreenMessage({
              text: `${roletaSectors[winningIndex].text} QUASE!`,
              colorClass: "text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.85)]",
              duration: 0
            })

            setInsight(
              `⚠️ PERDA DISFARÇADA DE GANHO: Você caiu em "${roletaSectors[winningIndex].text}" e obteve R$ ${returnAmount.toFixed(2).replace('.', ',')} de volta. Embora a roleta pisque e celebre, você perdeu R$ ${(cost - returnAmount).toFixed(2).replace('.', ',')} nesta rodada. Cassinos usam esse truque de devolver migalhas para fazer você sentir que está ganhando quando, na verdade, está perdendo.`
            )
          } else {
            // Total Loss (Nada, Jogue dnv)
            casinoAudio.playLossSweep()
            setIsLoss(true)
            incrementSimulatedStats(cost, 20)

            const isJogueDnv = winningIndex === 2
            setScreenMessage({
              text: isJogueDnv ? "JOGUE DNV" : "PERDEU!",
              colorClass: isJogueDnv ? "text-[#3b82f6] drop-shadow-[0_0_20px_rgba(59,130,246,0.85)]" : "text-red-500 drop-shadow-[0_0_20px_rgba(255,51,51,0.85)]",
              duration: 0
            })

            if (isJogueDnv) {
              setInsight(
                `🔄 TENTAÇÃO DE RECOMEÇAR: O setor "Jogue dnv" é um incentivo mental clássico para continuar clicando sem parar, estimulando o cérebro a recuperar a aposta perdida. É o loop infinito da compulsão: jogar para recuperar até perder tudo.`
              )
            } else {
              setInsight(
                `🔴 PERDA TOTAL: Você caiu em "Nada" e perdeu R$ ${cost.toFixed(2).replace('.', ',')} inteiramente. A roleta da impulsividade mostra a realidade matemática: no longo prazo, a casa sempre vence. Parabéns por se proteger no simulador.`
              )
            }
          }

          incrementBetsCount()

          // Session spent overlay check
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
        }, 1800) // 1.8s delay to inspect wheel stop before overlay

      }, 3500) // 3.5s spin

    }, 1200)
  }

  // Draw 12 segments helpers (Exactly two shades of blue)
  const getSectorFill = (idx: number) => {
    return idx % 2 === 0 ? '#0c152b' : '#1d4ed8'
  }

  const getSectorTextFill = (idx: number) => {
    const isWin = idx === 4 || idx === 6 || idx === 7 || idx === 9
    return isWin ? '#ffffff' : '#93c5fd'
  }

  return (
    <LossShake isLoss={isLoss} className="h-full flex flex-col">
      <Card className="p-4 flex flex-col justify-between flex-1 relative overflow-hidden bg-gradient-to-b from-[#0a1122] via-[#04070e] to-[#020306] border border-[#3b82f6]/25 shadow-[0_0_40px_rgba(59,130,246,0.1)] rounded-2xl">
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
        <div className="flex items-center justify-between shrink-0 mb-3 z-20">
          <button 
            onClick={() => {
              casinoAudio.playTick()
              setActiveGame(null)
            }}
            className="bg-[#111]/80 p-1.5 rounded-xl text-white hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          
          <h2 className="font-display font-black text-xl uppercase text-[#3b82f6] flex items-center gap-2 select-none">
            <RotateCw className="w-5 h-5 text-[#3b82f6] animate-pulse" /> Roleta RD
          </h2>
          
          <div className="w-8 h-8 flex items-center justify-center" />
        </div>

        {/* Wheel Box Container - Expanded Width */}
        <div className="w-full max-w-[344px] mx-auto bg-black/60 rounded-2xl p-3 border border-[#3b82f6]/30 shrink-0 shadow-[0_0_40px_rgba(59,130,246,0.15)] relative overflow-hidden my-auto flex flex-col items-center select-none">
          
          {/* Top Pointer Arrow */}
          <div className="absolute top-1 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent border-t-white z-30 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />

          {/* Screen message overlay (e.g. PREPARANDO, LUCRO, PERDEU) */}
          <AnimatePresence>
            {screenMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-[1.5px] p-4 text-center select-none"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={cn("font-display font-black text-2xl uppercase tracking-widest mb-1.5", screenMessage.colorClass)}
                >
                  {screenMessage.text}
                </motion.div>

                {insight && screenMessage.text !== "PREPARANDO" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-[9.5px] text-zinc-300 leading-normal border-t border-[#3b82f6]/20 pt-2 mt-1 text-left overflow-y-auto max-h-[145px] scrollbar-none"
                  >
                    <div className="flex items-center gap-1 text-[#3b82f6] font-black uppercase text-[7.5px] tracking-wider mb-1 select-none">
                      <ShieldAlert size={10} /> Análise Terapêutica
                    </div>
                    <p className="font-medium text-zinc-400">{insight}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rotatable wheel canvas (SVG) - Max Size w-[300px] */}
          <motion.div
            className="w-[300px] h-[300px] flex items-center justify-center relative rounded-full"
            animate={{ rotate: rotation }}
            transition={{
              type: "tween",
              duration: spinning ? 3.5 : 0.5,
              ease: spinning ? [0.15, 0.85, 0.3, 1] : "easeOut"
            }}
          >
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.25)]">
              {/* Outer Rims */}
              <circle cx="150" cy="150" r="145" fill="none" stroke="#1d4ed8" strokeWidth="4" className="opacity-90" />
              <circle cx="150" cy="150" r="140" fill="none" stroke="#3b82f6" strokeWidth="1.5" />

              {/* 12 Sectors */}
              {roletaSectors.map((sector, i) => (
                <g key={i} transform={`rotate(${i * 30} 150 150)`}>
                  {/* Arc Path for 30 degrees slice */}
                  <path
                    d="M 150 150 L 285.23 113.77 A 140 140 0 0 1 285.23 186.23 Z"
                    fill={getSectorFill(i)}
                    stroke="#1e3a8a"
                    strokeWidth="1.5"
                  />
                  {/* Radial Text */}
                  <text
                    x="262"
                    y="153.5"
                    textAnchor="end"
                    fill={getSectorTextFill(i)}
                    fontSize="7.5"
                    fontWeight="900"
                    className="tracking-wider uppercase select-none font-sans"
                  >
                    {sector.text}
                  </text>
                </g>
              ))}

              {/* Gold/Yellow pegs around the outer rim */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = ((i * 30 + 15) * Math.PI) / 180
                const x = 150 + 140 * Math.cos(angle)
                const y = 150 + 140 * Math.sin(angle)
                return <circle key={i} cx={x} cy={y} r="2.5" fill="#facc15" stroke="#000" strokeWidth="0.5" />
              })}

              {/* Center Cap Details */}
              <circle cx="150" cy="150" r="28" fill="#070d19" stroke="#3b82f6" strokeWidth="3" />
              <circle cx="150" cy="150" r="12" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="4" fill="#00f0ff" />
            </svg>
          </motion.div>
        </div>

        {/* Controls Panel */}
        <div className="w-full bg-black/50 border border-[#3b82f6]/25 rounded-xl p-3 flex flex-col gap-3 shrink-0 shadow-2xl relative z-20">
          
          <div className="flex gap-2">
            {/* Bet Size control */}
            <div className="flex-1">
              <label className="text-[8px] font-black text-[#3b82f6] uppercase tracking-widest block mb-1 pl-1">Aposta</label>
              <div className="bg-black/40 border border-[#3b82f6]/30 rounded-lg flex items-center h-9">
                <button
                  onClick={handleMinus}
                  disabled={spinning}
                  className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-l-lg transition-colors active:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 flex items-center justify-center h-full border-x border-[#3b82f6]/30">
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

            {/* Read-only Sectors Configuration */}
            <div className="w-[100px] select-none">
              <label className="text-[8px] font-black text-[#3b82f6] uppercase tracking-widest block mb-1 pl-1">Setores</label>
              <div className="bg-black/40 border border-[#3b82f6]/30 rounded-lg flex items-center justify-center h-9 text-white font-black text-xs">
                12 Setores
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-stretch h-11">
            {/* Returns Display (10x potential win) */}
            <div className="w-[110px] flex flex-col justify-center items-center bg-black/40 rounded-lg border border-[#3b82f6]/30">
              <span className="text-[7px] font-black text-[#3b82f6] uppercase tracking-widest mb-0.5">Retorno Máx (10x)</span>
              <span className="font-display font-black text-xs text-[#60a5fa] leading-none select-none">
                R$ {(bet * 10).toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Action Play Button */}
            <button
              onClick={handleSpin}
              disabled={spinning}
              className={cn(
                "flex-1 font-display font-black uppercase rounded-lg transition-all text-xs tracking-widest flex items-center justify-center cursor-pointer border-none shadow-xl",
                spinning
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed animate-pulse"
                  : "bg-[#3b82f6] hover:bg-[#60a5fa] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.01]"
              )}
            >
              {spinning ? 'ROLANDO...' : 'RODAR ROLETA'}
            </button>
          </div>

        </div>
      </Card>
    </LossShake>
  )
}
