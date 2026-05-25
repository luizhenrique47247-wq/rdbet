import React from 'react'
import { useStore } from '../store/useStore'
import { Home, Play, History, User } from 'lucide-react'
import { cn } from '../utils/cn'
import { casinoAudio } from '../utils/audioEngine'

export const BottomNav: React.FC = () => {
  const { currentTab, setTab } = useStore()

  // Concentric target SVG for Missões icon
  const TargetIcon = () => (
    <svg className="w-[22px] h-[22px] transition-all mb-1 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )

  const navItems = [
    { id: 'inicio', label: 'INÍCIO', icon: Home, isCenter: false },
    { id: 'missoes', label: 'MISSÕES', icon: TargetIcon, isCenter: false },
    { id: 'jogar', label: 'JOGAR', icon: Play, isCenter: true },
    { id: 'extrato', label: 'EXTRATO', icon: History, isCenter: false },
    { id: 'conta', label: 'CONTA', icon: User, isCenter: false },
  ] as const

  const handleTabClick = (tabId: typeof navItems[number]['id']) => {
    casinoAudio.playTick()
    setTab(tabId)
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-xl z-40 border-t border-x border-cyber-border bg-[#0b0d10] pb-safe">
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
                    "w-14 h-14 rounded-full flex items-center justify-center border-none transition-all cursor-pointer bg-neon-green text-black shadow-[0_0_20px_rgba(0,255,60,0.6)] scale-105 hover:bg-neon-green-glow"
                  )}
                >
                  <Icon size={24} className="fill-black stroke-black stroke-[3]" />
                </button>
                <span className={cn(
                  "text-[9px] mt-1.5 font-black tracking-widest transition-all",
                  isActive ? "text-neon-green text-glow-green" : "text-zinc-500"
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
              {typeof Icon === 'function' && item.id === 'missoes' ? (
                <div className={cn(isActive ? "text-neon-green" : "text-zinc-400")}>
                  <Icon />
                </div>
              ) : (
                <Icon
                  size={22}
                  className={cn(
                    "transition-all mb-1",
                    isActive
                      ? "text-neon-green text-glow-green scale-105 stroke-[2.2]"
                      : "text-zinc-400 stroke-[1.8]"
                  )}
                />
              )}
              <span
                className={cn(
                  "text-[9px] font-black tracking-wider transition-all",
                  isActive ? "text-neon-green" : "text-zinc-500"
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
