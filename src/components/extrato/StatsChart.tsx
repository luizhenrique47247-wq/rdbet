import React from 'react'
import type { SimulatedStat } from '../../types/store'

interface StatsChartProps {
  stats: SimulatedStat[]
}

export const StatsChart: React.FC<StatsChartProps> = ({ stats }) => {
  const maxSpent = Math.max(...stats.map(s => s.simulatedSpent), 1)
  const maxSaved = Math.max(...stats.map(s => s.actualSaved), 1)
  const chartMax = Math.max(maxSpent, maxSaved, 500)

  return (
    <div className="bg-zinc-900 border border-cyber-border rounded-2xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-sans">
          Progresso Semanal
        </h3>
        <div className="flex gap-3 text-[9px] font-bold">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-1.5 bg-neon-green rounded" />
            <span className="text-zinc-400">Economia</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-1.5 bg-neon-red rounded" />
            <span className="text-zinc-400">Perda Virtual</span>
          </div>
        </div>
      </div>

      <div className="h-32 w-full bg-zinc-950 border border-cyber-border/40 rounded-xl relative flex flex-col justify-end p-2">
        <svg className="w-full h-24 overflow-visible" viewBox="0 0 350 100" preserveAspectRatio="none">
          {/* Economia Line (Green) */}
          <path
            d={stats.reduce((acc, stat, i) => {
              const x = (i * 350) / 6
              const y = 90 - (stat.actualSaved / chartMax) * 80
              return acc + `${i === 0 ? 'M' : 'L'} ${x} ${y}`
            }, '')}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            className="opacity-90"
          />
          {stats.map((stat, i) => (
            <circle
              key={`saved-${i}`}
              cx={(i * 350) / 6}
              cy={90 - (stat.actualSaved / chartMax) * 80}
              r="3"
              fill="#4ade80"
            />
          ))}

          {/* Perda Virtual Line (Red) */}
          <path
            d={stats.reduce((acc, stat, i) => {
              const x = (i * 350) / 6
              const y = 90 - (stat.simulatedSpent / chartMax) * 80
              return acc + `${i === 0 ? 'M' : 'L'} ${x} ${y}`
            }, '')}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            className="opacity-75"
          />
          {stats.map((stat, i) => (
            <circle
              key={`spent-${i}`}
              cx={(i * 350) / 6}
              cy={90 - (stat.simulatedSpent / chartMax) * 80}
              r="2.5"
              fill="#f87171"
            />
          ))}
        </svg>

        <div className="flex justify-between px-1 text-[8px] text-zinc-500 font-extrabold uppercase mt-2">
          {stats.map((s, idx) => (
            <span key={idx}>{s.date}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
