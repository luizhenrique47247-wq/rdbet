import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Info } from 'lucide-react'
import { casinoAudio } from '../../utils/audioEngine'

interface CognitiveOverlayProps {
  isOpen: boolean
  amountSpent: number
  onClose: () => void
}

export const CognitiveOverlay: React.FC<CognitiveOverlayProps> = ({
  isOpen,
  amountSpent,
  onClose
}) => {
  const [secondsLeft, setSecondsLeft] = useState(3)

  useEffect(() => {
    if (!isOpen) return
    
    setSecondsLeft(3)
    casinoAudio.playWarning()

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  // Helper to translate virtual currency to real essentials
  const getRealWorldEquivalent = (val: number) => {
    if (val < 20) {
      return {
        items: "2 litros de leite Integral 🥛 ou 1 pacote de pão de forma 🍞",
        note: "Itens básicos de alimentação diária que muitas vezes faltam quando o dinheiro é drenado por apostas."
      }
    }
    if (val < 50) {
      return {
        items: "1 almoço executivo completo 🍲 ou 1 pacote de 5kg de arroz 🍚",
        note: "O valor de uma aposta rápida em cassino poderia garantir a refeição principal do seu dia."
      }
    }
    if (val < 100) {
      return {
        items: "A conta de luz mensal de uma residência econômica ⚡",
        note: "Garantia de conforto e estabilidade em sua casa em vez de transferir o dinheiro para plataformas offshore."
      }
    }
    if (val < 200) {
      return {
        items: "Uma compra semanal de hortifruti fresca para a família 🍎🥦",
        note: "Mais saúde e nutrição para você e para quem você ama, em vez de perdas matemáticas no azar."
      }
    }
    return {
      items: "Uma cesta básica completa 🧺 ou a conta mensal de água e internet da casa 📶",
      note: "Necessidades essenciais de sobrevivência e bem-estar que são negligenciadas no vício."
    }
  }

  const equivalent = getRealWorldEquivalent(amountSpent)

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md select-none">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#12161a] border border-cyber-border rounded-2xl p-6 shadow-2xl flex flex-col justify-between min-h-[400px] text-left text-white relative overflow-hidden"
          >
            {/* Header Badge */}
            <div className="flex items-center gap-2 text-neon-red bg-red-950/20 border border-red-500/30 px-3 py-2 rounded-xl">
              <ShieldAlert size={20} className="text-glow-red animate-pulse" />
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest block leading-none text-neon-red">
                  Choque de Realidade
                </span>
                <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">
                  Interrupção Cognitiva Terapêutica
                </span>
              </div>
            </div>

            {/* Core Message */}
            <div className="space-y-4 my-6">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider block">
                  Você acabou de gastar na simulação:
                </span>
                <span className="text-3xl font-black text-neon-red text-glow-red tabular-nums leading-none">
                  R$ {amountSpent.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="bg-zinc-900 border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden">
                <span className="text-[9px] text-neon-green font-extrabold uppercase tracking-widest block">
                  VALOR EQUIVALENTE NA VIDA REAL:
                </span>
                <h4 className="text-sm font-extrabold text-white leading-snug">
                  {equivalent.items}
                </h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                  {equivalent.note}
                </p>
              </div>

              <div className="flex gap-2 p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] text-zinc-400 leading-relaxed">
                <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <p>
                  Estudos demonstram que as plataformas de aposta mascaram o dinheiro real sob forma de saldos coloridos para amortecer o sentimento de perda no cérebro.
                </p>
              </div>
            </div>

            {/* Countdown / Continue button */}
            <div className="space-y-3 pt-4 border-t border-cyber-border">
              {secondsLeft > 0 ? (
                <div className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center gap-2.5">
                  <div className="w-5 h-5 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Bloqueado por mais {secondsLeft}s...
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    casinoAudio.playTick()
                    onClose()
                  }}
                  className="w-full py-3.5 bg-neon-green text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer hover:bg-neon-green-glow shadow-[0_0_20px_rgba(0,255,60,0.3)] text-center block"
                >
                  Voltar à Simulação Segura
                </button>
              )}
              
              <span className="text-[8px] text-zinc-500 text-center block uppercase tracking-wider font-semibold">
                Este freio previne o piloto automático de apostas sequenciais.
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
