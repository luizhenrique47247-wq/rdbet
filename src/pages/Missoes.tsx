import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Brain, Award, CheckCircle, Target, Circle, Clock, Play, Smile, Gift, Lock, Unlock } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { casinoAudio } from '../utils/audioEngine'
import { CoinShower } from '../components/animations/CoinShower'
import { cn } from '../utils/cn'
import { getDailyContent } from '../utils/dailyContents'

export const Missoes: React.FC = () => {
  const { 
    level, 
    xp, 
    checkedIn, 
    performCheckIn,
    setMentalMappingOpen,
    mappingAntesCompleted,
    mappingDuranteCompleted,
    mappingDepoisCompleted,
    setMappingStage,
    claimMappingReward,
    dailyMappingCompletedDate,
    checkAndResetDailyMapping,
    simulatedDay,
    contentStatus,
    contentTimer,
    startContentCooldown,
    claimContentReward
  } = useStore()

  // Reset daily mapping state if the calendar day has changed
  useEffect(() => {
    checkAndResetDailyMapping()
  }, [checkAndResetDailyMapping])

  const isDailyMappingClaimed = dailyMappingCompletedDate === new Date().toLocaleDateString()

  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })

  const dailyContent = getDailyContent(simulatedDay)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartContent = (url: string, duration: number) => {
    window.open(url, '_blank')
    casinoAudio.playTick()
    startContentCooldown(duration)
  }

  const handleClaimContent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    casinoAudio.playWinMelody()

    setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
    setShowerTrigger(true)

    claimContentReward()
  }

  // Claim check-in bonus
  const handleCheckInClaim = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (checkedIn) return
    
    // Play win sound
    casinoAudio.playWinMelody()
    
    // Trigger coin shower
    setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
    setShowerTrigger(true)
    
    performCheckIn()
  }

  const handleStartStage = (stage: 'antes' | 'durante' | 'depois') => {
    casinoAudio.playTick()
    setMappingStage(stage)
    setMentalMappingOpen(true)
  }

  const handleClaimMappingReward = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    casinoAudio.playWinMelody()

    setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
    setShowerTrigger(true)

    claimMappingReward()
  }

  const allStagesCompleted = mappingAntesCompleted && mappingDuranteCompleted && mappingDepoisCompleted

  return (
    <div className="space-y-6 text-left relative">
      {/* Screen Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/20 border border-neon-green/30 flex items-center justify-center text-neon-green glow-green">
            <Target size={20} className="stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider font-display">
            CENTRAL FREE COINS
          </h2>
        </div>

        {/* Yellow XP Badge */}
        <div className="flex items-center gap-1 bg-[#12161a] border border-cyber-border rounded-lg px-3.5 py-1.5 text-xs font-black text-white tracking-wide uppercase select-none">
          <span className="text-[#ffe600] text-sm leading-none mr-0.5">⚡</span>
          <span className="text-[#ffe600] font-black mr-0.5">{xp}</span>
          <span className="text-zinc-400 font-extrabold">XP</span>
        </div>
      </div>

      {/* Level XP Card */}
      <Card className="p-5 border-neon-green/20 bg-[#12161a] relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neon-green/5 pointer-events-none opacity-40">
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
          </svg>
        </div>

        <div className="space-y-1 mb-4 z-10 relative">
          <span className="text-[10px] text-neon-green font-black uppercase tracking-wider block">
            NÍVEL {level}: GUARDIÃO
          </span>
          <h3 className="text-sm font-black text-white leading-relaxed">
            Sua banca virtual diária de R$ 50,00 agora é creditada de forma 100% automática ao virar do dia!
          </h3>
        </div>

        {/* Solid green progress bar */}
        <div className="z-10 relative">
          <ProgressBar value={xp} variant="green" height="sm" />
        </div>
      </Card>

      {/* Sobriedade Check-in Card (Free Coin) */}
      <Card className="p-5 border-neon-green/20 relative overflow-hidden bg-[#12161a] flex flex-col gap-4">
        <div className="absolute top-0 right-0 bg-[#00ff3c] text-black font-black text-[8px] tracking-widest px-3 py-1.5 uppercase rounded-bl-lg select-none">
          + R$ 10,00 FREE
        </div>

        <div className="flex items-center gap-4 mt-2">
          <div className="w-12 h-12 rounded-full border border-neon-green/30 bg-emerald-950/20 flex items-center justify-center text-neon-green shrink-0 glow-green">
            <Award size={22} className="stroke-[2.2]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-black text-white block">
              Check-in de Sobriedade
            </span>
            <span className="text-[10px] text-zinc-500 block leading-tight">
              Afirme seu compromisso e declare que está 24h sem realizar depósitos reais em casas de aposta.
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckInClaim}
          disabled={checkedIn}
          className="w-full py-3.5 bg-neon-green hover:bg-neon-green-glow disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[0_4px_15px_rgba(0,255,60,0.2)] disabled:shadow-none"
        >
          {checkedIn ? 'CHECK-IN CONCLUÍDO' : 'DECLARAR SOBRIEDADE E RESGATAR R$ 10,00'}
        </button>
      </Card>

      {/* Mapeamento do Momento Layout matching reference photo */}
      <Card className="p-5 border-cyber-border bg-[#12161a]/90 space-y-4">
        {/* Title branding with brain icon */}
        <div className="flex items-center gap-2 select-none border-b border-cyber-border pb-3">
          <Brain className="text-[#00d2ff]" size={22} />
          <h3 className="text-sm font-black text-white uppercase tracking-wider font-display">
            Mapeamento do Momento
          </h3>
        </div>

        {/* 3 stages grid row */}
        <div className="grid grid-cols-3 gap-3">
          {/* ANTES Card */}
          <button
            onClick={() => handleStartStage('antes')}
            disabled={mappingAntesCompleted || isDailyMappingClaimed}
            className={cn(
              "p-4 rounded-xl border flex flex-col items-center text-center justify-between gap-3 transition-all h-36 relative overflow-hidden",
              (mappingAntesCompleted || isDailyMappingClaimed)
                ? "border-neon-green/30 bg-zinc-900/60 cursor-not-allowed" 
                : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 cursor-pointer",
              isDailyMappingClaimed && "opacity-80"
            )}
          >
            {/* Stage status indicator */}
            <div className="flex items-center justify-center">
              {mappingAntesCompleted || isDailyMappingClaimed ? (
                <CheckCircle className="text-neon-green" size={20} />
              ) : (
                <Circle className="text-zinc-600" size={20} />
              )}
            </div>

            {/* Stage Icon */}
            <div className="text-[#00d2ff] opacity-80 my-0.5">
              <Clock size={28} className="stroke-[2]" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#00d2ff] tracking-widest block">ANTES</span>
              <p className="text-[9px] text-zinc-400 font-extrabold leading-tight">O que te levou a abrir o app?</p>
            </div>
          </button>

          {/* DURANTE Card */}
          <button
            onClick={() => handleStartStage('durante')}
            disabled={mappingDuranteCompleted || isDailyMappingClaimed}
            className={cn(
              "p-4 rounded-xl border flex flex-col items-center text-center justify-between gap-3 transition-all h-36 relative overflow-hidden",
              (mappingDuranteCompleted || isDailyMappingClaimed)
                ? "border-neon-green/30 bg-zinc-900/60 cursor-not-allowed" 
                : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 cursor-pointer",
              isDailyMappingClaimed && "opacity-80"
            )}
          >
            <div className="flex items-center justify-center">
              {mappingDuranteCompleted || isDailyMappingClaimed ? (
                <CheckCircle className="text-neon-green" size={20} />
              ) : (
                <Circle className="text-zinc-600" size={20} />
              )}
            </div>

            {/* Stage Icon */}
            <div className="text-[#ffa200] opacity-80 my-0.5">
              <Play size={28} className="stroke-[2] fill-current" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#ffa200] tracking-widest block">DURANTE</span>
              <p className="text-[9px] text-zinc-400 font-extrabold leading-tight">O que está sentindo enquanto joga?</p>
            </div>
          </button>

          {/* DEPOIS Card */}
          <button
            onClick={() => handleStartStage('depois')}
            disabled={mappingDepoisCompleted || isDailyMappingClaimed}
            className={cn(
              "p-4 rounded-xl border flex flex-col items-center text-center justify-between gap-3 transition-all h-36 relative overflow-hidden",
              (mappingDepoisCompleted || isDailyMappingClaimed)
                ? "border-neon-green/30 bg-zinc-900/60 cursor-not-allowed" 
                : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 cursor-pointer",
              isDailyMappingClaimed && "opacity-80"
            )}
          >
            <div className="flex items-center justify-center">
              {mappingDepoisCompleted || isDailyMappingClaimed ? (
                <CheckCircle className="text-neon-green" size={20} />
              ) : (
                <Circle className="text-zinc-600" size={20} />
              )}
            </div>

            {/* Stage Icon */}
            <div className="text-[#56ff00] opacity-80 my-0.5">
              <Smile size={28} className="stroke-[2]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#56ff00] tracking-widest block">DEPOIS</span>
              <p className="text-[9px] text-zinc-400 font-extrabold leading-tight">Como se sente ao Terminar?</p>
            </div>
          </button>
        </div>

        {/* Claim Reward Button */}
        {isDailyMappingClaimed ? (
          <button
            disabled
            className="w-full py-4 bg-zinc-900 border border-neon-green/20 text-neon-green font-black text-xs uppercase tracking-widest rounded-xl cursor-not-allowed text-center select-none flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} /> MAPEAMENTO DIÁRIO CONCLUÍDO (✓)
          </button>
        ) : allStagesCompleted ? (
          <button
            onClick={handleClaimMappingReward}
            className="w-full py-4 bg-neon-green hover:bg-neon-green-glow text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[0_4px_15px_rgba(0,255,60,0.3)] hover:scale-[1.01] animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            RESGATAR RECOMPENSA DE R$ 15,00!
          </button>
        ) : (
          <button
            disabled
            className="w-full py-4 bg-zinc-800 text-zinc-500 font-black text-xs uppercase tracking-widest rounded-xl cursor-not-allowed text-center select-none"
          >
            COMPLETE AS 3 ETAPAS (R$ 15,00)
          </button>
        )}
      </Card>

      {/* Conteúdo Por Créditos Widget */}
      <Card className="p-5 border-cyber-border bg-[#12161a]/90 space-y-4">
        {/* Title branding with gift box icon */}
        <div className="flex items-center gap-2 select-none border-b border-cyber-border pb-3">
          <Gift className="text-[#00ff3c]" size={20} />
          <h3 className="text-sm font-black text-white uppercase tracking-wider font-display flex items-center gap-1.5">
            Conteúdo por Créditos
          </h3>
        </div>

        {/* Single full-width content item */}
        <div>
          {contentStatus === 'unlocked' && (
            <button
              onClick={() => handleStartContent(dailyContent.url, dailyContent.duration)}
              className="w-full p-6 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-neon-green/30 flex flex-col items-center text-center justify-center gap-3 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <Lock className="text-zinc-500 animate-pulse" size={28} />
              <div className="space-y-1">
                <span className="text-sm font-black text-[#00ff3c] uppercase block tracking-wider">
                  CONTEÚDO DIÁRIO
                </span>
                <span className="text-[10px] text-zinc-500 font-extrabold block">
                  Clique para abrir e iniciar estudo
                </span>
                <span className="text-xs text-zinc-400 font-black block mt-1 bg-[#12161a] border border-zinc-800 rounded px-2.5 py-1">
                  (+R$ 25)
                </span>
              </div>
            </button>
          )}

          {contentStatus === 'cooldown' && (
            <div className="w-full p-6 rounded-xl border border-zinc-800 bg-[#0d0f12] flex flex-col items-center text-center justify-center gap-3 relative overflow-hidden select-none">
              <Clock className="text-[#00d2ff] animate-spin" size={28} style={{ animationDuration: '3s' }} />
              <div className="space-y-1 z-10">
                <span className="text-xs font-black text-zinc-400 uppercase block tracking-wider">
                  Estudando conteúdo...
                </span>
                <span className="text-lg font-black text-[#00d2ff] tabular-nums block">
                  {formatTime(contentTimer)}
                </span>
                <span className="text-[9px] text-zinc-600 block">
                  Aguarde para liberar o resgate dos seus créditos virtuais.
                </span>
              </div>
              {/* Subtle background progress bar filling up */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-[#00d2ff]/30 transition-all duration-1000"
                style={{ width: `${(contentTimer / dailyContent.duration) * 100}%` }}
              />
            </div>
          )}

          {contentStatus === 'ready' && (
            <button
              onClick={handleClaimContent}
              className="w-full p-6 rounded-xl border border-neon-green bg-zinc-900/60 flex flex-col items-center text-center justify-center gap-3 transition-all cursor-pointer hover:scale-[1.01] shadow-[0_0_20px_rgba(0,255,60,0.15)] animate-pulse"
            >
              <Unlock className="text-[#00ff3c]" size={28} />
              <div className="space-y-1">
                <span className="text-sm font-black text-[#00ff3c] uppercase block tracking-widest font-display">
                  RESGATAR RECOMPENSA
                </span>
                <span className="text-xs text-white font-black block bg-neon-green/10 border border-[#00ff3c]/30 rounded px-2.5 py-1 mt-1">
                  CLIQUE AQUI PARA RESGATAR R$ 25,00
                </span>
              </div>
            </button>
          )}

          {contentStatus === 'claimed' && (
            <div className="w-full p-6 rounded-xl border border-neon-green/20 bg-zinc-900/30 flex flex-col items-center text-center justify-center gap-3 opacity-80 select-none">
              <CheckCircle className="text-neon-green" size={28} />
              <div className="space-y-1">
                <span className="text-sm font-black text-zinc-500 uppercase block tracking-wider">
                  CONTEÚDO DIÁRIO CONCLUÍDO
                </span>
                <span className="text-xs text-neon-green font-black block mt-1 bg-zinc-950 border border-neon-green/20 rounded px-3 py-1">
                  CRÉDITOS DO DIA ADQUIRIDOS (✓)
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Coin Shower flying animation */}
      <CoinShower
        trigger={showerTrigger}
        startX={showerCoords.x}
        startY={showerCoords.y}
        targetId="header-balance-container"
        onCoinArrived={() => casinoAudio.playCoinChime()}
        onComplete={() => setShowerTrigger(false)}
      />
    </div>
  )
}
