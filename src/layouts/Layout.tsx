import React, { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import { cn } from '../utils/cn'
import { casinoAudio } from '../utils/audioEngine'
import { Lock } from 'lucide-react'
import { MapeamentoMomentoModal } from '../components/ui/MapeamentoMomentoModal'

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
    setTab,
    checkAndResetDailyMapping,
    tickContentCooldowns,
    activeGame
  } = useStore()

  // Reset daily mapping on app load/calendar change
  useEffect(() => {
    checkAndResetDailyMapping()
  }, [checkAndResetDailyMapping])

  // Unified 1-second interval ticker for active cooldowns and content rewards
  useEffect(() => {
    const timer = setInterval(() => {
      if (cooldownActive) {
        tickCooldown()
      }
      tickContentCooldowns()
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldownActive, tickCooldown, tickContentCooldowns])

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

  let backgroundStyle = "linear-gradient(to bottom, rgba(0, 255, 60, 0.15) 0%, rgba(0, 255, 60, 0.02) 45%, rgba(0, 255, 60, 0.02) 55%, rgba(0, 255, 60, 0.10) 100%), #080a0c"
  if (modoCritico) {
    backgroundStyle = "#1c1917"
  } else if (activeGame === 'slots') {
    backgroundStyle = "linear-gradient(to bottom, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.02) 45%, rgba(168, 85, 247, 0.02) 55%, rgba(168, 85, 247, 0.10) 100%), #080a0c"
  } else if (activeGame === 'double') {
    backgroundStyle = "linear-gradient(to bottom, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.02) 45%, rgba(239, 68, 68, 0.02) 55%, rgba(239, 68, 68, 0.08) 100%), #080a0c"
  } else if (activeGame === 'roleta') {
    backgroundStyle = "linear-gradient(to bottom, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.02) 45%, rgba(59, 130, 246, 0.02) 55%, rgba(59, 130, 246, 0.08) 100%), #080a0c"
  } else if (activeGame === 'mines') {
    backgroundStyle = "linear-gradient(to bottom, rgba(250, 204, 21, 0.12) 0%, rgba(250, 204, 21, 0.02) 45%, rgba(250, 204, 21, 0.02) 55%, rgba(250, 204, 21, 0.08) 100%), #080a0c"
  } else if (activeGame === 'dice') {
    backgroundStyle = "linear-gradient(to bottom, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0.02) 45%, rgba(236, 72, 153, 0.02) 55%, rgba(236, 72, 153, 0.08) 100%), #080a0c"
  } else if (activeGame === 'mental') {
    backgroundStyle = "linear-gradient(to bottom, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.02) 45%, rgba(16, 185, 129, 0.02) 55%, rgba(16, 185, 129, 0.10) 100%), #080a0c"
  }

  return (
    <div 
      className={cn(
        "h-full w-full flex justify-center bg-black overflow-hidden transition-colors duration-300",
        modoCritico && "modo-critico"
      )}
      style={{ filter: `saturate(${saturation})` }}
    >
      <div 
        className="w-full max-w-md md:max-w-xl h-full border-x border-cyber-border flex flex-col relative shadow-2xl overflow-hidden"
        style={{
          background: backgroundStyle
        }}
      >
        <Header />
        
        {/* Main Content Area */}
        <main className={cn("flex-1 px-4 overflow-x-hidden", activeGame ? "pt-2 pb-3 overflow-y-hidden" : "py-6 overflow-y-auto")}>
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
        <MapeamentoMomentoModal />
      </div>
    </div>
  )
}
