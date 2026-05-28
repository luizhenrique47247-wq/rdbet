import React from 'react'
import { useStore } from '../store/useStore'
import { Home, Play, History, User, Target } from 'lucide-react'
import { cn } from '../utils/cn'
import { casinoAudio } from '../utils/audioEngine'

export const BottomNav: React.FC = () => {
  const { currentTab, setTab, activeGame } = useStore()

  const navItems = [
    { id: 'inicio', label: 'INÍCIO', icon: Home, isCenter: false },
    { id: 'missoes', label: 'MISSÕES', icon: Target, isCenter: false },
    { id: 'jogar', label: 'JOGAR', icon: Play, isCenter: true },
    { id: 'extrato', label: 'EXTRATO', icon: History, isCenter: false },
    { id: 'conta', label: 'CONTA', icon: User, isCenter: false },
  ] as const

  const handleTabClick = (tabId: typeof navItems[number]['id']) => {
    casinoAudio.playTick()
    setTab(tabId)
  }

  const themeColors = {
    slots: {
      text: 'text-[#a855f7]',
      glow: 'text-glow-purple',
      centerBtn: 'bg-[#a855f7] hover:bg-[#b46ef8] text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:scale-[1.07]',
      centerIcon: 'fill-white stroke-white'
    },
    double: {
      text: 'text-[#ef4444]',
      glow: 'text-glow-red',
      centerBtn: 'bg-[#ef4444] hover:bg-[#f87171] text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:scale-[1.07]',
      centerIcon: 'fill-white stroke-white'
    },
    roleta: {
      text: 'text-[#3b82f6]',
      glow: 'text-glow-blue',
      centerBtn: 'bg-[#3b82f6] hover:bg-[#60a5fa] text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-[1.07]',
      centerIcon: 'fill-white stroke-white'
    },
    mines: {
      text: 'text-[#facc15]',
      glow: 'text-glow-yellow',
      centerBtn: 'bg-[#facc15] hover:bg-[#fde047] text-black shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:scale-[1.07]',
      centerIcon: 'fill-black stroke-black'
    },
    dice: {
      text: 'text-[#ec4899]',
      glow: 'text-glow-pink',
      centerBtn: 'bg-[#ec4899] hover:bg-[#f472b6] text-white shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:scale-[1.07]',
      centerIcon: 'fill-white stroke-white'
    },
    mental: {
      text: 'text-[#10b981]',
      glow: 'text-glow-emerald',
      centerBtn: 'bg-[#10b981] hover:bg-[#34d399] text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:scale-[1.07]',
      centerIcon: 'fill-white stroke-white'
    }
  }

  const currentTheme = (activeGame && themeColors[activeGame as keyof typeof themeColors]) || {
    text: 'text-neon-green',
    glow: 'text-glow-green',
    centerBtn: 'bg-neon-green text-black shadow-[0_0_20px_rgba(0,255,60,0.6)] hover:bg-neon-green-glow',
    centerIcon: 'fill-black stroke-black'
  }

  const accentTextClass = currentTheme.text
  const accentGlowClass = currentTheme.glow
  const centerBtnClass = currentTheme.centerBtn
  const centerIconClass = currentTheme.centerIcon

  return (
    <nav className="w-full z-40 border-t border-cyber-border bg-[#0b0d10]/45 backdrop-blur-md pb-safe shrink-0">
      <div className="px-6 h-16 flex items-center justify-between relative">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.id

          if (item.isCenter) {
            return (
              <div key={item.id} className="relative -top-4 flex flex-col items-center">
                <button
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center border-none transition-all cursor-pointer scale-105",
                    centerBtnClass
                  )}
                >
                  <Icon size={24} className={cn("stroke-[3]", centerIconClass)} />
                </button>
                <span className={cn(
                  "text-[9px] mt-1.5 font-black tracking-widest transition-all",
                  isActive ? cn(accentTextClass, accentGlowClass) : "text-zinc-500"
                )}>
                  {item.label}
                </span>
              </div>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="flex flex-col items-center justify-center w-12 h-12 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
            >
              <Icon
                size={22}
                className={cn(
                  "transition-all mb-1",
                  isActive
                    ? cn(accentTextClass, accentGlowClass, "scale-105 stroke-[2.2]")
                    : "text-zinc-400 stroke-[1.8]"
                )}
              />
              <span
                className={cn(
                  "text-[9px] font-black tracking-wider transition-all",
                  isActive ? accentTextClass : "text-zinc-500"
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
