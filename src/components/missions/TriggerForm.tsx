import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import { HeartPulse, Send, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export const TriggerForm: React.FC = () => {
  const { addEmotionalLog } = useStore()
  const [mood, setMood] = useState<'ancioso' | 'tedio' | 'estressado' | 'impulso' | 'calmo' | 'triste'>('calmo')
  const [intensity, setIntensity] = useState<number>(3)
  const [trigger, setTrigger] = useState('')
  const [notes, setNotes] = useState('')
  const [logSubmitted, setLogSubmitted] = useState(false)

  const handleDiarySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trigger.trim()) return

    addEmotionalLog({
      mood,
      intensity,
      trigger,
      notes
    })

    setLogSubmitted(true)
    setTimeout(() => {
      setLogSubmitted(false)
      setTrigger('')
      setNotes('')
    }, 3000)
  }

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2 text-neon-green">
        <HeartPulse size={20} className="text-glow-green" />
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
          Diário Terapêutico (Registrar Gatilho)
        </h3>
      </div>

      <form onSubmit={handleDiarySubmit} className="space-y-3.5">
        {/* Mood Grid Selection */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide">
            Como você está se sentindo agora?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'calmo', label: 'Calmo', bg: 'hover:border-emerald-500/40 text-emerald-400' },
              { id: 'tedio', label: 'Tédio', bg: 'hover:border-blue-500/40 text-blue-400' },
              { id: 'ancioso', label: 'Ansioso', bg: 'hover:border-yellow-500/40 text-yellow-400' },
              { id: 'estressado', label: 'Estressado', bg: 'hover:border-purple-500/40 text-purple-400' },
              { id: 'impulso', label: 'Impulso', bg: 'hover:border-red-500/40 text-red-500' },
              { id: 'triste', label: 'Triste', bg: 'hover:border-zinc-500/40 text-zinc-400' }
            ].map((item) => (
              <label 
                key={item.id}
                className={`flex items-center justify-center p-2 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                  mood === item.id 
                    ? 'bg-zinc-800 border-zinc-500 font-extrabold ring-1 ring-zinc-700' 
                    : 'bg-zinc-950 border-cyber-border'
                } ${item.bg}`}
              >
                <input
                  type="radio"
                  name="mood"
                  value={item.id}
                  checked={mood === item.id}
                  onChange={() => setMood(item.id as any)}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* Intensity range slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide">
              Intensidade da Vontade de Apostar
            </label>
            <span className="text-xs font-extrabold text-neon-green tabular-nums">
              {intensity} / 5
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full accent-neon-green bg-zinc-950 rounded-lg cursor-pointer h-2 border border-cyber-border"
          />
        </div>

        {/* Trigger input */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide">
            Qual foi o gatilho gerador do desejo?
          </label>
          <input
            type="text"
            required
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            placeholder="Ex: Vi propaganda no Instagram, tédio à noite, estresse financeiro..."
            className="w-full bg-zinc-950 border border-cyber-border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-neon-green transition-all"
          />
        </div>

        {/* Reflexive therapeutic notes */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide">
            Notas Terapêuticas (O que planeja fazer para contornar?)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Vou ligar para o meu padrinho de apoio, fazer o exercício SOS de respiração ou ir dormir..."
            rows={2}
            className="w-full bg-zinc-950 border border-cyber-border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-neon-green transition-all resize-none"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          glow
          className="w-full"
        >
          <Send size={12} />
          Salvar Registro no Diário
        </Button>
      </form>

      <AnimatePresence>
        {logSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="w-12 h-12 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 mb-2">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Registro Salvo!</h4>
            <p className="text-[10px] text-zinc-400 max-w-[80%] mt-1">
              Muito bem! Registrar o que gera a compulsão é o primeiro passo para quebrá-la. Você ganhou +30 XP.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
