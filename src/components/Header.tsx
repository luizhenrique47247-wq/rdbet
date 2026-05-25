import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Shield, Award, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { BalanceCounter } from './ui/BalanceCounter'
import { casinoAudio } from '../utils/audioEngine'

export const Header: React.FC = () => {
  const { balance, addBalance, registered, setTab } = useStore()
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [loadedAmount, setLoadedAmount] = useState<number | null>(null)

  const handleAddFictiveFunds = () => {
    casinoAudio.playWinMelody()
    addBalance(100)
    setLoadedAmount(100)
    setTimeout(() => {
      setLoadedAmount(null)
    }, 2000)
  }

  const handleHeaderRegister = () => {
    casinoAudio.playTick()
    setTab('inicio')
    // Dispatch a custom event to open the registration modal in Inicio page!
    window.dispatchEvent(new CustomEvent('open-register-modal'))
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cyber-border bg-[#0b0d10] px-4 py-3.5 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/30 border border-neon-green/40 flex items-center justify-center text-neon-green glow-green">
            <Shield size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-black text-xl tracking-wide text-white logo-font select-none">
            RD<span className="text-neon-green">BET</span>
          </span>
        </div>

        {/* Balance or Register Area */}
        <div className="flex items-center">
          {!registered ? (
            <button
              onClick={handleHeaderRegister}
              className="px-4 py-2.5 bg-neon-green hover:bg-neon-green-glow text-black font-black text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-lg shadow-neon-green/20"
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
                className="w-7 h-7 rounded-full bg-neon-green hover:bg-neon-green-glow text-black flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-neon-green/20"
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
            onClick={handleAddFictiveFunds}
            variant="primary"
            glow
            className="w-full py-3 text-xs"
          >
            <Award size={16} />
            Resgatar +R$ 100,00 Fictícios
          </Button>
          <Button
            onClick={() => setShowLoadModal(false)}
            variant="secondary"
            className="w-full text-xs"
          >
            Fechar Aviso
          </Button>
        </div>

        {/* Floating micro notification */}
        <AnimatePresence>
          {loadedAmount && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#12161a] border border-neon-green/30 text-neon-green px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xl"
            >
              +R$ 100,00 virtuais creditados!
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  )
}
