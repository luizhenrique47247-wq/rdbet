import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Brain, Award } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { TriggerForm } from '../components/missions/TriggerForm'
import { MissionCard } from '../components/missions/MissionCard'
import { casinoAudio } from '../utils/audioEngine'
import { CoinShower } from '../components/animations/CoinShower'

export const Missoes: React.FC = () => {
  const { 
    level, 
    xp, 
    missions, 
    completeMission, 
    checkedIn, 
    performCheckIn 
  } = useStore()

  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })

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

  return (
    <div className="space-y-6 text-left relative">
      {/* Screen Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/20 border border-neon-green/30 flex items-center justify-center text-neon-green glow-green">
            {/* Custom concentric target circles */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider font-display">
            MISSÕES
          </h2>
        </div>

        {/* Yellow XP Badge */}
        <div className="flex items-center gap-1 bg-[#12161a] border border-cyber-border rounded-lg px-3.5 py-1.5 text-xs font-black text-white tracking-wide uppercase select-none">
          <span className="text-[#ffe600] text-sm leading-none mr-0.5">⚡</span>
          <span className="text-[#ffe600] font-black mr-0.5">{xp + 300}</span>
          <span className="text-zinc-400 font-extrabold">XP</span>
        </div>
      </div>

      {/* Level XP Card */}
      <Card className="p-5 border-neon-green/20 bg-[#12161a] relative overflow-hidden">
        {/* Faint Medal outline decoration */}
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
            Ganhe banca virtual e XP completando as tarefas diárias.
          </h3>
        </div>

        {/* Solid green progress bar */}
        <div className="z-10 relative">
          <ProgressBar value={xp} variant="green" height="sm" />
        </div>
      </Card>

      {/* Sobriedade Check-in Card */}
      <Card className="p-5 border-neon-green/20 relative overflow-hidden bg-[#12161a] flex flex-col gap-4">
        {/* Top right bonus tag */}
        <div className="absolute top-0 right-0 bg-[#00ff3c] text-black font-black text-[8px] tracking-widest px-3 py-1.5 uppercase rounded-bl-lg select-none">
          BÔNUS DIÁRIO
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
              Estou 24h sem realizar depósitos reais.
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckInClaim}
          disabled={checkedIn}
          className="w-full py-3.5 bg-neon-green hover:bg-neon-green-glow disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[0_4px_15px_rgba(0,255,60,0.2)] disabled:shadow-none"
        >
          {checkedIn ? 'BÔNUS DIÁRIO RESGATADO' : 'RESGATAR R$ 10,00'}
        </button>
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

      {/* Trigger Form / Mapeamento Card */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Brain size={16} className="text-neon-green" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Mapeamento do Momento
          </span>
        </div>
        
        <TriggerForm />
      </div>

      {/* Checklist Tasks List */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          TAREFAS DISPONÍVEIS
        </h3>

        <div className="space-y-2.5">
          {missions.map((mission) => (
            <MissionCard 
              key={mission.id}
              mission={mission}
              onComplete={(id) => {
                casinoAudio.playTick()
                completeMission(id)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
