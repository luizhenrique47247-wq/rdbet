import React from 'react'
import { useStore } from '../store/useStore'
import { Calendar, Clock, ShoppingCart, Lightbulb } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { StatsChart } from '../components/extrato/StatsChart'
import { RealityCheck } from '../components/extrato/RealityCheck'
import { TimelineEntry } from '../components/extrato/TimelineEntry'
import { casinoAudio } from '../utils/audioEngine'

export const Extrato: React.FC = () => {
  const { 
    simulatedMoneyLost, 
    realMoneySaved, 
    emotionalDiary, 
    historicalStats 
  } = useStore()

  const handleStatClick = () => {
    casinoAudio.playTick()
  }

  return (
    <div className="space-y-6 text-center">
      {/* Red Session Badge */}
      <div className="relative py-4 px-2 flex flex-col items-center justify-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-black/90 border border-neon-red/20 rounded-full px-4 py-1.5 text-[9px] text-white font-black tracking-widest uppercase select-none">
          <span className="w-2 h-2 rounded-full bg-neon-red animate-pulse shadow-[0_0_8px_rgba(255,51,68,0.8)]" />
          SESSÃO TERAPÊUTICA
        </div>

        {/* Screen Title */}
        <div className="space-y-1.5 z-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-wider leading-none font-display">
            EXTRATO DE <span className="text-neon-red text-glow-red">REALIDADE</span>
          </h1>
          <p className="text-[10px] text-zinc-400 max-w-[85%] mx-auto font-medium leading-relaxed">
            Cada perda virtual é uma vitória na vida real.
          </p>
        </div>
      </div>

      {/* Core Side-by-side Stats Card */}
      <Card 
        onClick={handleStatClick}
        className="p-5 border-neon-red/10 bg-[#12161a] cursor-pointer hover:border-neon-red/20 transition-all"
      >
        <div className="grid grid-cols-2 divide-x divide-cyber-border">
          {/* Lost Simulated */}
          <div className="flex flex-col items-center justify-center p-2 text-center space-y-2">
            <Calendar className="text-neon-red stroke-[2.2]" size={20} />
            <div className="space-y-0.5">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block">
                PERDIDO HOJE
              </span>
              <span className="text-sm font-black text-white tabular-nums tracking-tight">
                <span className="text-neon-red mr-0.5">- R$</span>
                {simulatedMoneyLost.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Saved Real */}
          <div className="flex flex-col items-center justify-center p-2 text-center space-y-2">
            <Clock className="text-neon-red stroke-[2.2]" size={20} />
            <div className="space-y-0.5">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block">
                TOTAL SALVO
              </span>
              <span className="text-sm font-black text-white tabular-nums tracking-tight">
                <span className="text-neon-red mr-0.5">R$</span>
                {realMoneySaved.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Shopping Cart Section */}
      <div className="space-y-3 text-left">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 select-none">
          <ShoppingCart size={18} className="text-zinc-400" />
          O que foi tirado de você:
        </h3>

        {simulatedMoneyLost === 0 ? (
          <div className="border border-dashed border-zinc-800 bg-zinc-950/60 rounded-xl p-8 text-center text-[10px] text-zinc-500 font-black tracking-widest uppercase">
            Seu histórico de simulações aparecerá aqui.
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Reality check values */}
            <RealityCheck moneySaved={realMoneySaved} />
            
            {/* Render the weekly chart details */}
            <StatsChart stats={historicalStats} />
          </div>
        )}
      </div>

      {/* Timeline entries */}
      <div className="space-y-3 text-left">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
          <Lightbulb size={14} className="text-neon-green" />
          REGISTROS DE MONITORAMENTO
        </h3>

        <div className="relative border-l border-zinc-800 pl-4 space-y-4 ml-1 pb-2">
          {emotionalDiary.map((log) => (
            <TimelineEntry key={log.id} log={log} />
          ))}
        </div>
      </div>
    </div>
  )
}
