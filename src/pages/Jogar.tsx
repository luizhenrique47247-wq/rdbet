import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Dices, ArrowLeft, Ban, LayoutGrid } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { cn } from '../utils/cn'
import { SlotsGame } from '../components/games/SlotsGame'
import { CrashGame } from '../components/games/CrashGame'
import { RoletaGame } from '../components/games/RoletaGame'
import { DoubleGame } from '../components/games/DoubleGame'
import { MinesGame } from '../components/games/MinesGame'
import { casinoAudio } from '../utils/audioEngine'

type GameType = 'slots' | 'crash' | 'roleta' | 'double' | 'mines' | null

export const Jogar: React.FC = () => {
  const { cooldownActive, cooldownTimeLeft } = useStore()
  const [activeGame, setActiveGame] = useState<GameType>(null)
  const [category, setCategory] = useState<'todos' | 'slots' | 'double' | 'mines'>('todos')

  const formatCooldown = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const selectGame = (game: GameType) => {
    casinoAudio.playTick()
    setActiveGame(game)
  }

  const changeCategory = (cat: 'todos' | 'slots' | 'double' | 'mines') => {
    casinoAudio.playTick()
    setCategory(cat)
  }

  if (cooldownActive) {
    return (
      <div className="bg-zinc-900 border border-red-950/60 rounded-2xl p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-red-950/40 border border-red-500 rounded-full flex items-center justify-center text-red-500 mx-auto glow-red">
          <Ban size={32} />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Acesso Suspenso (Auto-Bloqueio)</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Você ativou voluntariamente o Bloqueio de Impulsividade. Durante este período, as simulações estão trancadas para te dar um tempo de resfriamento do ambiente de jogo.
          </p>
        </div>
        
        <div className="bg-zinc-950 border border-cyber-border rounded-xl p-4">
          <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-1">
            Tempo Restante de Cooldown
          </span>
          <div className="text-3xl font-black text-white tracking-widest tabular-nums text-glow-red">
            {formatCooldown(cooldownTimeLeft)}
          </div>
        </div>

        <p className="text-[10px] text-zinc-500 leading-tight">
          💡 A neurociência demonstra que afastar-se do estímulo por algumas horas reduz o ciclo de compulsão do cérebro. Se o desejo persistir, use o canal CVV (Ligue 188) ou fale com alguém de confiança.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-left">
      <AnimatePresence mode="wait">
        {activeGame === null ? (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Screen Header Title */}
            <div className="flex items-center justify-between pb-2 border-b border-cyber-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/20 border border-neon-green/30 flex items-center justify-center text-neon-green glow-green">
                  <Dices size={18} className="stroke-[2.5]" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider font-display">
                  CASSINO RD
                </h2>
              </div>

              {/* 1.4K Playing badge */}
              <div className="flex items-center gap-1.5 bg-[#12161a] border border-cyber-border rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider select-none">
                <span className="text-neon-green">1.4K</span> <span className="text-white">JOGANDO</span>
              </div>
            </div>

            {/* Horizontal Scroll Carousel */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
              {/* Slots RD Card */}
              <Card className="min-w-[90%] snap-start p-5 bg-[#12161a] border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.06)] relative overflow-hidden flex flex-col justify-between h-40 shrink-0 border-l-2 border-l-purple-500">
                <div className="absolute top-0 right-0 p-3 text-purple-900 opacity-20 translate-x-3 -translate-y-3 pointer-events-none select-none">
                  <span className="text-8xl">🍒</span>
                </div>
                <div className="space-y-1.5 z-10">
                  <span className="bg-[#a855f7] text-white font-black text-[8px] tracking-widest px-2 py-1.5 rounded uppercase select-none">
                    HOT
                  </span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">Slots RD</h3>
                  <p className="text-[10px] text-zinc-400 max-w-[80%] leading-relaxed font-medium">
                    Gire para combinar. Cuidado com o ciclo de dopamina.
                  </p>
                </div>
                <button
                  onClick={() => selectGame('slots')}
                  className="w-28 py-2 bg-white text-black font-black text-[10px] tracking-wider uppercase rounded-lg flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-200 transition-colors shadow-lg z-10"
                >
                  JOGAR <span className="text-[8px] leading-none">▶</span>
                </button>
              </Card>

              {/* Double RD Card */}
              <Card className="min-w-[90%] snap-start p-5 bg-[#12161a] border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.06)] relative overflow-hidden flex flex-col justify-between h-40 shrink-0 border-l-2 border-l-red-500">
                <div className="absolute top-0 right-0 p-3 text-red-900 opacity-20 translate-x-3 -translate-y-3 pointer-events-none select-none">
                  <span className="text-8xl">🔴</span>
                </div>
                <div className="space-y-1.5 z-10">
                  <span className="bg-[#ef4444] text-white font-black text-[8px] tracking-widest px-2 py-1.5 rounded uppercase select-none">
                    CLÁSSICO
                  </span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">Double RD</h3>
                  <p className="text-[10px] text-zinc-400 max-w-[80%] leading-relaxed font-medium">
                    Vermelho, Preto e Branco. A ilusão de padrões no azar.
                  </p>
                </div>
                <button
                  onClick={() => selectGame('double')}
                  className="w-28 py-2 bg-white text-black font-black text-[10px] tracking-wider uppercase rounded-lg flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-200 transition-colors shadow-lg z-10"
                >
                  JOGAR <span className="text-[8px] leading-none">▶</span>
                </button>
              </Card>
            </div>

            {/* Filter categories pills */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none shrink-0 select-none">
              <button
                onClick={() => changeCategory('todos')}
                className={cn(
                  "px-4 py-2 rounded-full font-black text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border",
                  category === 'todos'
                    ? 'bg-neon-green text-black border-neon-green shadow-lg shadow-neon-green/20'
                    : 'bg-[#12161a] border-cyber-border text-zinc-400 hover:border-zinc-700'
                )}
              >
                <LayoutGrid size={12} />
                TODOS
              </button>
              <button
                onClick={() => changeCategory('slots')}
                className={cn(
                  "px-4 py-2 rounded-full font-black text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border",
                  category === 'slots'
                    ? 'bg-[#a855f7]/20 border-[#a855f7]/50 text-[#c084fc]'
                    : 'bg-[#12161a] border-cyber-border text-zinc-400 hover:border-zinc-700'
                )}
              >
                <span className="text-xs leading-none">🍇</span>
                SLOTS
              </button>
              <button
                onClick={() => changeCategory('double')}
                className={cn(
                  "px-4 py-2 rounded-full font-black text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border",
                  category === 'double'
                    ? 'bg-[#ef4444]/20 border-[#ef4444]/50 text-[#f87171]'
                    : 'bg-[#12161a] border-cyber-border text-zinc-400 hover:border-zinc-700'
                )}
              >
                <span className="text-xs leading-none">🎯</span>
                DOUBLE
              </button>
              <button
                onClick={() => changeCategory('mines')}
                className={cn(
                  "px-4 py-2 rounded-full font-black text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border",
                  category === 'mines'
                    ? 'bg-[#f97316]/20 border-[#f97316]/50 text-[#fb923c]'
                    : 'bg-[#12161a] border-cyber-border text-zinc-400 hover:border-zinc-700'
                )}
              >
                <span className="text-xs leading-none">💣</span>
                MINES
              </button>
            </div>

            {/* CATALOGO SECTION */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
                <span className="text-orange-500">🔥</span> CATÁLOGO
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {/* Slots Card in grid */}
                {(category === 'todos' || category === 'slots') && (
                  <button
                    onClick={() => selectGame('slots')}
                    className="aspect-square bg-[#12161a] border border-cyber-border rounded-xl p-3 flex flex-col justify-between items-start text-left cursor-pointer hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all relative overflow-hidden group"
                  >
                    <span className="absolute top-1.5 right-1.5 bg-red-600 text-white font-black text-[6px] tracking-widest px-1 py-0.5 rounded uppercase scale-90 select-none">
                      HOT
                    </span>
                    <span className="text-3xl mt-1 select-none opacity-40 group-hover:opacity-80 transition-opacity">🍒</span>
                    <span className="text-[8px] font-black tracking-widest text-[#c084fc] uppercase leading-none mt-auto block">
                      GIRO RÁPIDO
                    </span>
                  </button>
                )}

                {/* Double Card in grid */}
                {(category === 'todos' || category === 'double') && (
                  <button
                    onClick={() => selectGame('double')}
                    className="aspect-square bg-[#12161a] border border-cyber-border rounded-xl p-3 flex flex-col justify-between items-start text-left cursor-pointer hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all relative overflow-hidden group"
                  >
                    <span className="text-3xl mt-1 select-none opacity-40 group-hover:opacity-80 transition-opacity">🎯</span>
                    <span className="text-[8px] font-black tracking-widest text-[#f87171] uppercase leading-none mt-auto block">
                      CORES
                    </span>
                  </button>
                )}

                {/* Mines Card in grid */}
                {(category === 'todos' || category === 'mines') && (
                  <button
                    onClick={() => selectGame('mines')}
                    className="aspect-square bg-[#12161a] border border-cyber-border rounded-xl p-3 flex flex-col justify-between items-start text-left cursor-pointer hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all relative overflow-hidden group"
                  >
                    <span className="text-3xl mt-1 select-none opacity-40 group-hover:opacity-80 transition-opacity">💣</span>
                    <span className="text-[8px] font-black tracking-widest text-[#fb923c] uppercase leading-none mt-auto block">
                      BOMBAS
                    </span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Back to lobby */}
            <div className="flex items-center justify-between select-none">
              <button
                onClick={() => {
                  casinoAudio.playTick()
                  setActiveGame(null)
                }}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                Lobby
              </button>
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest bg-zinc-900 border border-cyber-border rounded px-2 py-0.5">
                MOEDAS 100% FICTÍCIAS
              </span>
            </div>

            {/* Render simulators */}
            {activeGame === 'slots' && <SlotsGame />}
            {activeGame === 'crash' && <CrashGame />}
            {activeGame === 'roleta' && <RoletaGame />}
            {activeGame === 'double' && <DoubleGame />}
            {activeGame === 'mines' && <MinesGame />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
