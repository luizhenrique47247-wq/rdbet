import React from 'react'
import type { EmotionalLog } from '../../types/store'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'

interface TimelineEntryProps {
  log: EmotionalLog
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({ log }) => {
  const formattedDate = new Date(log.timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="relative space-y-1.5">
      {/* Timeline dot selector */}
      <span className={cn(
        "absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-zinc-950 ring-1",
        log.mood === 'impulso' ? 'bg-red-500 ring-red-500/20' :
        log.mood === 'ansioso' ? 'bg-yellow-500 ring-yellow-500/20' :
        log.mood === 'calmo' ? 'bg-emerald-500 ring-emerald-500/20' : 'bg-blue-500 ring-blue-500/20'
      )} />

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-500 font-bold tabular-nums">
          {formattedDate}
        </span>
        <Badge
          variant={
            log.mood === 'impulso' ? 'red' :
            log.mood === 'ansioso' ? 'yellow' :
            log.mood === 'calmo' ? 'green' : 'blue'
          }
          glow
        >
          {log.mood} (Int: {log.intensity}/10)
        </Badge>
      </div>

      <div className="bg-zinc-900 border border-cyber-border rounded-xl p-3 text-xs text-zinc-300 space-y-1.5">
        <div>
          <span className="text-[9px] text-zinc-500 font-extrabold uppercase block">Gatilho Identificado:</span>
          <p className="font-semibold text-white">{log.trigger}</p>
        </div>
        {log.notes && (
          <div className="border-t border-cyber-border/40 pt-1.5 mt-1.5">
            <span className="text-[9px] text-zinc-500 font-extrabold uppercase block">Ação de Resposta:</span>
            <p className="text-zinc-400 leading-relaxed italic">{log.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
