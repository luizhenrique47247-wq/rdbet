import React from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import type { Mission } from '../../types/store'

interface MissionCardProps {
  mission: Mission
  onComplete: (id: string) => void
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onComplete }) => {
  return (
    <div 
      className={`flex items-start justify-between p-3.5 border rounded-xl transition-all ${
        mission.completed
          ? 'bg-zinc-950/40 border-emerald-950 text-zinc-500'
          : 'bg-zinc-900 border-cyber-border text-zinc-200'
      }`}
    >
      <div className="flex gap-3">
        <button
          disabled={mission.completed}
          onClick={() => onComplete(mission.id)}
          className={`mt-0.5 cursor-pointer transition-colors ${
            mission.completed ? 'text-emerald-500' : 'text-zinc-500 hover:text-neon-green'
          }`}
        >
          {mission.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </button>
        <div className="space-y-1">
          <span className={`text-xs font-bold ${mission.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
            {mission.title}
          </span>
          <p className="text-[10px] text-zinc-400 max-w-[85%]">{mission.description}</p>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0 leading-none">
        <span className={`text-[10px] font-extrabold ${mission.completed ? 'text-zinc-600' : 'text-neon-green'}`}>
          +{mission.xpReward} XP
        </span>
        <span className={`text-[9px] font-semibold text-zinc-500 mt-1`}>
          +{mission.balanceReward} moedas
        </span>
      </div>
    </div>
  )
}
