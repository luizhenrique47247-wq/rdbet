import React, { useState, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { Bomb, Gem, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'
import { casinoAudio } from '../../utils/audioEngine'
import { CoinShower } from '../animations/CoinShower'
import { Confetti } from '../ui/Confetti'
import { LossShake } from '../animations/LossShake'

export const MinesGame: React.FC = () => {
  const { spendBalance, addBalance, incrementSimulatedStats } = useStore()
  const [board, setBoard] = useState<{ id: number; revealed: boolean; isMine: boolean }[]>([])
  const [gameActive, setGameActive] = useState(false)
  const [multiplier, setMultiplier] = useState(1.0)
  const [revealedCount, setRevealedCount] = useState(0)
  const [insight, setInsight] = useState<string | null>(null)
  
  const [isLoss, setIsLoss] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })

  const minePositionsRef = useRef<number[]>([])

  const initializeGame = () => {
    const cost = 100
    if (!spendBalance(cost)) {
      casinoAudio.playWarning()
      alert("Saldo de moedas insuficiente!")
      return
    }

    casinoAudio.playTick()
    setInsight(null)
    setIsLoss(false)
    setShowConfetti(false)
    incrementSimulatedStats(cost, 40)

    const mines: number[] = []
    while (mines.length < 5) {
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
  }

  const handleCellClick = (id: number) => {
    if (!gameActive) return
    if (board[id].revealed) return

    const cell = board[id]
    const updatedBoard = board.map(c => c.id === id ? { ...c, revealed: true } : c)
    setBoard(updatedBoard)

    if (cell.isMine) {
      casinoAudio.playLossSweep()
      setIsLoss(true)
      setGameActive(false)
      setBoard(updatedBoard.map(c => c.isMine ? { ...c, revealed: true } : c))
      setInsight(
        "💥 COMPULSÃO DO 'SÓ MAIS UM': Você acertou um Gatilho (bomba) e perdeu seu acumulador! O Mines explora a ganância em cascata. Cada acerto aumenta o multiplicador e injeta dopamina, fazendo você ignorar o risco estatístico crescente de explodir. Casas de aposta utilizam isso para fazer com que o usuário se sinta invencível até que, estatisticamente, o desastre aconteça."
      )
    } else {
      casinoAudio.playCoinChime()
      const nextCount = revealedCount + 1
      setRevealedCount(nextCount)
      
      const nextMult = parseFloat((1.0 + nextCount * 0.25).toFixed(2))
      setMultiplier(nextMult)
      
      if (nextCount === 20) {
        casinoAudio.playWinMelody()
        setGameActive(false)
        setShowConfetti(true)
        addBalance(Math.round(100 * nextMult))
        setInsight(
          "🏆 INCRÍVEL! Você limpou a maior parte da área de risco. Porém, a probabilidade de chegar a esse ponto sem explodir é menor que 3%. Não confunda uma sorte pontual simulada com consistência de lucros. No longo prazo, a matemática do cassino é blindada."
        )
      }
    }
  }

  const handleCashout = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameActive) return
    casinoAudio.playWinMelody()
    setGameActive(false)
    setShowConfetti(true)

    // Add winning payout to balance
    const winAmount = Math.round(100 * multiplier)
    addBalance(winAmount)

    // Trigger coin shower
    setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
    setShowerTrigger(true)

    setInsight(
      `🎉 RETIRADO COM SUCESSO! Você garantiu ${multiplier}x de retorno virtual. Note como cada clique no tabuleiro causava uma mini oscilação de nervosismo e expectativa no cérebro. Esse ciclo é o motor do vício em apostas. Vencer com sucesso hoje não altera a desvantagem matemática da próxima simulação.`
    )
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
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Mines da Compulsão</h3>
          <p className="text-[10px] text-zinc-400">Custo da rodada: 100 moedas fictícias | 5 Bombas Ocultas</p>
        </div>

        {!gameActive && board.length === 0 ? (
          <Button
            onClick={initializeGame}
            variant="primary"
            glow
            className="w-full py-4 relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] animate-shimmer" />
            <span className="relative z-10">COMEÇAR JOGO DE MINAS</span>
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2 max-w-[260px] mx-auto">
              {board.map((cell) => (
                <button
                  key={cell.id}
                  onClick={() => handleCellClick(cell.id)}
                  disabled={!gameActive && !cell.revealed}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border transition-all cursor-pointer",
                    cell.revealed
                      ? cell.isMine
                        ? 'bg-red-950 border-red-500 text-red-500 shadow-md shadow-red-500/20'
                        : 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-inner'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  )}
                >
                  {cell.revealed ? (
                    cell.isMine ? <Bomb size={16} /> : <Gem size={16} className="text-glow-green" />
                  ) : (
                    '?'
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              {gameActive && (
                <Button
                  onClick={handleCashout}
                  variant="danger"
                  glow
                  className="w-full"
                >
                  RETIRAR ({multiplier}x)
                </Button>
              )}
              {!gameActive && (
                <Button
                  onClick={initializeGame}
                  variant="primary"
                  glow
                  className="w-full"
                >
                  RECOMEÇAR
                </Button>
              )}
            </div>
          </div>
        )}

        {insight && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 leading-relaxed space-y-2 border-l-2 border-l-purple-400"
          >
            <div className="flex items-center gap-1.5 text-purple-400 font-bold">
              <ShieldAlert size={14} />
              <Badge variant="blue" glow>Mecanismo Psicológico</Badge>
            </div>
            <p>{insight}</p>
          </motion.div>
        )}
      </Card>
    </LossShake>
  )
}
