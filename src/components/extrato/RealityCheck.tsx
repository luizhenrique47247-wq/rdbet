import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { Card } from '../ui/Card'

interface RealityCheckProps {
  moneySaved: number
}

export const RealityCheck: React.FC<RealityCheckProps> = ({ moneySaved }) => {
  const getRealityEquivalents = (value: number) => {
    if (value <= 0) return []
    const items = [
      { text: 'semana de compras básicas de supermercado', cost: 300, icon: '🛒' },
      { text: 'meses de assinatura de streaming de música/vídeo', cost: 50, icon: '📺' },
      { text: 'contas mensais de energia elétrica pagas', cost: 150, icon: '⚡' },
      { text: 'jantares especiais com a família/amigos', cost: 120, icon: '🍕' },
      { text: 'tênis esportivo confortável para caminhadas', cost: 250, icon: '👟' },
      { text: 'livros educativos ou de autodesenvolvimento', cost: 60, icon: '📚' }
    ]

    return items
      .map(item => {
        const qty = parseFloat((value / item.cost).toFixed(1))
        return { ...item, qty }
      })
      .filter(item => item.qty >= 0.5)
  }

  const equivalents = getRealityEquivalents(moneySaved)

  if (moneySaved <= 0 || equivalents.length === 0) return null

  return (
    <Card className="p-5 space-y-3.5">
      <div className="flex items-center gap-2 text-neon-green">
        <ShoppingCart size={18} className="text-glow-green" />
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-sans">
          Reality Check (O valor do dinheiro)
        </h3>
      </div>
      <p className="text-[11px] text-zinc-400 leading-relaxed">
        Seu cérebro costuma ver apostas como 'fichas abstratas'. Mas no mundo real, esse dinheiro tem valor físico. Com os <strong className="text-white">R$ {moneySaved}</strong> que você economizou ao não jogar, você poderia adquirir:
      </p>

      <div className="grid grid-cols-1 gap-2.5">
        {equivalents.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs text-zinc-300 font-medium">
                {item.qty}x {item.text}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-bold tabular-nums">
              ~R$ {(item.qty * item.cost).toFixed(0)} total
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
