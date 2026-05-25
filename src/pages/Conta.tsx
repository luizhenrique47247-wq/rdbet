import React from 'react'
import { useStore } from '../store/useStore'
import { 
  User, PhoneCall, Shield, EyeOff, 
  Pencil, Flame, Activity, BookOpen,
  Sparkles, RefreshCw
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { BreathingBox } from '../components/ui/BreathingBox'
import { cn } from '../utils/cn'
import { formatCooldownTime } from '../utils/time'
import { casinoAudio } from '../utils/audioEngine'
import { motion } from 'framer-motion'
export const Conta: React.FC = () => {
  const { 
    streak, 
    modoCritico, 
    toggleModoCritico, 
    cooldownActive, 
    cooldownTimeLeft, 
    setCooldown, 
    resetStats,
    realMoneySaved,
    registered,
    selectedPlan,
    simulatedDay,
    advanceDay
  } = useStore()

  const handleSetCooldown = (hours: number) => {
    casinoAudio.playWarning()
    setCooldown(hours * 3600)
  }

  const handleReset = () => {
    casinoAudio.playWarning()
    if (window.confirm("Atenção: Isso irá reiniciar todos os seus dados fictícios, estatísticas de salvamento e diários emocionais. Deseja prosseguir?")) {
      resetStats()
      alert("Dados reiniciados com sucesso!")
    }
  }

  const handleToggleCritico = () => {
    casinoAudio.playTick()
    toggleModoCritico()
  }

  return (
    <div className="space-y-6 text-center">
      {/* Premium Avatar Layout (Circular green orbit + intersecting rotating dot) */}
      <div className="relative py-4 select-none">
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          {/* Inner orbit line */}
          <div className="absolute w-24 h-24 rounded-full border border-neon-green/20" />
          
          {/* Outer orbit line with rotating green dot */}
          <motion.div 
            className="absolute w-28 h-28 rounded-full border border-neon-green/30"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
          >
            <div className="absolute top-1.5 right-2 w-3.5 h-3.5 bg-neon-green rounded-full shadow-[0_0_12px_rgba(0,255,60,0.9)] glow-green" />
          </motion.div>
          
          {/* Inner avatar background */}
          <div className="w-20 h-20 bg-[#12161a] border border-cyber-border rounded-full flex items-center justify-center text-zinc-300">
            <User size={36} className="stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Profile Header Title */}
      <div className="space-y-3 select-none">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider font-display">
          USUÁRIO VIP
        </h2>
        
        <button
          onClick={() => {
            casinoAudio.playTick()
            alert("Recurso de edição de perfil fictício.")
          }}
          className="mx-auto px-4 py-2 border border-zinc-800 hover:border-zinc-700 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Pencil size={12} />
          EDITAR PERFIL
        </button>
      </div>

      {/* Side-by-side stats widget cards */}
      <div className="grid grid-cols-2 gap-3.5 text-left">
        {/* Left: Dias Limpos */}
        <Card 
          onClick={() => casinoAudio.playTick()}
          className="p-4 bg-[#12161a] border-cyber-border relative overflow-hidden flex flex-col justify-between h-24 cursor-pointer hover:border-zinc-800 transition-all"
        >
          <div className="absolute bottom-1 right-1 text-orange-500/10 opacity-30 select-none pointer-events-none">
            <Flame size={56} className="stroke-[1.5]" />
          </div>
          <span className="text-[9px] text-[#ff8000] font-black uppercase tracking-widest block select-none">
            DIAS LIMPOS
          </span>
          <span className="text-3xl font-black text-white tabular-nums leading-none mb-1">
            {streak}
          </span>
        </Card>

        {/* Right: Protegido */}
        <Card 
          onClick={() => casinoAudio.playTick()}
          className="p-4 bg-[#12161a] border-cyber-border relative overflow-hidden flex flex-col justify-between h-24 cursor-pointer hover:border-zinc-800 transition-all"
        >
          <div className="absolute bottom-1 right-1 text-neon-green/10 opacity-30 select-none pointer-events-none">
            <Shield size={56} className="stroke-[1.5]" />
          </div>
          <span className="text-[9px] text-neon-green font-black uppercase tracking-widest block select-none">
            PROTEGIDO
          </span>
          <span className="text-2xl font-black text-neon-green text-glow-green tabular-nums leading-none mb-1">
            R$ {realMoneySaved.toFixed(2).replace('.', ',')}
          </span>
        </Card>
      </div>

      {/* Two Large Action Buttons */}
      <div className="space-y-3 z-10 relative">
        <button
          onClick={() => {
            casinoAudio.playWarning()
            alert("Acessando extrato real - lembre-se: cada perda virtual evitada é dinheiro no seu bolso real!")
          }}
          className="w-full py-4 bg-neon-red hover:bg-neon-red-glow text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_4px_15px_rgba(255,51,68,0.2)]"
        >
          <Activity size={16} />
          ACESSAR EXTRATO REAL
        </button>

        <button
          onClick={() => {
            casinoAudio.playTick()
            alert("Abrindo Guia de Ajuda S.O.S. com links úteis de acolhimento.")
          }}
          className="w-full py-4 bg-transparent hover:bg-zinc-800/10 border border-zinc-800 text-zinc-300 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2.5"
        >
          <BookOpen size={16} />
          GUIA DE AJUDA S.O.S
        </button>
      </div>

      {/* Cooldown control card */}
      <Card className="p-5 space-y-4 text-left bg-[#12161a]">
        <div className="flex items-center gap-2 text-neon-red select-none">
          <Shield size={18} className={!modoCritico ? "text-glow-red" : ""} />
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-display">
            Bloqueio de Impulsividade (Autoexclusão)
          </h3>
        </div>

        {cooldownActive ? (
          <div className="bg-zinc-950 border border-red-950/60 p-4 rounded-xl text-center space-y-2">
            <span className="text-[9px] text-red-400 font-black uppercase tracking-widest block select-none">
              Simuladores Bloqueados
            </span>
            <div className="text-2xl font-black text-white tracking-widest tabular-nums text-glow-red">
              {formatCooldownTime(cooldownTimeLeft)}
            </div>
            <p className="text-[9px] text-zinc-400 font-medium">
              O acesso aos simuladores está desativado para te afastar do gatilho e resfriar a impulsividade. Use este tempo para respirar e descansar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
              Se você está sentindo uma fissura intensa, ative um temporizador abaixo. Isso bloqueará o acesso a todos os simuladores da RDBET pelo período selecionado.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => handleSetCooldown(1)}
                variant="secondary"
                size="sm"
              >
                1 Hora
              </Button>
              <Button
                onClick={() => handleSetCooldown(6)}
                variant="secondary"
                size="sm"
              >
                6 Horas
              </Button>
              <Button
                onClick={() => handleSetCooldown(24)}
                variant="secondary"
                size="sm"
              >
                24 Horas
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Saturation and Plan Desmame debug card */}
      {registered && (
        <Card className="p-5 space-y-4 text-left bg-[#12161a] border border-cyber-border">
          <div className="flex items-center gap-2 text-neon-green select-none">
            <Sparkles size={18} className="text-glow-green" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-display">
              Desmame de Estímulos (Dopamina)
            </h3>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
              À medida que os dias passam em seu plano, a RDBET reduz as cores neon (saturação CSS) e o volume de sons sintéticos para dessensibilizar seu cérebro de picos fáceis de excitação.
            </p>

            <div className="bg-zinc-950 border border-cyber-border p-3 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500 font-extrabold uppercase">Plano Selecionado</span>
                <span className="text-white font-extrabold uppercase">
                  {selectedPlan === '30' && 'Redução 30 Dias'}
                  {selectedPlan === '60' && 'Redução 60 Dias'}
                  {selectedPlan === 'unlimited' && 'Sem Limite (Fixo)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500 font-extrabold uppercase">Dia do Processo</span>
                <span className="text-white font-black">
                  Dia {simulatedDay} {selectedPlan !== 'unlimited' && `de ${selectedPlan}`}
                </span>
              </div>

              {selectedPlan !== 'unlimited' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] text-zinc-500">
                    <span>Saturação Visual</span>
                    <span className="font-bold text-neon-green">
                      {Math.round((selectedPlan === '30' ? Math.max(0, 1 - (simulatedDay - 1) / 30) : Math.max(0, 1 - (simulatedDay - 1) / 60)) * 100)}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neon-green transition-all duration-300"
                      style={{ 
                        width: `${Math.round((selectedPlan === '30' ? Math.max(0, 1 - (simulatedDay - 1) / 30) : Math.max(0, 1 - (simulatedDay - 1) / 60)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => {
                casinoAudio.playTick()
                advanceDay()
              }}
              variant="primary"
              glow
              className="w-full text-xs font-black py-3.5"
            >
              <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
              Simular Avanço de Dia (+1 Dia)
            </Button>
          </div>
        </Card>
      )}

      {/* Guided breathing box */}
      <div className="text-left">
        <BreathingBox />
      </div>

      {/* Reset progress and settings */}
      <Card className="p-5 space-y-3.5 text-left bg-[#12161a]">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neon-yellow select-none">
              <EyeOff size={18} className={!modoCritico ? "text-glow-yellow" : ""} />
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-display">
                Modo Crítico (Redutor de Estímulos)
              </h3>
            </div>
            <p className="text-[10px] text-zinc-400 max-w-[85%] leading-relaxed font-medium">
              Desliga as cores neon piscantes, reduz brilhos e remove transições dinâmicas. Ideal para momentos em que o cérebro procura excitação visual.
            </p>
          </div>

          <button
            onClick={handleToggleCritico}
            className={cn(
              "w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative shrink-0",
              modoCritico ? "bg-zinc-700" : "bg-[#00ff3c]"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 bg-black rounded-full shadow-md transform transition-transform duration-200",
                modoCritico ? "translate-x-0" : "translate-x-5"
              )}
            />
          </button>
        </div>
      </Card>

      {/* Support hotlines */}
      <Card className="p-5 space-y-3.5 text-left bg-[#12161a]">
        <div className="flex items-center gap-2 text-neon-red select-none">
          <PhoneCall size={18} className="text-glow-red" />
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-display">
            Rede de Apoio e Emergência (SOS)
          </h3>
        </div>

        <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
          Você não está sozinho nessa jornada. Em momentos de fissura incontrolável ou desespero, entre em contato imediatamente com canais de ajuda especializados:
        </p>

        <div className="space-y-2.5">
          <a
            href="tel:188"
            onClick={() => casinoAudio.playTick()}
            className="flex items-center justify-between p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl group transition-all"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-black text-white group-hover:text-neon-red transition-colors">
                CVV - Centro de Valorização da Vida
              </span>
              <p className="text-[9px] text-zinc-500 font-medium">Atendimento telefônico gratuito e sigiloso 24 horas.</p>
            </div>
            <span className="text-xs font-black text-neon-red text-glow-red bg-red-950/20 px-2.5 py-1 rounded-lg border border-red-500/20 select-none">
              Ligue 188
            </span>
          </a>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
            <span className="text-xs font-black text-white">CAPS (Rede Pública de Saúde)</span>
            <p className="text-[9px] text-zinc-500 font-medium">
              O SUS oferece tratamento especializado e gratuito para ludopatia e vícios. Procure a unidade CAPS Ad (Álcool e Drogas/Transtornos) mais próxima de sua casa.
            </p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-cyber-border flex justify-between items-center text-zinc-500 text-[10px]">
          <span>Reset de progresso local:</span>
          <button
            onClick={handleReset}
            className="px-2.5 py-1 border border-zinc-800 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Resetar
          </button>
        </div>
      </Card>
    </div>
  )
}
