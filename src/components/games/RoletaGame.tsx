import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import { RotateCw, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

export const RoletaGame: React.FC = () => {
  const { spendBalance, incrementSimulatedStats } = useStore()
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [insight, setInsight] = useState<string | null>(null)

  const roletaSectors = [
    { text: 'Privação de Sono', isBad: true, risk: 'Muito provável. Noites gastas em telas de aposta.' },
    { text: 'Estresse Crônico', isBad: true, risk: 'Certamente. Flutuações constantes de ansiedade e batimento.' },
    { text: 'Disfunção Familiar', isBad: true, risk: 'Alto. Mentiras para esconder rombos financeiros.' },
    { text: 'Culpa Profunda', isBad: true, risk: 'Sentimento após cada aposta perdida de dinheiro de verdade.' },
    { text: 'Dopamina Fácil (1%)', isBad: false, risk: 'Altamente raro. Dura segundos e gera ciclo de compulsão.' },
    { text: 'Isolamento Social', isBad: true, risk: 'Evitar amigos para continuar apostando escondido.' },
    { text: 'Empréstimo de Risco', isBad: true, risk: 'Sérias consequências. Nome negativado e dívidas acumulando.' },
    { text: 'Ansiedade Severa', isBad: true, risk: 'Ciclo vicioso de estresse persistente.' }
  ]

  const handleSpin = () => {
    if (spinning) return
    const cost = 50
    if (!spendBalance(cost)) {
      alert("Saldo virtual insuficiente! Recarregue no topo gratuitamente.")
      return
    }

    setSpinning(true)
    setInsight(null)
    incrementSimulatedStats(cost, 20)

    setTimeout(() => {
      const rng = Math.random()
      let indexSelected: number
      if (rng < 0.95) {
        const badIndices = roletaSectors.map((s, i) => s.isBad ? i : null).filter(v => v !== null) as number[]
        indexSelected = badIndices[Math.floor(Math.random() * badIndices.length)]
      } else {
        indexSelected = 4
      }

      setResult(indexSelected)
      setSpinning(false)

      const sector = roletaSectors[indexSelected]
      if (sector.isBad) {
        setInsight(
          `🔴 CONSEQÜÊNCIA LANDADA: "${sector.text}". Esse resultado representa a roleta real do vício em apostas. A matemática das plataformas garante que você gaste tempo e dinheiro. O que você de fato ganha são prejuízos na saúde mental, relacionamentos e estabilidade financeira. O jogo é projetado para fazer você rodar até perder tudo.`
        )
      } else {
        setInsight(
          `🟡 EFEITO ANCORAGEM: Você caiu em "${sector.text}". Embora pareça bom, o cérebro ancora nessa sensação positiva e ignora o fato de que os outros 99% das opções da roleta da vida real são destrutivas. A dopamina barata é a isca para te prender no anzol.`
        )
      }
    }, 2500)
  }

  return (
    <Card className="p-5 space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Roleta da Impulsividade</h3>
        <p className="text-[10px] text-zinc-400">Custo da rodada: 50 moedas fictícias</p>
      </div>

      <div className="flex justify-center py-4">
        <div className="relative w-48 h-48 rounded-full border-4 border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 to-zinc-900" />
          
          <motion.div
            animate={spinning ? { rotate: [0, 1440] } : result !== null ? { rotate: result * 45 } : {}}
            transition={spinning ? { duration: 2.5, ease: 'easeOut' } : { duration: 0.5 }}
            className="w-full h-full flex items-center justify-center"
          >
            {roletaSectors.map((sector, i) => (
              <div
                key={i}
                className="absolute text-[8px] font-bold text-center select-none"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-65px)`,
                  color: sector.isBad ? '#f87171' : '#fde047'
                }}
              >
                {sector.text.substring(0, 15)}
              </div>
            ))}
            
            <div className="w-4 h-4 bg-white rounded-full z-20 border border-zinc-800" />
          </motion.div>
          
          <div className="absolute top-0 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-neon-green z-30" />
        </div>
      </div>

      <Button
        onClick={handleSpin}
        disabled={spinning}
        variant="primary"
        glow
        className="w-full"
      >
        <RotateCw size={16} className={spinning ? "animate-spin" : ""} />
        {spinning ? 'ROLANDO ROLETA...' : 'RODAR ROLETA DA CONSEQUÊNCIA'}
      </Button>

      {insight && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 leading-relaxed space-y-2 border-l-2 border-l-neon-yellow"
        >
          <div className="flex items-center gap-1.5 text-neon-yellow font-bold">
            <ShieldAlert size={14} />
            <Badge variant="yellow" glow>Realidade Estatística</Badge>
          </div>
          <p>{insight}</p>
        </motion.div>
      )}
    </Card>
  )
}
