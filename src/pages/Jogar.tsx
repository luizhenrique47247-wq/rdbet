import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Dices, Ban, LayoutGrid, HeartPulse } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { cn } from '../utils/cn'
import { SlotsGame } from '../components/games/SlotsGame'
import { RoletaGame } from '../components/games/RoletaGame'
import { DoubleGame } from '../components/games/DoubleGame'
import { MinesGame } from '../components/games/MinesGame'
import { DiceGame } from '../components/games/DiceGame'
import { SaudeMental } from '../components/games/SaudeMental'
import { casinoAudio } from '../utils/audioEngine'
import slotsGridImg from '../assets/slots_grid.jpg'
import doubleGridImg from '../assets/double_grid.jpg'
import minesGridImg from '../assets/mines_grid.jpg'
import roletaGridImg from '../assets/roleta_grid.jpg'

type GameType = 'slots' | 'roleta' | 'double' | 'mines' | 'dice' | 'mental' | null

export const Jogar: React.FC = () => {
  const { cooldownActive, cooldownTimeLeft, simulatedDay, activeGame, setActiveGame } = useStore()
  const [category, setCategory] = useState<'todos' | 'slots' | 'double' | 'mines' | 'dice' | 'mental'>('todos')
  const [activeBannerIndex, setActiveBannerIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const gamesList = ['dice', 'slots', 'double', 'mines', 'roleta'] as const
  const hotGame = gamesList[(simulatedDay - 1) % gamesList.length]

  React.useEffect(() => {
    if (activeGame !== null || isPaused) return
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [activeGame, isPaused])

  const banners = [
    {
      id: 'dice',
      tag: 'NOVO',
      tagBg: 'bg-[#ec4899]',
      title: 'Dice da Ilusão',
      desc: 'Ajuste sua margem de chance e role o dado. Entenda a variância estatística e a ilusão de quase-vitória.',
      borderColor: 'border-[#ec4899]/20',
      borderLeftColor: 'border-l-[#ec4899]',
      shadowColor: 'shadow-[0_0_15px_rgba(236,72,153,0.1)]',
      bgGradient: 'bg-gradient-to-r from-[#12161a] via-[#12161a] to-[#25101a]/40',
      icon: '🎲',
      btnText: 'JOGAR',
      btnBg: 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]',
      gameType: 'dice'
    },
    {
      id: 'slots',
      tag: 'HOT',
      tagBg: 'bg-[#a855f7]',
      title: 'Slots RD',
      desc: 'Gire para combinar os rolos. Cuidado com o ciclo de dopamina rápida e o efeito quase-vitória.',
      borderColor: 'border-[#a855f7]/20',
      borderLeftColor: 'border-l-[#a855f7]',
      shadowColor: 'shadow-[0_0_15px_rgba(168,85,247,0.1)]',
      bgGradient: 'bg-gradient-to-r from-[#12161a] via-[#12161a] to-[#1e102b]/40',
      icon: '🍒',
      btnText: 'JOGAR',
      btnBg: 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]',
      gameType: 'slots'
    },
    {
      id: 'double',
      tag: 'CLÁSSICO',
      tagBg: 'bg-[#ef4444]',
      title: 'Double RD',
      desc: 'Vermelho, Preto e Branco. A falsa ilusão de controle e padrões matemáticos no azar.',
      borderColor: 'border-[#ef4444]/20',
      borderLeftColor: 'border-l-[#ef4444]',
      shadowColor: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]',
      bgGradient: 'bg-gradient-to-r from-[#12161a] via-[#12161a] to-[#2b1010]/40',
      icon: '🎯',
      btnText: 'JOGAR',
      btnBg: 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]',
      gameType: 'double'
    },
    {
      id: 'mines',
      tag: 'ESTRATÉGICO',
      tagBg: 'bg-[#facc15] text-black font-extrabold',
      title: 'Mines RD',
      desc: 'Evite as bombas ocultas para multiplicar. Identifique o perigo de persistir sob a compulsão.',
      borderColor: 'border-[#facc15]/20',
      borderLeftColor: 'border-l-[#facc15]',
      shadowColor: 'shadow-[0_0_15px_rgba(250,204,21,0.1)]',
      bgGradient: 'bg-gradient-to-r from-[#12161a] via-[#12161a] to-[#2b2710]/40',
      icon: '💣',
      btnText: 'JOGAR',
      btnBg: 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]',
      gameType: 'mines'
    },
    {
      id: 'roleta',
      tag: 'IMPULSIVIDADE',
      tagBg: 'bg-[#3b82f6]',
      title: 'Roleta RD',
      desc: 'Gire os multiplicadores. Compreenda a ilusão de perdas disfarçadas de ganhos (LDWs).',
      borderColor: 'border-[#3b82f6]/20',
      borderLeftColor: 'border-l-[#3b82f6]',
      shadowColor: 'shadow-[0_0_15px_rgba(59,130,246,0.1)]',
      bgGradient: 'bg-gradient-to-r from-[#12161a] via-[#12161a] to-[#101b2b]/40',
      icon: '🎡',
      btnText: 'JOGAR',
      btnBg: 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]',
      gameType: 'roleta'
    },
    {
      id: 'mental',
      tag: 'TERAPÊUTICO',
      tagBg: 'bg-[#10b981] animate-pulse',
      title: 'Espaço Saúde Mental',
      desc: 'Exercícios de respiração, diário de gatilhos e quiz premiado de dopamina.',
      borderColor: 'border-[#10b981]/30',
      borderLeftColor: 'border-l-[#10b981]',
      shadowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]',
      bgGradient: 'bg-gradient-to-r from-[#12161a] via-[#12161a] to-[#102b1c]/40',
      icon: 'heartpulse',
      btnText: 'ABRIR ESPAÇO',
      btnBg: 'bg-[#10b981] text-black hover:bg-emerald-400 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.4)]',
      gameType: 'mental'
    }
  ] as const

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

  const changeCategory = (cat: 'todos' | 'slots' | 'double' | 'mines' | 'dice' | 'mental') => {
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
    <div className="h-full flex flex-col space-y-4 text-left">
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

            {/* Auto-rotating sliding Banner Carousel */}
            <div className="relative w-full">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBannerIndex}
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -80 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    {(() => {
                      const banner = banners[activeBannerIndex]
                      const isMental = banner.id === 'mental'
                      
                      // Theme settings mapping
                      const theme = {
                        dice: {
                          color: '#ec4899',
                          bgGrad: 'bg-gradient-to-br from-[#1f0f18]/85 via-[#12161a]/95 to-[#0b0d10]',
                          badgeBg: 'bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/30',
                          btnBg: 'bg-[#ec4899] text-white hover:bg-pink-400 hover:shadow-[0_0_12px_rgba(236,72,153,0.5)]',
                          radialGlow: 'border-l-4 border-l-[#ec4899]'
                        },
                        slots: {
                          color: '#a855f7',
                          bgGrad: 'bg-gradient-to-br from-[#1b0d2b]/85 via-[#12161a]/95 to-[#0b0d10]',
                          badgeBg: 'bg-[#a855f7]/10 text-[#c084fc] border-[#a855f7]/30',
                          btnBg: 'bg-[#a855f7] text-white hover:bg-purple-400 hover:shadow-[0_0_12px_rgba(168,85,247,0.5)]',
                          radialGlow: 'border-l-4 border-l-[#a855f7]'
                        },
                        double: {
                          color: '#ef4444',
                          bgGrad: 'bg-gradient-to-br from-[#2b0d0d]/85 via-[#12161a]/95 to-[#0b0d10]',
                          badgeBg: 'bg-[#ef4444]/10 text-[#f87171] border-[#ef4444]/30',
                          btnBg: 'bg-[#ef4444] text-white hover:bg-red-400 hover:shadow-[0_0_12px_rgba(239,68,68,0.5)]',
                          radialGlow: 'border-l-4 border-l-[#ef4444]'
                        },
                        mines: {
                          color: '#facc15',
                          bgGrad: 'bg-gradient-to-br from-[#2b220d]/85 via-[#12161a]/95 to-[#0b0d10]',
                          badgeBg: 'bg-[#facc15]/10 text-[#facc15] border-[#facc15]/30',
                          btnBg: 'bg-[#facc15] text-black hover:bg-yellow-400 hover:shadow-[0_0_12px_rgba(250,204,21,0.5)]',
                          radialGlow: 'border-l-4 border-l-[#facc15]'
                        },
                        roleta: {
                          color: '#3b82f6',
                          bgGrad: 'bg-gradient-to-br from-[#0d1c2b]/85 via-[#12161a]/95 to-[#0b0d10]',
                          badgeBg: 'bg-[#3b82f6]/10 text-[#60a5fa] border-[#3b82f6]/30',
                          btnBg: 'bg-[#3b82f6] text-white hover:bg-blue-400 hover:shadow-[0_0_12px_rgba(59,130,246,0.5)]',
                          radialGlow: 'border-l-4 border-l-[#3b82f6]'
                        },
                        mental: {
                          color: '#10b981',
                          bgGrad: 'bg-gradient-to-br from-[#0a1d17] via-[#0b0f12] to-[#050809]',
                          badgeBg: 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/40 animate-pulse',
                          btnBg: 'bg-[#10b981] text-black hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse',
                          radialGlow: 'border-none'
                        }
                      }[banner.id as 'dice'|'slots'|'double'|'mines'|'roleta'|'mental']

                      return (
                        <Card 
                          className={cn(
                            "w-full h-full bg-[#12161a] border relative overflow-hidden transition-all duration-300 rounded-2xl",
                            isMental 
                              ? "border-2 border-emerald-500/40 animate-border-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                              : cn("border-cyber-border", theme.radialGlow)
                          )}
                          onClick={() => {
                            setIsPaused(true)
                          }}
                        >
                          {/* Background Grid Pattern */}
                          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

                          {/* Radial Glow Highlight on the right side */}
                          <div 
                            className="absolute right-[-40px] top-[20%] w-[180px] h-[180px] rounded-full filter blur-[40px] opacity-15 pointer-events-none z-0" 
                            style={{ backgroundColor: theme.color }}
                          />

                          {/* Sweep Light Sheen overlay for Saúde Mental (positioned over content at z-20) */}
                          {isMental && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 rounded-2xl">
                              <div className="absolute top-0 bottom-0 w-[40%] bg-gradient-to-r from-transparent via-[#00ff3c]/35 to-transparent -skew-x-12 -left-[60%] animate-sweep" />
                            </div>
                          )}

                          {/* Content Container (Split layout) */}
                          <div className={cn(
                            "w-full h-full flex items-center relative z-10",
                            theme.bgGrad
                          )}>
                            {/* Compensating left spacer for the mental health banner to match other banners' border-l-4 offset */}
                            {isMental && <div className="w-[3px] h-full shrink-0" />}

                            {/* Left Pane: Info Content */}
                            <div className="flex-1 p-5 flex flex-col justify-center select-none text-left min-w-0">
                              <span className={cn(
                                "text-[7.5px] font-black tracking-widest px-2 py-0.5 rounded border uppercase w-fit select-none",
                                theme.badgeBg
                              )}>
                                {banner.tag}
                              </span>
                              <h3 className="text-lg font-black text-white uppercase tracking-wider mt-1.5 leading-none truncate">
                                {isMental ? (
                                  <span className="text-glow-emerald font-black">{banner.title}</span>
                                ) : (
                                  banner.title
                                )}
                              </h3>
                              <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed line-clamp-2 pr-2 font-medium">
                                {banner.desc}
                              </p>
                            </div>

                            {/* Right Pane: Action Bar with Centered Button */}
                            <div className="w-[130px] h-full flex-shrink-0 flex items-center justify-center bg-black/35 border-l border-white/5 relative overflow-hidden">
                              {/* Glowing/watermark icon behind the button */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none select-none z-0">
                                {banner.icon === 'heartpulse' ? (
                                  <HeartPulse size={64} className="stroke-[2] text-[#10b981] animate-heartbeat" />
                                ) : (
                                  <span className="text-5xl filter grayscale brightness-200">{banner.icon}</span>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  selectGame(banner.gameType as GameType)
                                }}
                                className={cn(
                                  "w-[102px] py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest text-center flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 active:scale-95 z-10 border-none",
                                  theme.btnBg
                                )}
                              >
                                {banner.btnText} <span className="text-[7.5px] leading-none">▶</span>
                              </button>
                            </div>
                          </div>
                        </Card>
                      )
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Indicator dots */}
              <div className="flex justify-center gap-2 mt-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsPaused(true)
                      setActiveBannerIndex(idx)
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer",
                      activeBannerIndex === idx 
                        ? (banners[idx].id === 'mental' ? "bg-emerald-500 w-5 glow-emerald" : "bg-neon-green w-5 shadow-[0_0_8px_#00ff3c]") 
                        : "bg-zinc-700 hover:bg-zinc-500"
                    )}
                    aria-label={`Banner ${idx + 1}`}
                  />
                ))}
              </div>
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
                onClick={() => changeCategory('mental')}
                className={cn(
                  "px-4 py-2 rounded-full font-black text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border",
                  category === 'mental'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-[#34d399]'
                    : 'bg-[#12161a] border-cyber-border text-zinc-400 hover:border-zinc-700'
                )}
              >
                <HeartPulse size={12} />
                SAÚDE MENTAL
              </button>
              <button
                onClick={() => changeCategory('dice')}
                className={cn(
                  "px-4 py-2 rounded-full font-black text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border",
                  category === 'dice'
                    ? 'bg-blue-500/20 border-blue-500/50 text-[#60a5fa]'
                    : 'bg-[#12161a] border-cyber-border text-zinc-400 hover:border-zinc-700'
                )}
              >
                <span className="text-xs leading-none">🎲</span>
                DICE
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
                    className="aspect-[3/4] bg-[#12161a] border border-cyber-border rounded-xl flex flex-col justify-between items-start text-left cursor-pointer hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all relative overflow-hidden group"
                  >
                    {/* Card background image */}
                    <img 
                      src={slotsGridImg} 
                      alt="Slots RD" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0" 
                    />
                    
                    {/* Subtle top/bottom shadow overlay to integrate with UI */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 opacity-90 group-hover:opacity-80 transition-opacity z-1" />

                    {hotGame === 'slots' && (
                      <span className="absolute top-1.5 right-1.5 bg-gradient-to-r from-[#ff003c] to-[#ff7700] text-white font-black text-[6.5px] tracking-widest px-2 py-0.5 rounded-full uppercase scale-95 select-none animate-pulse-hot border border-[#ff3300]/50 z-10">
                        🔥 HOT
                      </span>
                    )}

                  </button>
                )}

                {/* Double Card in grid */}
                {(category === 'todos' || category === 'double') && (
                  <button
                    onClick={() => selectGame('double')}
                    className="aspect-[3/4] bg-[#12161a] border border-cyber-border rounded-xl flex flex-col justify-between items-start text-left cursor-pointer hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all relative overflow-hidden group"
                  >
                    {/* Card background image */}
                    <img 
                      src={doubleGridImg} 
                      alt="Double RD" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0" 
                    />
                    
                    {/* Subtle top/bottom shadow overlay to integrate with UI */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 opacity-90 group-hover:opacity-80 transition-opacity z-1" />

                    {hotGame === 'double' && (
                      <span className="absolute top-1.5 right-1.5 bg-gradient-to-r from-[#ff003c] to-[#ff7700] text-white font-black text-[6.5px] tracking-widest px-2 py-0.5 rounded-full uppercase scale-95 select-none animate-pulse-hot border border-[#ff3300]/50 z-10">
                        🔥 HOT
                      </span>
                    )}
                  </button>
                )}

                {/* Mines Card in grid */}
                {(category === 'todos' || category === 'mines') && (
                  <button
                    onClick={() => selectGame('mines')}
                    className="aspect-[3/4] bg-[#12161a] border border-cyber-border rounded-xl flex flex-col justify-between items-start text-left cursor-pointer hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all relative overflow-hidden group"
                  >
                    {/* Card background image */}
                    <img 
                      src={minesGridImg} 
                      alt="Mines RD" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0" 
                    />
                    
                    {/* Subtle top/bottom shadow overlay to integrate with UI */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 opacity-90 group-hover:opacity-80 transition-opacity z-1" />

                    {hotGame === 'mines' && (
                      <span className="absolute top-1.5 right-1.5 bg-gradient-to-r from-[#ff003c] to-[#ff7700] text-white font-black text-[6.5px] tracking-widest px-2 py-0.5 rounded-full uppercase scale-95 select-none animate-pulse-hot border border-[#ff3300]/50 z-10">
                        🔥 HOT
                      </span>
                    )}
                  </button>
                )}

                {/* Roleta Card in grid */}
                {(category === 'todos' || category === 'double') && (
                  <button
                    onClick={() => selectGame('roleta')}
                    className="aspect-[3/4] bg-[#12161a] border border-cyber-border rounded-xl flex flex-col justify-between items-start text-left cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all relative overflow-hidden group"
                  >
                    {/* Card background image */}
                    <img 
                      src={roletaGridImg} 
                      alt="Roleta RD" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0" 
                    />
                    
                    {/* Subtle top/bottom shadow overlay to integrate with UI */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 opacity-90 group-hover:opacity-80 transition-opacity z-1" />

                    {hotGame === 'roleta' && (
                      <span className="absolute top-1.5 right-1.5 bg-gradient-to-r from-[#ff003c] to-[#ff7700] text-white font-black text-[6.5px] tracking-widest px-2 py-0.5 rounded-full uppercase scale-95 select-none animate-pulse-hot border border-[#ff3300]/50 z-10">
                        🔥 HOT
                      </span>
                    )}
                  </button>
                )}

                {/* Dice Card in grid */}
                {(category === 'todos' || category === 'dice') && (
                  <button
                    onClick={() => selectGame('dice')}
                    className="aspect-[3/4] bg-[#12161a] border border-cyber-border rounded-xl p-3 flex flex-col justify-between items-start text-left cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all relative overflow-hidden group"
                  >
                    {hotGame === 'dice' && (
                      <span className="absolute top-1.5 right-1.5 bg-gradient-to-r from-[#ff003c] to-[#ff7700] text-white font-black text-[6.5px] tracking-widest px-2 py-0.5 rounded-full uppercase scale-95 select-none animate-pulse-hot border border-[#ff3300]/50 z-10">
                        🔥 HOT
                      </span>
                    )}
                    <span className="text-3xl mt-1 select-none opacity-40 group-hover:opacity-80 transition-opacity">🎲</span>
                    <span className="text-[8px] font-black tracking-widest text-[#60a5fa] uppercase leading-none mt-auto block">
                      DICE RD
                    </span>
                  </button>
                )}

                {/* Saúde Mental Card in Grid */}
                {(category === 'todos' || category === 'mental') && (
                  <button
                    onClick={() => selectGame('mental')}
                    className="aspect-[3/4] bg-[#12161a] border-2 border-emerald-500/40 animate-border-pulse rounded-xl p-3 flex flex-col justify-between items-start text-left cursor-pointer transition-all relative overflow-hidden group shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                  >
                    {/* Floating SOS Badge */}
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white font-black text-[6px] tracking-widest px-1.5 py-0.5 rounded uppercase select-none animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.7)] z-10">
                      SOS
                    </span>

                    {/* Sweep Light Sheen overlay (positioned over content at z-20) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                      <div className="absolute top-0 bottom-0 w-[40%] bg-gradient-to-r from-transparent via-[#00ff3c]/35 to-transparent -skew-x-12 -left-[60%] animate-sweep" />
                    </div>

                    <HeartPulse size={28} className="mt-1 text-emerald-400 animate-heartbeat drop-shadow-[0_0_10px_rgba(16,185,129,0.85)] z-10" />
                    
                    <span className="text-[8.5px] font-black tracking-widest text-glow-emerald uppercase leading-none mt-auto block z-10">
                      SAÚDE MENTAL
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
            className="flex-1 flex flex-col h-full"
          >
            {/* Render simulators */}
            {activeGame === 'slots' && <SlotsGame onBack={() => setActiveGame(null)} />}
            {activeGame === 'roleta' && <RoletaGame />}
            {activeGame === 'double' && <DoubleGame />}
            {activeGame === 'mines' && <MinesGame />}
            {activeGame === 'dice' && <DiceGame />}
            {activeGame === 'mental' && <SaudeMental />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

