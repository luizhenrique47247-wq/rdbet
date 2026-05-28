import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { ShieldAlert, Minus, Plus, Dices, ChevronsLeftRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'
import { casinoAudio } from '../../utils/audioEngine'
import { CoinShower } from '../animations/CoinShower'
import { Confetti } from '../ui/Confetti'
import { LossShake } from '../animations/LossShake'
import { CognitiveOverlay } from '../ui/CognitiveOverlay'

export const DiceGame: React.FC = () => {
  const { spendBalance, addBalance, incrementSimulatedStats, incrementBetsCount, balance, setActiveGame } = useStore()
  
  const [bet, setBet] = useState(5.00)
  const [targetNumber, setTargetNumber] = useState(50)
  const [rolling, setRolling] = useState(false)
  const [rollResult, setRollResult] = useState<string>('50.00')
  const [insight, setInsight] = useState<string | null>(null)
  
  const [isLoss, setIsLoss] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })
  const [screenMessage, setScreenMessage] = useState<{ text: string; colorClass: string; duration: number } | null>(null)
  const [resultColor, setResultColor] = useState<'white' | 'green' | 'red'>('white')

  // Interruption overlay states
  const [accumulatedSpent, setAccumulatedSpent] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayAmount, setOverlayAmount] = useState(0)

  const timeoutRef = useRef<any>(null)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
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

  // Slider visual percentage
  const percent = ((targetNumber - 2) / (98 - 2)) * 100
  
  // Math calculations
  const chance = targetNumber - 1
  const multiplier = 99 / chance

  const handleMinus = () => {
    if (rolling) return
    casinoAudio.playTick()
    setBet(prev => prev > 5 ? prev - 5 : 1)
  }

  const handlePlus = () => {
    if (rolling) return
    casinoAudio.playTick()
    setBet(prev => prev < 5 ? 5 : prev + 5)
  }

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (rolling) return
    const val = parseFloat(e.target.value) || 1
    setBet(val)
  }

  const handleRoll = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (rolling) return
    const cost = bet
    if (cost > balance) {
      casinoAudio.playWarning()
      alert("Saldo insuficiente na banca virtual!")
      return
    }

    casinoAudio.playTick()
    setRolling(true)
    setInsight(null)
    setIsLoss(false)
    setShowConfetti(false)
    setResultColor('white')

    // Stage 1: PREPARANDO Overlay (1.2 seconds block)
    setScreenMessage({
      text: "PREPARANDO",
      colorClass: "text-[#ec4899] drop-shadow-[0_0_20px_rgba(236,72,153,0.85)] animate-pulse",
      duration: 0
    })

    spendBalance(cost)

    timeoutRef.current = setTimeout(() => {
      // Stage 2: Roll animation starts (Overlay hides, numbers roll visibly)
      setScreenMessage(null)

      // Mathematically fair dice roll: real chance of winning matches the slider chance (targetNumber - 1)%
      const finalNumber = parseFloat((Math.random() * 100).toFixed(2))
      const won = finalNumber < targetNumber
      const isNearMiss = !won && finalNumber <= targetNumber + 3

      // Fast random numbers rolling ticks (2.0s duration)
      let ticks = 0
      const maxTicks = 25
      intervalRef.current = setInterval(() => {
        casinoAudio.playTick()
        setRollResult((Math.random() * 100).toFixed(2))
        ticks++
        if (ticks >= maxTicks) {
          clearInterval(intervalRef.current)
        }
      }, 80)

      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current)
        
        // Output final result
        const finalStr = finalNumber.toFixed(2)
        setRollResult(finalStr)
        setResultColor(won ? 'green' : 'red')

        // Stage 3: Wait 1.8 seconds to inspect stop result
        timeoutRef.current = setTimeout(() => {
          setRolling(false)

          if (won) {
            casinoAudio.playWinMelody()
            setShowConfetti(true)
            const winAmount = cost * multiplier
            const netProfit = winAmount - cost
            addBalance(winAmount)

            setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
            setShowerTrigger(true)

            setScreenMessage({
              text: "LUCRO!",
              colorClass: "text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.85)]",
              duration: 0
            })

            setInsight(
              `💰 GANHO ILUSÓRIO! O dado caiu em ${finalStr} (abaixo de ${targetNumber.toFixed(2)}) e rendeu R$ ${netProfit.toFixed(2).replace('.', ',')} fictícios. Cuidado: vitórias sob margens difíceis geram picos intensos de dopamina e a ilusão de controle sobre o acaso.`
            )
          } else {
            casinoAudio.playLossSweep()
            setIsLoss(true)
            incrementSimulatedStats(cost, 20)

            setScreenMessage({
              text: isNearMiss ? "QUASE LÁ!" : "PERDEU!",
              colorClass: isNearMiss ? "text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.85)]" : "text-red-500 drop-shadow-[0_0_20px_rgba(255,51,51,0.85)]",
              duration: 0
            })

            if (isNearMiss) {
              setInsight(
                `⚠️ EFEITO QUASE-VITÓRIA: O resultado foi ${finalStr}, raspando no alvo de ${targetNumber.toFixed(2)}! Casas de apostas regulam o acaso para gerar falsas vitórias que o cérebro interpreta como progresso, motivando você a apostar mais.`
              )
            } else {
              setInsight(
                `🔴 PERDA SECA: O dado deu ${finalStr} (acima de ${targetNumber.toFixed(2)}). Você perdeu R$ ${cost.toFixed(2).replace('.', ',')} virtuais. A matemática do Dice garante a vantagem inabalável do cassino no longo prazo.`
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
        }, 1800) // 1.8s stop delay

      }, 2000) // 2.0s roll tick animation

    }, 1200) // 1.2s PREPARANDO block
  }

  return (
    <LossShake isLoss={isLoss} className="h-full flex flex-col">
      <Card className="p-4 flex flex-col justify-between flex-1 relative overflow-hidden bg-gradient-to-b from-[#1c0c14] via-[#0d060a] to-[#050204] border border-[#ec4899]/25 shadow-[0_0_40px_rgba(236,72,153,0.1)] rounded-2xl">
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
        <div className="flex items-center justify-between shrink-0 mb-2.5 z-20">
          <button 
            onClick={() => {
              casinoAudio.playTick()
              setActiveGame(null)
            }}
            className="bg-[#111]/80 p-1.5 rounded-xl text-white hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          
          <h2 className="font-display font-black text-xl uppercase text-[#ec4899] flex items-center gap-2 select-none">
            <Dices className="w-5 h-5 text-[#ec4899] animate-pulse" /> Dice RD
          </h2>
          
          <div className="w-8 h-8 flex items-center justify-center" />
        </div>

        {/* Center Main Dice Box */}
        <div className="w-full max-w-[340px] mx-auto bg-black/60 rounded-2xl p-4 border border-[#ec4899]/30 shrink-0 shadow-[0_0_40px_rgba(236,72,153,0.15)] relative overflow-hidden my-auto flex flex-col items-center select-none">
          
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
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-[9.5px] text-zinc-300 leading-normal border-t border-[#ec4899]/20 pt-2 mt-1 text-left overflow-y-auto max-h-[120px] scrollbar-none"
                    >
                      <div className="flex items-center gap-1 text-[#ec4899] font-black uppercase text-[7.5px] tracking-wider mb-1 select-none">
                        <ShieldAlert size={10} /> Análise Terapêutica
                      </div>
                      <p className="font-medium text-zinc-400">{insight}</p>
                    </motion.div>

                    <button
                      onClick={() => {
                        casinoAudio.playTick()
                        setScreenMessage(null)
                        setInsight(null)
                      }}
                      className="mt-3.5 px-5 py-2 bg-[#ec4899] hover:bg-[#f472b6] text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-lg active:scale-95 z-50 border-none"
                    >
                      ENTENDI E CONTINUAR
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dice Result Display */}
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Resultado do Dado</div>
          
          <div className="relative w-48 h-28 bg-[#111] rounded-2xl border-2 border-white/10 flex items-center justify-center shadow-inner overflow-hidden mb-5">
            <div 
              className={cn(
                "font-display font-black text-6xl drop-shadow-md transition-colors duration-300 select-none",
                resultColor === 'white' && "text-white text-glow-pink",
                resultColor === 'green' && "text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]",
                resultColor === 'red' && "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]"
              )}
            >
              {rollResult}
            </div>
          </div>

          {/* Visual Custom Slider Layout */}
          <div className="w-full relative px-2 mb-2">
            <div className="flex justify-between text-[10px] font-bold text-white/50 mb-2 font-display tracking-wider">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
            
            {/* Visual double-color track bar */}
            <div className="absolute top-6 left-2 right-2 h-3 bg-red-950/80 border border-red-500/20 rounded-full pointer-events-none overflow-hidden">
              <div 
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-100 ease-out" 
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Invisible native range slider for native interaction */}
            <input 
              type="range" 
              min="2" 
              max="98" 
              disabled={rolling}
              value={targetNumber} 
              onChange={(e) => setTargetNumber(parseInt(e.target.value))}
              className="w-full h-3 absolute top-6 left-0 opacity-0 cursor-pointer z-10"
            />
            
            {/* Dynamic visual slider thumb */}
            <div 
              className="absolute top-4 w-7 h-7 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none flex items-center justify-center border-4 border-zinc-950 transition-all duration-100 ease-out z-20" 
              style={{ left: `calc(${percent}% + (${14 - percent * 0.28}px))`, transform: 'translateX(-50%)' }}
            >
              <ChevronsLeftRight className="w-3.5 h-3.5 text-zinc-950 stroke-[3]" />
            </div>
          </div>

          {/* Dynamic Stats Indicators Panel */}
          <div className="w-full grid grid-cols-3 gap-2 items-center mt-6 bg-[#111] p-3 rounded-xl border border-white/5">
            <div className="text-center border-r border-white/10">
              <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Rolar Abaixo de</div>
              <div className="font-display font-bold text-lg text-white">{targetNumber.toFixed(2)}</div>
            </div>
            <div className="text-center border-r border-white/10">
              <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Chance de Ganhar</div>
              <div className="font-display font-bold text-lg text-[#ec4899]">{chance.toFixed(2)}%</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Multiplicador</div>
              <div className="font-display font-bold text-lg text-[#fbbf24]">{multiplier.toFixed(2)}x</div>
            </div>
          </div>

        </div>

        {/* Bottom Controls Panel */}
        <div className="w-full bg-black/50 border border-[#ec4899]/25 rounded-xl p-3 flex flex-col gap-3 shrink-0 shadow-2xl relative z-20">
          
          <div className="flex gap-2">
            {/* Bet Input */}
            <div className="flex-1">
              <label className="text-[8px] font-black text-[#ec4899] uppercase tracking-widest block mb-1 pl-1">Aposta</label>
              <div className="bg-black/40 border border-[#ec4899]/30 rounded-lg flex items-center h-9">
                <button 
                  onClick={handleMinus}
                  disabled={rolling}
                  className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-l-lg transition-colors active:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 flex items-center justify-center h-full border-x border-[#ec4899]/30">
                  <span className="text-[#fbbf24] font-black text-[10px] mr-1">R$</span>
                  <input 
                    type="number" 
                    value={bet.toFixed(2)} 
                    onChange={handleBetChange}
                    disabled={rolling}
                    step="1.00" 
                    min="1.00" 
                    className="bg-transparent text-white font-black w-14 text-center focus:outline-none text-xs p-0 appearance-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <button 
                  onClick={handlePlus}
                  disabled={rolling}
                  className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-r-lg transition-colors active:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Return Payout indicator */}
            <div className="w-[110px] flex flex-col justify-center items-center bg-black/40 rounded-lg border border-[#ec4899]/30 select-none">
              <span className="text-[7px] font-black text-[#ec4899] uppercase tracking-widest mb-0.5">Retorno Estimado</span>
              <span className="font-display font-black text-xs text-[#f472b6] leading-none">
                R$ {(bet * multiplier).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Action Action play button */}
          <button 
            onClick={handleRoll}
            disabled={rolling}
            className={cn(
              "w-full h-11 font-display font-black uppercase rounded-lg transition-all text-xs tracking-widest flex items-center justify-center cursor-pointer border-none shadow-xl",
              rolling
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed animate-pulse"
                : "bg-[#ec4899] hover:bg-[#f472b6] text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-[1.01]"
            )}
          >
            {rolling ? 'ROLANDO...' : 'ROLAR DADO'}
          </button>

        </div>
      </Card>
    </LossShake>
  )
}
