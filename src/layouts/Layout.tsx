import React, { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import { cn } from '../utils/cn'
import { casinoAudio } from '../utils/audioEngine'
import { Lock } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { 
    modoCritico, 
    cooldownActive, 
    tickCooldown, 
    registered, 
    selectedPlan, 
    simulatedDay,
    currentTab,
    setTab
  } = useStore()

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

  // Calculate saturation and volume factor for the desmame process
  let saturation = 1
  if (registered && selectedPlan) {
    if (selectedPlan === '30') {
      saturation = Math.max(0, 1 - (simulatedDay - 1) / 30)
    } else if (selectedPlan === '60') {
      saturation = Math.max(0, 1 - (simulatedDay - 1) / 60)
    }
  }

  // Update audioEngine volume factor dynamically
  useEffect(() => {
    casinoAudio.setVolumeFactor(saturation)
  }, [saturation])

  const showLockScreen = !registered && currentTab !== 'inicio'

  return (
    <div 
      className={cn(
        "min-h-screen w-full flex justify-center bg-black transition-colors duration-300",
        modoCritico && "modo-critico"
      )}
      style={{ filter: `saturate(${saturation})` }}
    >
      <div className="w-full max-w-md md:max-w-xl min-h-screen bg-zinc-950 border-x border-cyber-border flex flex-col pb-20 relative shadow-2xl overflow-x-hidden">
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 px-4 py-6 overflow-y-auto">
          {showLockScreen ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-16 px-4 animate-fade-in select-none">
              <div className="w-20 h-20 bg-zinc-900 border border-cyber-border rounded-full flex items-center justify-center text-neon-green glow-green animate-pulse">
                <Lock size={36} className="stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider font-display">
                  Abas Bloqueadas
                </h2>
                <p className="text-xs text-zinc-400 max-w-[85%] mx-auto leading-relaxed font-medium">
                  Faça seu cadastro gratuito na aba <strong className="text-white">Início</strong> para desbloquear a banca virtual, os simuladores e as missões terapêuticas.
                </p>
              </div>

              <button
                onClick={() => {
                  casinoAudio.playTick()
                  setTab('inicio')
                }}
                className="w-full max-w-[240px] py-3.5 bg-neon-green hover:bg-neon-green-glow text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[0_4px_15px_rgba(0,255,60,0.2)]"
              >
                Criar Bilhete VIP
              </button>
            </div>
          ) : (
            children
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
