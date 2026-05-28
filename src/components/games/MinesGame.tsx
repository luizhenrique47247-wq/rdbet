import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { Bomb, Gem, ShieldAlert, Minus, Plus, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'
import { casinoAudio } from '../../utils/audioEngine'
import { CoinShower } from '../animations/CoinShower'
import { Confetti } from '../ui/Confetti'
import { LossShake } from '../animations/LossShake'
import { CognitiveOverlay } from '../ui/CognitiveOverlay'

// Helper function to calculate combinations (n choose k)
const choose = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0
  if (k === 0 || k === n) return 1
  if (k > n / 2) k = n - k
  let res = 1
  for (let i = 1; i <= k; i++) {
    res = res * (n - i + 1) / i
  }
  return res
}

const calculateMinesMultiplier = (mines: number, revealed: number) => {
  if (revealed === 0) return 1.0
  const totalCells = 25
  const waysTotal = choose(totalCells, revealed)
  const waysSafe = choose(totalCells - mines, revealed)
  if (waysSafe === 0) return 1.0
  // Cassino margin of 3%
  const mult = 0.97 * (waysTotal / waysSafe)
  return Math.max(1.0, parseFloat(mult.toFixed(2)))
}

export const MinesGame: React.FC = () => {
  const { spendBalance, addBalance, incrementSimulatedStats, incrementBetsCount, balance, setActiveGame } = useStore()
  
  const [bet, setBet] = useState(5.00)
  const [minesCount, setMinesCount] = useState(5)
  const [board, setBoard] = useState<{ id: number; revealed: boolean; isMine: boolean }[]>([])
  const [gameActive, setGameActive] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [multiplier, setMultiplier] = useState(1.0)
  const [revealedCount, setRevealedCount] = useState(0)
  const [insight, setInsight] = useState<string | null>(null)
  
  const [isLoss, setIsLoss] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })
  const [screenMessage, setScreenMessage] = useState<{ text: string; colorClass: string; duration: number } | null>({
    text: "PREPARANDO",
    colorClass: "text-[#facc15]/50 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]",
    duration: 0
  })

  // Interruption overlay states
  const [accumulatedSpent, setAccumulatedSpent] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayAmount, setOverlayAmount] = useState(0)

  const minePositionsRef = useRef<number[]>([])
  const timeoutRef = useRef<any>(null)

  // Auto-hide screen messages (if duration is set)
  useEffect(() => {
    if (screenMessage && screenMessage.duration > 0) {
      const t = setTimeout(() => {
        setScreenMessage(null)
      }, screenMessage.duration)
      return () => clearTimeout(t)
    }
  }, [screenMessage])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleMinus = () => {
    if (gameActive || spinning) return
    casinoAudio.playTick()
    setBet(prev => prev > 5 ? prev - 5 : 1)
  }

  const handlePlus = () => {
    if (gameActive || spinning) return
    casinoAudio.playTick()
    setBet(prev => prev < 5 ? 5 : prev + 5)
  }

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameActive || spinning) return
    const val = parseFloat(e.target.value) || 1
    setBet(val)
  }

  const handleMinesMinus = () => {
    if (gameActive || spinning) return
    casinoAudio.playTick()
    setMinesCount(prev => prev > 5 ? prev - 1 : 5)
  }

  const handleMinesPlus = () => {
    if (gameActive || spinning) return
    casinoAudio.playTick()
    setMinesCount(prev => prev < 10 ? prev + 1 : 10)
  }

  const handleStartGame = () => {
    if (gameActive || spinning) return
    const cost = bet
    if (cost > balance) {
      casinoAudio.playWarning()
      alert("Saldo insuficiente na banca virtual!")
      return
    }

    casinoAudio.playTick()
    setInsight(null)
    setIsLoss(false)
    setShowConfetti(false)
    
    // Set loading / preparing state
    setSpinning(true)
    setScreenMessage({
      text: "PREPARANDO",
      colorClass: "text-[#facc15] drop-shadow-[0_0_20px_rgba(250,204,21,0.85)] animate-pulse",
      duration: 0
    })

    // Deduct bet from balance
    spendBalance(cost)

    // Simulate 1.2s delay for "preparando" before allowing play
    timeoutRef.current = setTimeout(() => {
      // Generate Mine positions randomly
      const mines: number[] = []
      while (mines.length < minesCount) {
        const pos = Math.floor(Math.random() * 25)
        if (!mines.includes(pos)) {
          mines.push(pos)
        }
      }
      minePositionsRef.current = mines

      const initialBoard = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        revealed: false,
        isMine: mines.includes(i)
      }))

      setBoard(initialBoard)
      setGameActive(true)
      setMultiplier(1.0)
      setRevealedCount(0)
      setScreenMessage(null)
      setSpinning(false)
    }, 1200)
  }

  const triggerInterruption = (costSpent: number) => {
    incrementBetsCount()
    const newAccumulated = accumulatedSpent + costSpent
    if (newAccumulated >= 150) {
      setOverlayAmount(newAccumulated)
      setAccumulatedSpent(0)
      setTimeout(() => {
        setOverlayOpen(true)
      }, 1500)
    } else {
      setAccumulatedSpent(newAccumulated)
    }
  }

  const handleCellClick = (id: number) => {
    if (!gameActive || spinning) return
    if (board[id].revealed) return

    const cell = board[id]
    const updatedBoard = board.map(c => c.id === id ? { ...c, revealed: true } : c)
    setBoard(updatedBoard)

    if (cell.isMine) {
      casinoAudio.playLossSweep()
      setIsLoss(true)
      setGameActive(false)
      // Reveal all cells containing mines
      setBoard(updatedBoard.map(c => c.isMine ? { ...c, revealed: true } : c))
      
      setScreenMessage({
        text: "EXPLODIU!",
        colorClass: "text-red-500 drop-shadow-[0_0_20px_rgba(255,51,51,0.85)]",
        duration: 0
      })

      setInsight(
        `💥 COMPULSÃO DO 'SÓ MAIS UM CLIQUE': Você clicou em uma bomba oculta e perdeu R$ ${bet.toFixed(2).replace('.', ',')} fictícios! Cada acerto aumenta o multiplicador e injeta dopamina, fazendo você subestimar o risco crescente de explodir. Cassinos desenham essa oscilação de risco especificamente para te prender no jogo.`
      )

      incrementSimulatedStats(bet, 20)
      triggerInterruption(bet)
    } else {
      casinoAudio.playCoinChime()
      const nextCount = revealedCount + 1
      setRevealedCount(nextCount)
      
      const nextMult = calculateMinesMultiplier(minesCount, nextCount)
      setMultiplier(nextMult)
      
      // Check if all safe cells are revealed
      const totalSafeCells = 25 - minesCount
      if (nextCount === totalSafeCells) {
        casinoAudio.playWinMelody()
        setGameActive(false)
        setShowConfetti(true)
        
        const payout = bet * nextMult
        addBalance(payout)

        setScreenMessage({
          text: "VITÓRIA!",
          colorClass: "text-[#facc15] drop-shadow-[0_0_20px_rgba(250,204,21,0.85)]",
          duration: 0
        })

        setInsight(
          `🏆 LIMPOU O CAMPO! Você revelou todos os diamantes sem explodir! Note que a chance matemática de sucesso total com ${minesCount} minas é extremamente pequena. Não confunda a sorte pontual do simulador com ganhos consistentes.`
        )

        triggerInterruption(bet)
      }
    }
  }

  const handleCashout = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameActive || revealedCount === 0 || spinning) return
    casinoAudio.playWinMelody()
    setGameActive(false)
    setShowConfetti(true)

    const winAmount = bet * multiplier
    addBalance(winAmount)

    // Trigger coin shower
    setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
    setShowerTrigger(true)

    setScreenMessage({
      text: "LUCRO!",
      colorClass: "text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.85)]",
      duration: 0
    })

    setInsight(
      `🎉 RETIRADO COM SUCESSO! Você garantiu ${multiplier.toFixed(2)}x de retorno virtual (R$ ${winAmount.toFixed(2).replace('.', ',')}). Cada clique no tabuleiro gera um microciclo de estresse e dopamina. Identificar essa oscilação emocional é o primeiro passo para o autocontrole.`
    )

    triggerInterruption(bet)
  }

  // Generate a fake blank board for rendering background when game is not yet started
  const displayBoard = board.length === 25 ? board : Array.from({ length: 25 }, (_, i) => ({
    id: i,
    revealed: false,
    isMine: false
  }))

  return (
    <LossShake isLoss={isLoss} className="h-full flex flex-col">
      <Card className="p-5 flex flex-col justify-between flex-1 relative overflow-hidden bg-gradient-to-b from-[#181502] via-[#0b0a01] to-[#040400] border border-[#facc15]/25 shadow-[0_0_40px_rgba(250,204,21,0.1)] rounded-2xl">
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
          
          <h2 className="font-display font-black text-xl uppercase text-[#facc15] flex items-center gap-2 select-none">
            <Bomb className="w-5 h-5 fill-current text-[#facc15]" /> Mines RD
          </h2>
          
          <div className="w-8 h-8 flex items-center justify-center" />
        </div>

        {/* Grid Mines Box */}
        <div className="w-full max-w-[320px] mx-auto bg-black/60 rounded-2xl p-4 border border-[#facc15]/30 shrink-0 shadow-[0_0_40px_rgba(250,204,21,0.15)] relative overflow-hidden my-auto">
          
          {/* Result Message Overlay */}
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
                  className={cn("font-display font-black text-2xl uppercase tracking-widest mb-2", screenMessage.colorClass)}
                >
                  {screenMessage.text}
                </motion.div>

                {insight && screenMessage.text !== "PREPARANDO" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-[9.5px] text-zinc-300 leading-normal border-t border-[#facc15]/20 pt-2 mt-1 text-left overflow-y-auto max-h-[140px] scrollbar-none"
                  >
                    <div className="flex items-center gap-1 text-[#facc15] font-black uppercase text-[7px] tracking-wider mb-1 select-none">
                      <ShieldAlert size={10} /> Análise Terapêutica
                    </div>
                    <p className="font-medium text-zinc-400">{insight}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid Cells */}
          <div className="grid grid-cols-5 gap-2 select-none relative z-10">
            {displayBoard.map((cell) => (
              <button
                key={cell.id}
                onClick={() => handleCellClick(cell.id)}
                disabled={!gameActive || cell.revealed || spinning}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center transition-all duration-150 border cursor-pointer",
                  cell.revealed
                    ? cell.isMine
                      ? 'bg-red-950/80 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'bg-[#facc15]/10 border-[#facc15]/50 text-[#facc15] shadow-[inset_0_0_10px_rgba(250,204,21,0.2)]'
                    : 'bg-black/40 border-[#facc15]/20 text-zinc-500 hover:border-[#facc15]/60 hover:bg-[#facc15]/5 hover:scale-105 active:scale-95'
                )}
              >
                {cell.revealed ? (
                  cell.isMine ? (
                    <Bomb className="w-5 h-5 animate-bounce" />
                  ) : (
                    <Gem className="w-5 h-5 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] text-[#facc15]" />
                  )
                ) : (
                  <span className="text-[10px] font-black text-[#facc15]/20 hover:text-[#facc15]/60 transition-colors">
                    ?
                  </span>
                )}
              </button>
            ))}
          </div>

        </div>

        {/* Control Box */}
        <div className="w-full bg-black/50 border border-[#facc15]/25 rounded-xl p-3 flex flex-col gap-3 shrink-0 shadow-2xl relative z-20">
          
          <div className="flex gap-2">
            {/* Bet Input */}
            <div className="flex-1">
              <label className="text-[8px] font-black text-[#facc15] uppercase tracking-widest block mb-1 pl-1">Aposta</label>
              <div className="bg-black/40 border border-[#facc15]/30 rounded-lg flex items-center h-9">
                <button 
                  onClick={handleMinus}
                  disabled={gameActive || spinning}
                  className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-l-lg transition-colors active:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 flex items-center justify-center h-full border-x border-[#facc15]/30">
                  <span className="text-[#facc15] font-black text-[10px] mr-1">R$</span>
                  <input 
                    type="number" 
                    value={bet.toFixed(2)} 
                    onChange={handleBetChange}
                    disabled={gameActive || spinning}
                    step="1.00" 
                    min="1.00" 
                    className="bg-transparent text-white font-black w-14 text-center focus:outline-none text-xs p-0 appearance-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <button 
                  onClick={handlePlus}
                  disabled={gameActive || spinning}
                  className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-r-lg transition-colors active:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mines Count selector */}
            <div className="w-[95px]">
              <label className="text-[8px] font-black text-[#facc15] uppercase tracking-widest block mb-1 pl-1">Minas</label>
              <div className="bg-black/40 border border-[#facc15]/30 rounded-lg flex items-center h-9 justify-between px-1.5">
                <button 
                  onClick={handleMinesMinus}
                  disabled={gameActive || spinning}
                  className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-md transition-colors active:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-white font-black text-xs select-none">{minesCount}</span>
                <button 
                  onClick={handleMinesPlus}
                  disabled={gameActive || spinning}
                  className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-md transition-colors active:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-stretch h-11">
            {/* Return Potential payout display */}
            <div className="w-[110px] flex flex-col justify-center items-center bg-black/40 rounded-lg border border-[#facc15]/30">
              <span className="text-[7px] font-black text-[#facc15] uppercase tracking-widest mb-0.5">Retorno</span>
              <span className="font-display font-black text-xs text-[#facc15] leading-none select-none">
                {gameActive && revealedCount > 0 ? `R$ ${(bet * multiplier).toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
              </span>
            </div>

            {/* Action Play / Cashout button */}
            {gameActive ? (
              <button 
                onClick={handleCashout}
                disabled={revealedCount === 0 || spinning}
                className={cn(
                  "flex-1 font-display font-black uppercase rounded-lg transition-all text-xs tracking-widest flex items-center justify-center cursor-pointer border-none shadow-xl",
                  revealedCount === 0
                    ? "bg-zinc-950/60 text-zinc-500 cursor-not-allowed border border-zinc-800/40"
                    : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.01]"
                )}
              >
                {revealedCount === 0 ? 'CLIQUE NO TABULEIRO' : `RETIRAR R$ ${(bet * multiplier).toFixed(2).replace('.', ',')}`}
              </button>
            ) : (
              <button 
                onClick={handleStartGame}
                disabled={spinning}
                className="flex-1 bg-[#facc15] hover:bg-[#fde047] text-black font-display font-black uppercase rounded-lg shadow-[0_0_20px_rgba(250,204,21,0.35)] hover:scale-[1.01] transition-all text-xs tracking-widest flex items-center justify-center cursor-pointer border-none"
              >
                {spinning ? 'PREPARANDO...' : 'INICIAR RODADA'}
              </button>
            )}
          </div>

        </div>
      </Card>
    </LossShake>
  )
}
