import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Shield, Plus } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { BalanceCounter } from './ui/BalanceCounter'
import { casinoAudio } from '../utils/audioEngine'
import { cn } from '../utils/cn'

export const Header: React.FC = () => {
  const { balance, registered, setTab, activeGame } = useStore()
  const [showLoadModal, setShowLoadModal] = useState(false)

  const handleConfirmRedirect = () => {
    casinoAudio.playTick()
    setTab('missoes')
    setShowLoadModal(false)
  }

  const handleHeaderRegister = () => {
    casinoAudio.playTick()
    setTab('inicio')
    // Dispatch a custom event to open the registration modal in Inicio page!
    window.dispatchEvent(new CustomEvent('open-register-modal'))
  }

  const themeColors = {
    slots: {
      text: 'text-[#a855f7]',
      bg: 'bg-[#a855f7] hover:bg-[#b46ef8]',
      glow: 'shadow-lg shadow-[#a855f7]/20',
      shield: 'bg-purple-950/30 border-[#a855f7]/40 text-[#a855f7] drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]'
    },
    double: {
      text: 'text-[#ef4444]',
      bg: 'bg-[#ef4444] hover:bg-[#f87171]',
      glow: 'shadow-lg shadow-[#ef4444]/20',
      shield: 'bg-red-950/30 border-[#ef4444]/40 text-[#ef4444] drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]'
    },
    roleta: {
      text: 'text-[#3b82f6]',
      bg: 'bg-[#3b82f6] hover:bg-[#60a5fa]',
      glow: 'shadow-lg shadow-[#3b82f6]/20',
      shield: 'bg-blue-950/30 border-[#3b82f6]/40 text-[#3b82f6] drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]'
    },
    mines: {
      text: 'text-[#facc15]',
      bg: 'bg-[#facc15] hover:bg-[#fde047]',
      glow: 'shadow-lg shadow-[#facc15]/20',
      shield: 'bg-yellow-950/30 border-[#facc15]/40 text-[#facc15] drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]'
    },
    dice: {
      text: 'text-[#ec4899]',
      bg: 'bg-[#ec4899] hover:bg-[#f472b6]',
      glow: 'shadow-lg shadow-[#ec4899]/20',
      shield: 'bg-pink-950/30 border-[#ec4899]/40 text-[#ec4899] drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]'
    },
    mental: {
      text: 'text-[#10b981]',
      bg: 'bg-[#10b981] hover:bg-[#34d399]',
      glow: 'shadow-lg shadow-[#10b981]/20',
      shield: 'bg-emerald-950/30 border-[#10b981]/40 text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]'
    }
  }

  const currentTheme = (activeGame && themeColors[activeGame as keyof typeof themeColors]) || {
    text: 'text-neon-green',
    bg: 'bg-neon-green hover:bg-neon-green-glow',
    glow: 'shadow-lg shadow-neon-green/20',
    shield: 'bg-emerald-950/30 border-neon-green/40 text-neon-green glow-green'
  }

  const accentTextClass = currentTheme.text
  const accentBgClass = currentTheme.bg
  const accentGlowClass = currentTheme.glow
  const shieldBgClass = currentTheme.shield

  return (
    <>
      <header className="w-full border-b border-cyber-border bg-[#0b0d10]/45 backdrop-blur-md px-4 py-3.5 flex items-center justify-between z-40 shrink-0">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border", shieldBgClass)}>
            <Shield size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-black text-xl tracking-wide text-white logo-font select-none">
            RD<span className={accentTextClass}>BET</span>
          </span>
        </div>

        {/* Balance or Register Area */}
        <div className="flex items-center">
          {!registered ? (
            <button
              onClick={handleHeaderRegister}
              className={cn("px-4 py-2.5 text-black font-black text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer", accentBgClass, accentGlowClass)}
            >
              CADASTRAR
            </button>
          ) : (
            /* Balance Widget Capsule */
            <div 
              id="header-balance-container"
              className="flex items-center bg-[#12161a] border border-cyber-border rounded-full pl-3.5 pr-1 py-1 gap-2.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]"
            >
              <div className="flex flex-col items-start leading-none pr-1">
                <span className="text-[7px] text-zinc-500 font-black uppercase tracking-widest">
                  Banca Virtual
                </span>
                <BalanceCounter value={balance} />
              </div>
              
              <button
                onClick={() => {
                  casinoAudio.playTick()
                  setShowLoadModal(true)
                }}
                className={cn("w-7 h-7 rounded-full text-black flex items-center justify-center transition-all cursor-pointer", accentBgClass, accentGlowClass)}
                title="Carregar Moedas Fictícias"
              >
                <Plus size={16} className="stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Educational Load Modal */}
      <Modal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        title="AVISO DE AUTOCONTROLE"
        accentColor="green"
      >
        <div className="space-y-3 text-zinc-300 text-xs leading-relaxed">
          <p>
            Diferente de um cassino convencional, na <strong className="text-white">RDBET</strong> você <strong className="text-neon-red">NUNCA</strong> deposita dinheiro real e <strong className="text-neon-red">NUNCA</strong> saca lucros.
          </p>
          <p>
            As moedas virtuais são <strong className="text-neon-green">100% gratuitas</strong> e servem para você jogar nossos simuladores de forma segura, observando na prática as armadilhas cognitivas e estatísticas dos algoritmos.
          </p>
          <p className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg">
            💡 <strong>Psicologia do Valor:</strong> Na vida real, cada aposta custa horas de trabalho, sono e saúde mental. Aqui, as moedas simbolizam sua energia mental focada em prevenção de danos.
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button
            onClick={handleConfirmRedirect}
            variant="primary"
            glow
            className="w-full py-3.5 text-xs font-black tracking-widest uppercase"
          >
            CONFIRMO
          </Button>
          <Button
            onClick={() => setShowLoadModal(false)}
            variant="secondary"
            className="w-full text-xs font-black tracking-widest uppercase"
          >
            Fechar Aviso
          </Button>
        </div>
      </Modal>
    </>
  )
}
