import React, { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import { cn } from '../utils/cn'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { modoCritico, cooldownActive, cooldownTimeLeft, tickCooldown } = useStore()

  // Handle active cooldown countdown ticking
  useEffect(() => {
    let timer: any
    if (cooldownActive) {
      timer = setInterval(() => {
        tickCooldown()
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cooldownActive, tickCooldown])

  return (
    <div 
      className={cn(
        "min-h-screen w-full flex justify-center bg-black transition-colors duration-300",
        modoCritico && "modo-critico"
      )}
    >
      <div className="w-full max-w-md md:max-w-xl min-h-screen bg-zinc-950 border-x border-cyber-border flex flex-col pb-20 relative shadow-2xl">
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 px-4 py-6 overflow-y-auto">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
