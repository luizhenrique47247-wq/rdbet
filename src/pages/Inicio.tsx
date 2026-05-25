import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Gift, ChevronDown, Award, Ticket, CheckCircle2, Lock, Heart, User, PhoneCall, ExternalLink, Flame, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { casinoAudio } from '../utils/audioEngine'
import { CoinShower } from '../components/animations/CoinShower'
import { Modal } from '../components/ui/Modal'
import { cn } from '../utils/cn'

interface LiveLoss {
  id: string
  name: string
  game: string
  amount: number
}

export const Inicio: React.FC = () => {
  const { 
    registered, 
    userName, 
    selectedPlan, 
    simulatedDay,
    streak,
    realMoneySaved,
    unclaimedDays,
    claimedToday,
    registerUser,
    claimDailyReward
  } = useStore()

  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [regName, setRegName] = useState('')
  const [regPlan, setRegPlan] = useState<'30' | '60' | 'unlimited'>('30')
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Floating shower animation coordinates
  const [showerTrigger, setShowerTrigger] = useState(false)
  const [showerCoords, setShowerCoords] = useState({ x: 0, y: 0 })
  const [claimedAlert, setClaimedAlert] = useState<number | null>(null)

  // Live losses simulated feed
  const [liveLosses, setLiveLosses] = useState<LiveLoss[]>([
    { id: '1', name: 'Carlos B.', game: 'TIGRE', amount: 527.15 },
    { id: '2', name: 'Tigresa', game: 'TIGRE', amount: 261.14 },
    { id: '3', name: 'User_007', game: 'CRASH', amount: 381.87 },
    { id: '4', name: 'Tigresa', game: 'CRASH', amount: 343.03 },
    { id: '5', name: 'João_99', game: 'FUTEBOL', amount: 335.42 },
    { id: '6', name: 'Vini***', game: 'FUTEBOL', amount: 259.21 },
  ])

  // Custom Event Listener to open register modal from Header
  useEffect(() => {
    const openModal = () => {
      casinoAudio.playTick()
      setShowRegisterModal(true)
    }
    window.addEventListener('open-register-modal', openModal)
    return () => window.removeEventListener('open-register-modal', openModal)
  }, [])

  // Rotate live losses feed every 4 seconds to simulate active betting
  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Carlos B.', 'Tigresa', 'User_007', 'João_99', 'Vini***', 'Pedro_x', 'Ana.Silva', 'BetKiller', 'Dopamina99', 'Guga_Bet', 'Rafa***', 'Mel_A']
      const games = ['TIGRE', 'CRASH', 'FUTEBOL', 'DOUBLE', 'RODOVIÁRIA', 'ROLETINHA', 'MINES']
      
      const newLoss: LiveLoss = {
        id: String(Date.now()),
        name: names[Math.floor(Math.random() * names.length)],
        game: games[Math.floor(Math.random() * games.length)],
        amount: parseFloat((Math.random() * 800 + 40).toFixed(2))
      }

      setLiveLosses(prev => [newLoss, ...prev.slice(0, 5)])
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName.trim()) {
      alert('Por favor, informe seu nome.')
      return
    }
    if (!agreeTerms) {
      alert('Você deve aceitar os termos do protocolo de redução de danos.')
      return
    }

    casinoAudio.playWinMelody()
    registerUser(regName, regPlan)
    setShowRegisterModal(false)
  }

  const handleClaimReward = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (claimedToday) return
    
    // Calculate how much they will receive
    const multiplier = Math.min(3, unclaimedDays + 1)
    const payout = multiplier * 50

    casinoAudio.playWinMelody()
    setShowerCoords({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
    setShowerTrigger(true)

    claimDailyReward()
    setClaimedAlert(payout)
    
    setTimeout(() => {
      setClaimedAlert(null)
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
      q: 'Como funciona o Plano de Desmame?',
      a: 'À medida que os dias passam no plano contratado (30 ou 60 dias), o cérebro precisa se afastar dos gatilhos. Por isso, a plataforma reduz gradativamente o brilho, a saturação das cores e os efeitos sonoros até que o app fique totalmente cinza e silencioso no último dia, limpando os estímulos dopaminérgicos.'
    }
  ]

  let titleSub = "APOSTE NO ÚNICO"
  let titleMid = "MERCADO ONDE A"
  let titleBot = "VITÓRIA É VOCÊ"
  let descText = "A única Bet onde quebrar a banca não quebra a sua vida. Receba uma banca virtual todos os dias. Mate a fissura de apostar e descubra o que você estaria perdendo na vida real."

  if (registered) {
    titleSub = "BEM-VINDO DE VOLTA,"
    titleMid = userName ? userName.toUpperCase() : "VISITANTE"
    titleBot = "A BANCA É SUA"
    descText = "Mantenha seu protocolo clínico ativo. Utilize a simulação para esgotar o impulso sem comprometer sua vida financeira real."
  }

  return (
    <div className="space-y-8 text-center select-none pb-8">
      {/* Coin Shower Animation */}
      <CoinShower
        trigger={showerTrigger}
        startX={showerCoords.x}
        startY={showerCoords.y}
        targetId="header-balance-container"
        onCoinArrived={() => casinoAudio.playCoinChime()}
        onComplete={() => setShowerTrigger(false)}
      />

      {/* Hero Section (Print 1) */}
      <div className="relative py-8 px-4 flex flex-col items-center justify-center space-y-6 overflow-hidden">
        {/* Glowing aura background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-neon-green/5 blur-[90px]" />

        {/* Top nicotine badge */}
        <div className="inline-flex items-center gap-2 bg-black/90 border border-neon-green/20 rounded-full px-4 py-1.5 text-[9px] text-white font-black tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_rgba(0,255,60,0.8)]" />
          O ADESIVO DE NICOTINA DAS APOSTAS
        </div>

        {/* Title messages */}
        <div className="space-y-1 z-10 w-full flex flex-col items-center">
          <h1 className="font-bold leading-[1.1] uppercase text-white tracking-tight flex flex-col items-center w-full text-center px-2 font-display">
            <span className="whitespace-normal break-words" style={{ fontSize: 'clamp(1.8rem, 8vw, 3rem)' }}>{titleSub}</span>
            <span className="whitespace-normal break-words" style={{ fontSize: 'clamp(2rem, 9vw, 3.5rem)', textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>{titleMid}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-neon-green to-[#85ff7a] drop-shadow-[0_0_20px_rgba(57,255,20,0.5)] whitespace-normal mt-2" style={{ fontSize: 'clamp(2.2rem, 10vw, 4rem)' }}>
              {titleBot}
            </span>
          </h1>
        </div>

        {/* Paragraph description */}
        <p className="text-[11px] text-zinc-400 font-medium max-w-[92%] leading-relaxed z-10 mx-auto">
          {descText}
        </p>

        {/* Action Button: Register or claim bank */}
        {!registered ? (
          <button
            onClick={() => {
              casinoAudio.playTick()
              setShowRegisterModal(true)
            }}
            className="w-full max-w-[300px] py-4 bg-neon-green hover:bg-neon-green-glow text-black font-black text-sm uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,255,60,0.3)] hover:scale-[1.02]"
          >
            CADASTRAR
          </button>
        ) : (
          <div className="w-full flex flex-col items-center gap-3 z-10">
            <button
              onClick={handleClaimReward}
              disabled={claimedToday}
              className="w-full max-w-[300px] py-4 bg-transparent hover:bg-neon-green/5 border-2 border-neon-green rounded-xl text-neon-green font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(0,255,60,0.15)] hover:shadow-[0_0_25px_rgba(0,255,60,0.35)] disabled:opacity-50"
            >
              <Gift size={18} className="stroke-[2.5]" />
              {claimedToday 
                ? 'BANCA DIÁRIA RESGATADA!' 
                : `RESGATAR BANCA DIÁRIA (+R$ ${50 * (unclaimedDays + 1)},00)`}
            </button>
            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">
              Plano de Desmame: Dia {simulatedDay} de {selectedPlan === 'unlimited' ? '∞' : selectedPlan + ' Dias'}
            </span>
          </div>
        )}
      </div>

      {/* Floating claimed alert */}
      <AnimatePresence>
        {claimedAlert !== null && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#12161a] border border-neon-green/30 text-neon-green text-xs font-bold py-2.5 px-5 rounded-xl mx-auto max-w-xs shadow-lg shadow-black/80"
          >
            +R$ {claimedAlert},00 virtuais creditados na sua banca!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Como Funciona Section (Print 2) */}
      <div className="space-y-4 text-left">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 font-display">
          <Ticket size={18} className="text-neon-green -rotate-12 stroke-[2.2]" />
          COMO FUNCIONA (SEU BILHETE VIP)
        </h3>

        <div className="relative border-l border-zinc-800 pl-6 ml-4 space-y-4 pb-2">
          {/* Card 1 */}
          <div className="relative bg-[#12161a] border border-cyber-border rounded-xl p-4 flex gap-4">
            <div className="absolute top-1/2 -translate-y-1/2 -left-10 w-8 h-8 rounded-full border border-neon-green bg-zinc-950 flex items-center justify-center text-neon-green font-black text-xs">
              1
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-white uppercase">DEPÓSITO DIÁRIO GARANTIDO</h4>
              <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                Todo dia você ganha uma banca virtual renovada. Sem colocar 1 único centavo do seu bolso ou do limite do cartão.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative bg-[#12161a] border border-cyber-border rounded-xl p-4 flex gap-4">
            <div className="absolute top-1/2 -translate-y-1/2 -left-10 w-8 h-8 rounded-full border border-neon-green bg-zinc-950 flex items-center justify-center text-neon-green font-black text-xs">
              2
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-white uppercase">JOGUE PARA MATAR A VONTADE</h4>
              <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                Slots, Crash, Roleta. Os mesmos algoritmos, gráficos e a mesma emoção de girar. Pode arriscar tudo e torrar a banca.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative bg-[#12161a] border border-neon-green/30 rounded-xl p-4 flex gap-4">
            <div className="absolute top-1/2 -translate-y-1/2 -left-10 w-8 h-8 rounded-full border border-neon-green bg-zinc-950 flex items-center justify-center text-neon-green font-black text-xs glow-green">
              3
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-neon-green uppercase text-glow-green">O CHOQUE DE REALIDADE</h4>
              <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                Tomou RED? A gente te mostra na hora o que você acabou de <strong className="text-neon-green">SALVAR</strong> na vida real. A perda no jogo vira vitória na vida.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Choque de Realidade Section (Print 3) */}
      <div className="space-y-4 text-center">
        <div className="relative py-4 px-2 flex flex-col items-center justify-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#ff3344]/5 border border-neon-red/30 rounded-full px-4 py-1.5 text-[9px] text-white font-black tracking-widest uppercase">
            A TERAPIA NA PRÁTICA
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-wider font-display">
            O CHOQUE DE REALIDADE
          </h2>
          <p className="text-[10px] text-zinc-400 max-w-[85%] leading-relaxed font-medium">
            Transformamos as suas perdas virtuais na sua maior vitória financeira.
          </p>
        </div>

        {/* Box with Red outline */}
        <div className="border border-neon-red/30 bg-[#12161a]/40 rounded-2xl p-5 space-y-4 relative">
          {/* Row 1 */}
          <div className="flex items-center gap-3 justify-between">
            <div className="w-[110px] py-3 bg-[#ff3344]/10 border border-[#ff3344]/40 rounded-xl flex flex-col items-center justify-center leading-none">
              <span className="text-[7px] text-[#ff8a93] font-black uppercase">DEU RED</span>
              <span className="text-xs font-black text-white mt-1">-R$ 20</span>
            </div>
            <span className="text-zinc-500 font-black">→</span>
            <div className="flex-1 p-3 bg-emerald-950/20 border border-neon-green/30 rounded-xl text-left flex items-center justify-between text-neon-green text-[9.5px] font-black leading-tight">
              <span>Parabéns, você acabou de salvar 1 Cartela de Ovos e 2 litros de Leite. 🥚🥛</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-center gap-3 justify-between">
            <div className="w-[110px] py-3 bg-[#ff3344]/10 border border-[#ff3344]/40 rounded-xl flex flex-col items-center justify-center leading-none">
              <span className="text-[7px] text-[#ff8a93] font-black uppercase">ZEROU</span>
              <span className="text-xs font-black text-white mt-1">-R$ 150</span>
            </div>
            <span className="text-zinc-500 font-black">→</span>
            <div className="flex-1 p-3 bg-emerald-950/20 border border-neon-green/30 rounded-xl text-left flex items-center justify-between text-neon-green text-[9.5px] font-black leading-tight">
              <span>Ufa. Esse era o dinheiro da Conta de Luz do mês. Ela continua paga. 💡</span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-center gap-3 justify-between">
            <div className="w-[110px] py-3 bg-[#ff3344]/10 border border-[#ff3344]/40 rounded-xl flex flex-col items-center justify-center leading-none">
              <span className="text-[7px] text-[#ff8a93] font-black uppercase">TOMOU FUMO</span>
              <span className="text-xs font-black text-white mt-1">-R$ 500</span>
            </div>
            <span className="text-zinc-500 font-black">→</span>
            <div className="flex-1 p-3 bg-emerald-950/20 border border-neon-green/30 rounded-xl text-left flex items-center justify-between text-neon-green text-[9.5px] font-black leading-tight">
              <span>Sua compra do mês no supermercado tá garantida. Sua família agradece. Respira. 🛒</span>
            </div>
          </div>
        </div>
      </div>

      {/* Extrato de Green Real Section (Print 4) */}
      <div className="space-y-3.5 text-left">
        <div className="flex justify-between items-end pb-1 border-b border-cyber-border">
          <h3 className="text-base font-black text-white uppercase tracking-wider font-display">
            EXTRATO DE GREEN REAL
          </h3>
          <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest pb-0.5">
            SEU PAINEL DE R.D.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Card Clean Days */}
          <Card className="p-4 bg-[#12161a] border-neon-green/10 relative overflow-hidden flex flex-col justify-between h-28">
            <div className="absolute bottom-1 right-1 text-orange-500/10 opacity-10 pointer-events-none">
              <Flame size={64} className="stroke-[1.5]" />
            </div>
            <span className="text-[8px] text-zinc-400 font-black uppercase tracking-widest block leading-none">
              DIAS LIMPOS (STREAK)
            </span>
            <div className="flex items-baseline gap-1 mt-2 mb-1">
              <span className="text-3xl font-black text-white tabular-nums leading-none">{streak}</span>
              <span className="text-[10px] text-zinc-400 font-black uppercase">Dias</span>
            </div>
            <div className="inline-flex max-w-[120px] bg-emerald-950/40 border border-neon-green/20 rounded-md px-2 py-1 text-[8px] text-neon-green font-black uppercase select-none">
              Usando só o Fake
            </div>
          </Card>

          {/* Card Protected Money */}
          <Card className="p-4 bg-[#12161a] border-neon-green/10 relative overflow-hidden flex flex-col justify-between h-28">
            <div className="absolute bottom-1 right-1 text-neon-green/10 opacity-10 pointer-events-none">
              <Award size={64} className="stroke-[1.5]" />
            </div>
            <span className="text-[8px] text-zinc-400 font-black uppercase tracking-widest block leading-none">
              DINHEIRO PROTEGIDO
            </span>
            <div className="flex items-baseline gap-0.5 mt-2 mb-1 leading-none">
              <span className="text-neon-green font-black text-sm mr-0.5">R$</span>
              <span className="text-2xl font-black text-white tabular-nums">{realMoneySaved.toFixed(2).replace('.', ',')}</span>
            </div>
            <span className="text-[8px] text-zinc-500 font-black uppercase">
              Que não foram pro lixo
            </span>
          </Card>
        </div>
      </div>

      {/* Comunidade de Vencedores (Testimonials) */}
      <div className="space-y-4 text-left">
        <div className="flex justify-between items-end pb-1 border-b border-cyber-border">
          <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
            <MessageSquare size={16} className="text-neon-green stroke-[2.2]" />
            Comunidade de Vencedores
          </h3>
          <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest pb-0.5">
            Depoimentos
          </span>
        </div>

        <div className="bg-[#0b141a] rounded-2xl p-4 border border-zinc-800/40 flex flex-col gap-4">
          <div className="flex flex-col gap-1 items-start w-full pr-8">
            <span className="text-[9px] text-zinc-500 ml-1">Anônimo • Há 2 dias</span>
            <div className="bg-[#202c33] text-white text-xs p-3 rounded-2xl rounded-tl-none leading-relaxed shadow-sm">
              Deu uma fissura louca na sexta à noite. Abri a plataforma, torrei os R$ 200 da banca fake em 10 minutos. Quando a tela mostrou que eu teria perdido o dinheiro da fralda do meu moleque, eu chorei. Obrigado por esse app. 🙏
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end w-full pl-8">
            <span className="text-[9px] text-zinc-500 mr-1">João M. • Hoje</span>
            <div className="bg-[#005c4b] text-white text-xs p-3 rounded-2xl rounded-tr-none leading-relaxed shadow-sm">
              Jogar sem o peso de perder o meu salário no dia 5 me tirou a ansiedade que eu sentia no peito. Já tô há 20 dias sem depositar 1 real nas bets reais. O adesivo de nicotina funcionou kkkk 🛡️
            </div>
          </div>
        </div>
      </div>

      {/* Perdas ao Vivo Section (Print 5) */}
      <div className="space-y-3.5 text-left">
        <div className="flex justify-between items-end pb-1 border-b border-cyber-border">
          <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Heart size={16} className="text-neon-red stroke-[2.2] animate-pulse" />
            PERDAS AO VIVO
          </h3>
          <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest pb-0.5">
            A REALIDADE NUA E CRUA
          </span>
        </div>

        {/* Live Loss Table */}
        <div className="bg-[#12161a] border border-cyber-border rounded-xl overflow-hidden divide-y divide-cyber-border">
          <div className="grid grid-cols-3 px-4 py-2 bg-zinc-950/40 text-[8px] text-zinc-500 font-black uppercase tracking-widest">
            <span>JOGADOR</span>
            <span>JOGO</span>
            <span className="text-right">PREJUÍZO REAL</span>
          </div>

          <div className="divide-y divide-cyber-border/40 min-h-[220px]">
            <AnimatePresence initial={false}>
              {liveLosses.map((loss) => (
                <motion.div
                  key={loss.id}
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 10 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-3 px-4 py-3 items-center text-[10px]"
                >
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <User size={12} className="text-zinc-500 stroke-[2]" />
                    <span>{loss.name}</span>
                  </div>
                  <span className="text-zinc-400 font-black text-[9px]">{loss.game}</span>
                  <span className="text-neon-red font-black text-right tabular-nums">
                    - R$ {loss.amount.toFixed(2).replace('.', ',')}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Autoexclusão Oficial Section (Print 6) */}
      <div className="text-left bg-[#12161a] border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden space-y-4">
        {/* Recommended tag */}
        <div className="absolute top-0 right-0 bg-[#2563eb] text-white font-black text-[7px] tracking-widest px-3 py-1.5 uppercase rounded-bl-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block mr-1.5 animate-ping" />
          RECOMENDADO
        </div>

        <div className="flex items-center gap-2 text-[#2563eb]">
          <Lock size={20} className="stroke-[2.5]" />
          <h3 className="text-base font-black text-white uppercase tracking-wider font-display">
            AUTOEXCLUSÃO OFICIAL
          </h3>
        </div>

        <span className="text-[10px] text-[#2563eb] font-black uppercase tracking-wider block -mt-2 leading-none">
          GOVERNO FEDERAL (SPA-MF)
        </span>

        <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
          Sistema centralizado do Ministério da Fazenda para bloquear seu acesso a <strong className="text-white">todas as casas de apostas autorizadas</strong> por no mínimo 1 mês.
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-zinc-300">
            <CheckCircle2 size={15} className="text-[#2563eb] stroke-[2.5] shrink-0" />
            <span className="text-[10px] font-medium leading-tight">Acesse usando sua conta <strong className="text-white">Gov.br</strong> (nível prata ou ouro).</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-300">
            <CheckCircle2 size={15} className="text-[#2563eb] stroke-[2.5] shrink-0" />
            <span className="text-[10px] font-medium leading-tight">Bloqueio nacional e imediato para proteger seu bem-estar.</span>
          </div>
        </div>

        <a
          href="https://www.gov.br/fazenda/pt-br/assuntos/premios-e-sorteios/autoexclusao"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => casinoAudio.playTick()}
          className="w-full py-3.5 bg-transparent border border-blue-500/50 hover:bg-blue-950/20 text-[#3b82f6] font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
        >
          ACESSAR PORTAL GOV.BR
          <ExternalLink size={14} className="stroke-[2.5]" />
        </a>
      </div>

      {/* Ajuda Real Section (Print 7) */}
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-black text-white uppercase tracking-wider font-display select-none">
          PRECISA DE AJUDA REAL?
        </h2>
        <p className="text-[10px] text-zinc-400 max-w-[90%] leading-relaxed font-medium mx-auto">
          O vício em apostas é uma doença reconhecida (Ludopatia). Esta plataforma é uma ferramenta de redução de danos e não substitui acompanhamento psicológico ou psiquiátrico.
        </p>

        <div className="flex flex-col gap-2.5 text-left">
          {/* Jogadores Anônimos */}
          <a
            href="https://www.jogadoresanonimos.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => casinoAudio.playTick()}
            className="flex items-center gap-3 p-3.5 bg-[#12161a] hover:bg-zinc-800 border border-cyber-border rounded-xl transition-all group"
          >
            <User size={16} className="text-zinc-400 group-hover:text-neon-green transition-colors stroke-[2.2]" />
            <span className="text-[10px] font-black text-white uppercase tracking-wider">Jogadores Anônimos (J.A.)</span>
          </a>

          {/* Ouvidoria SUS */}
          <a
            href="tel:136"
            onClick={() => casinoAudio.playTick()}
            className="flex items-center gap-3 p-3.5 bg-[#12161a] hover:bg-zinc-800 border border-cyber-border rounded-xl transition-all group"
          >
            <PhoneCall size={16} className="text-zinc-400 group-hover:text-neon-green transition-colors stroke-[2.2]" />
            <span className="text-[10px] font-black text-white uppercase tracking-wider">Ouvidoria SUS - Disque 136</span>
          </a>

          {/* CVV */}
          <a
            href="tel:188"
            onClick={() => casinoAudio.playTick()}
            className="flex items-center gap-3 p-3.5 bg-[#12161a] hover:bg-zinc-800 border border-cyber-border rounded-xl transition-all group"
          >
            <PhoneCall size={16} className="text-zinc-400 group-hover:text-neon-green transition-colors stroke-[2.2]" />
            <span className="text-[10px] font-black text-white uppercase tracking-wider">CVV - Ligue 188</span>
          </a>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-2 text-left">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
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
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-zinc-800/10 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black text-zinc-200 font-sans uppercase tracking-wide">{item.q}</span>
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
                      <div className="px-4 py-3.5 text-[11px] text-zinc-400 leading-relaxed border-t border-cyber-border/40 font-medium">
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

      {/* Registration Modal Dialog */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="ATIVAR SEU BILHETE VIP"
        accentColor="green"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">
              Seu Nome de Jogador
            </label>
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Digite seu nome ou apelido"
              className="w-full bg-zinc-950 border border-cyber-border rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-700 focus:border-neon-green focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">
              Escolha seu Protocolo de Desmame
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  casinoAudio.playTick()
                  setRegPlan('30')
                }}
                className={cn(
                  "py-3 rounded-xl border text-[10px] font-black uppercase transition-all cursor-pointer flex flex-col items-center justify-center leading-none",
                  regPlan === '30' ? 'bg-neon-green text-black border-neon-green shadow-md shadow-neon-green/10' : 'bg-zinc-950 border-cyber-border text-zinc-400'
                )}
              >
                <span>30 Dias</span>
                <span className="text-[7px] opacity-70 mt-1">Desmame Rápido</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  casinoAudio.playTick()
                  setRegPlan('60')
                }}
                className={cn(
                  "py-3 rounded-xl border text-[10px] font-black uppercase transition-all cursor-pointer flex flex-col items-center justify-center leading-none",
                  regPlan === '60' ? 'bg-neon-green text-black border-neon-green shadow-md shadow-neon-green/10' : 'bg-zinc-950 border-cyber-border text-zinc-400'
                )}
              >
                <span>60 Dias</span>
                <span className="text-[7px] opacity-70 mt-1">Desmame Suave</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  casinoAudio.playTick()
                  setRegPlan('unlimited')
                }}
                className={cn(
                  "py-3 rounded-xl border text-[10px] font-black uppercase transition-all cursor-pointer flex flex-col items-center justify-center leading-none",
                  regPlan === 'unlimited' ? 'bg-neon-green text-black border-neon-green shadow-md shadow-neon-green/10' : 'bg-zinc-950 border-cyber-border text-zinc-400'
                )}
              >
                <span>Sem Limite</span>
                <span className="text-[7px] opacity-70 mt-1">Livre / Falso</span>
              </button>
            </div>
          </div>

          <div className="bg-zinc-950 border border-cyber-border p-3 rounded-xl space-y-1.5 text-[9.5px] leading-relaxed text-zinc-400 font-medium">
            <p className="text-white font-black uppercase block">💡 Regra do Saldo Diário:</p>
            <p>
              • Você receberá **R$ 50,00 virtuais** diariamente na sua conta.
            </p>
            <p>
              • Se você ficar dias sem acessar, o saldo **acumula por até 3 dias (máximo de R$ 150,00)**.
            </p>
            <p>
              • Use a banca virtual para matar a vontade nos jogos com risco zero.
            </p>
          </div>

          <div className="flex items-start gap-2.5 pt-1.5">
            <input
              type="checkbox"
              id="agree-checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-cyber-border text-neon-green focus:ring-neon-green"
            />
            <label htmlFor="agree-checkbox" className="text-[9.5px] text-zinc-500 font-medium leading-tight cursor-pointer">
              Eu concordo em seguir este protocolo clínico e entendo que esta banca é 100% virtual, sem valor monetário real.
            </label>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-neon-green hover:bg-neon-green-glow text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[0_4px_15px_rgba(0,255,60,0.2)]"
            >
              ATIVAR MEU BILHETE VIP
            </button>
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="w-full py-3 bg-zinc-900 border border-cyber-border hover:bg-zinc-800 text-zinc-400 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
