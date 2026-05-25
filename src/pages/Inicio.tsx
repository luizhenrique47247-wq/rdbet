import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Gift, ChevronDown, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { casinoAudio } from '../utils/audioEngine'
import { CoinShower } from '../components/animations/CoinShower'

export const Inicio: React.FC = () => {
  const { addBalance, performCheckIn } = useStore()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [bonusClaimed, setBonusClaimed] = useState(false)
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })

  const handleClaimDailyBank = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (bonusClaimed) return
    
    // Play win sound
    casinoAudio.playWinMelody()
    
    // Trigger coin flying animation
    setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
    setShowerTrigger(true)
    
    addBalance(20)
    setBonusClaimed(true)
    performCheckIn()
    
    setTimeout(() => {
      setBonusClaimed(false)
    }, 4000)
  }

  const faqItems = [
    {
      q: 'O que é a RDBET?',
      a: 'A RDBET é uma plataforma de redução de danos e conscientização sobre ludopatia. Utilizando a mesma linguagem estética e mecânica de cassinos virtuais convencionais, nós mostramos as engrenagens psicológicas e estatísticas que tornam os jogos viciantes, oferecendo uma válvula de escape segura e terapêutica.'
    },
    {
      q: 'O dinheiro é real?',
      a: 'Não. 100% dos saldos e apostas nesta plataforma são puramente virtuais. Nós não aceitamos cartões, PIX ou pagamentos. O objetivo aqui é exclusivamente educacional e de proteção à saúde mental.'
    },
    {
      q: 'O que é o Reforço Variável?',
      a: 'É um mecanismo psicológico onde a recompensa é entregue de forma imprevisível (como em slots ou crash). O cérebro humano libera mais dopamina na expectativa da recompensa incerta do que no ganho garantido, criando o ciclo da compulsão. Nossos simuladores expõem esse truque matemático.'
    },
    {
      q: 'Como funciona o Modo Crítico?',
      a: 'O Modo Crítico é um recurso exclusivo de segurança. Quando ativado, ele desliga todas as cores neon vibrantes, luzes piscantes e animações rápidas, transformando a interface em um design neutro e cinzento de baixíssimo estímulo visual, auxiliando a conter episódios de fissura aguda.'
    }
  ]

  return (
    <div className="space-y-6 text-center">
      {/* Hero Banner Panel */}
      <div className="relative py-8 px-4 flex flex-col items-center justify-center space-y-6 overflow-hidden">
        {/* Glowing aura background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-neon-green/5 blur-[90px]" />

        {/* Top nicotine badge */}
        <div className="inline-flex items-center gap-2 bg-black/90 border border-neon-green/20 rounded-full px-4 py-1.5 text-[9px] text-white font-black tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_rgba(0,255,60,0.8)]" />
          O ADESIVO DE NICOTINA DAS APOSTAS
        </div>

        {/* Title messages */}
        <div className="space-y-1.5 z-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider leading-none">
            BEM-VINDO DE VOLTA, TEQWE
          </h2>
          <h1 className="text-3xl font-black text-neon-green text-glow-green uppercase tracking-widest leading-none mt-1">
            A BANCA É SUA
          </h1>
        </div>

        {/* Paragraph clinical protocol description */}
        <p className="text-[11px] text-zinc-400 font-medium max-w-[90%] leading-relaxed z-10 mx-auto">
          Mantenha seu protocolo clínico ativo. Utilize a simulação para esgotar o impulso sem comprometer sua vida financeira real.
        </p>

        {/* Large Action outline Button */}
        <button
          onClick={handleClaimDailyBank}
          disabled={bonusClaimed}
          className="w-full max-w-[300px] py-4 bg-transparent hover:bg-neon-green/5 border-2 border-neon-green rounded-xl text-neon-green font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(0,255,60,0.15)] hover:shadow-[0_0_25px_rgba(0,255,60,0.35)] focus:outline-none relative overflow-hidden"
        >
          <Gift size={18} className="stroke-[2.5] text-neon-green" />
          {bonusClaimed ? 'BANCA DIÁRIA RESGATADA!' : 'RESGATAR BANCA DIÁRIA'}
        </button>

        <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest cursor-pointer hover:text-zinc-400 transition-colors pt-2">
          COMO FUNCIONA O PERFIL DE BET?
        </span>
      </div>

      {/* Floating coin shower */}
      <CoinShower
        trigger={showerTrigger}
        startX={showerCoords.x}
        startY={showerCoords.y}
        targetId="header-balance-container"
        onCoinArrived={() => casinoAudio.playCoinChime()}
        onComplete={() => setShowerTrigger(false)}
      />

      {/* Floating bonus micro alert */}
      <AnimatePresence>
        {bonusClaimed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#12161a] border border-neon-green/30 text-neon-green text-xs font-bold py-2.5 px-4 rounded-xl mx-auto max-w-xs shadow-lg"
          >
            +R$ 30,00 virtuais creditados na sua banca!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational Article Section */}
      <div className="space-y-3 text-left">
        <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
          <Brain size={14} className="text-neon-green" />
          MECANISMO DO VÍCIO
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          <Card className="p-4 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 bg-neon-red rounded-full" />
              O Efeito Quase-Vitória (Near-Miss)
            </h4>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Quando você roda uma roleta ou slot e erra por apenas um símbolo, seu cérebro processa o resultado não como uma derrota comum, mas como uma "quase-vitória". Isso ativa as mesmas vias dopaminérgicas da vitória real, induzindo-o a gastar novamente achando que está "perto".
            </p>
          </Card>

          <Card className="p-4 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 bg-neon-yellow rounded-full" />
              Ilusão de Habilidade
            </h4>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Jogos rápidos estilo "Crash" (onde você decide quando retirar) ou apostas esportivas dão a falsa sensação de que você tem controle sobre o resultado. Porém, no longo prazo, a matemática da banca sempre garante lucro absoluto para a plataforma, e prejuízo para o apostador.
            </p>
          </Card>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-2 text-left">
        <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
          PERGUNTAS FREQUENTES
        </h3>
        
        <div className="border border-cyber-border rounded-xl overflow-hidden divide-y divide-cyber-border bg-[#12161a]">
          {faqItems.map((item, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div key={idx} className="w-full">
                <button
                  onClick={() => {
                    casinoAudio.playTick()
                    setActiveFaq(isOpen ? null : idx)
                  }}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-zinc-800/10 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-zinc-200 font-sans uppercase tracking-wide">{item.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-neon-green' : ''}`} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-[#0b0d10]"
                    >
                      <div className="px-4 py-3 text-[11px] text-zinc-400 leading-relaxed border-t border-cyber-border/40">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
