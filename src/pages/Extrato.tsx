import React from 'react'
import { useStore } from '../store/useStore'
import { ShoppingCart, Lightbulb, TrendingDown } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { TimelineEntry } from '../components/extrato/TimelineEntry'

export const Extrato: React.FC = () => {
  const { 
    simulatedMoneyLost, 
    emotionalDiary 
  } = useStore()

  // Calculate real-world items equivalents that could have been bought
  const getLostEquivalents = (value: number) => {
    if (value <= 0) return []
    const items = [
      { text: 'Cartelas de Ovos (30un)', cost: 20, icon: '🥚' },
      { text: 'Litros de Leite Integral', cost: 7, icon: '🥛' },
      { text: 'Pizzas Grandes de Sexta-feira', cost: 80, icon: '🍕' },
      { text: 'Contas de Luz Mensais', cost: 180, icon: '⚡' },
      { text: 'Meses de Compras Básicas de Supermercado', cost: 500, icon: '🛒' },
      { text: 'Smartphones Intermediários', cost: 1300, icon: '📱' }
    ]

    return items
      .map(item => {
        const qty = Math.floor(value / item.cost)
        return { ...item, qty }
      })
      .filter(item => item.qty > 0)
  }

  const lostEquivalents = getLostEquivalents(simulatedMoneyLost)

  return (
    <div className="space-y-6 text-center select-none pb-8 animate-fade-in">
      {/* Red Session Header Badge */}
      <div className="relative py-4 px-2 flex flex-col items-center justify-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-black/90 border border-neon-red/20 rounded-full px-4 py-1.5 text-[9px] text-white font-black tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-neon-red animate-pulse shadow-[0_0_8px_rgba(255,51,68,0.8)]" />
          ESTRATO DE COMPULSÃO
        </div>

        {/* Screen Title */}
        <div className="space-y-1.5 z-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-wider leading-none font-display">
            EXTRATO DE <span className="text-neon-red text-glow-red">REALIDADE</span>
          </h1>
          <p className="text-[10px] text-zinc-400 max-w-[85%] mx-auto font-medium leading-relaxed">
            Veja a conversão tangível do saldo virtual perdido nos simuladores em bens de consumo reais.
          </p>
        </div>
      </div>

      {/* Main Loss Summary Card */}
      <Card className="p-5 border-neon-red/15 bg-[#12161a]">
        <div className="flex flex-col items-center justify-center text-center space-y-2.5">
          <TrendingDown className="text-neon-red glow-red shrink-0" size={32} />
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">
              Prejuízo Acumulado nos Simuladores
            </span>
            <span className="text-3xl font-black text-white tracking-tight tabular-nums">
              <span className="text-neon-red font-black mr-1">- R$</span>
              {simulatedMoneyLost.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </Card>

      {/* Reality equivalents "O que foi tirado de você" */}
      <div className="space-y-3 text-left">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
          <ShoppingCart size={18} className="text-zinc-400" />
          O que foi tirado de você:
        </h3>

        {simulatedMoneyLost === 0 ? (
          <div className="border border-dashed border-zinc-800 bg-zinc-950/60 rounded-xl p-8 text-center text-[10px] text-zinc-500 font-black tracking-widest uppercase">
            Jogue nos simuladores para ver a conversão de perdas em itens do mundo real.
          </div>
        ) : lostEquivalents.length === 0 ? (
          <div className="border border-dashed border-zinc-800 bg-zinc-950/60 rounded-xl p-6 text-center text-[10px] text-zinc-400 font-extrabold uppercase">
            O prejuízo ainda é pequeno para comprar os itens básicos do termômetro. Continue registrando.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {lostEquivalents.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-[#12161a] border border-zinc-800/80 rounded-xl shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="space-y-0.5">
                    <span className="text-xs text-white font-extrabold block">
                      {item.qty}x {item.text}
                    </span>
                    <span className="text-[9px] text-zinc-500 block uppercase font-bold">
                      Custo unitário: R$ {item.cost},00
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-neon-red tabular-nums">
                  R$ {(item.qty * item.cost).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline Clinica / Histórico */}
      <div className="space-y-3 text-left">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb size={14} className="text-neon-green" />
          HISTÓRICO DE AVALIAÇÃO EMOCIONAL
        </h3>

        {emotionalDiary.length === 0 ? (
          <div className="border border-dashed border-zinc-800 bg-zinc-950/60 rounded-xl p-6 text-center text-[10px] text-zinc-500 font-black tracking-widest uppercase">
            Nenhum mapeamento ou gatilho emocional registrado ainda.
          </div>
        ) : (
          <div className="relative border-l border-zinc-800 pl-4 space-y-4 ml-1 pb-2">
            {emotionalDiary.map((log) => (
              <TimelineEntry key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
