import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ArrowRight, Save, Lock } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Button } from './Button'
import { casinoAudio } from '../../utils/audioEngine'

export const MapeamentoMomentoModal: React.FC = () => {
  const { 
    isMentalMappingOpen, 
    setMentalMappingOpen, 
    addEmotionalLog, 
    mappingStage, 
    setMappingStage, 
    completeStage 
  } = useStore()

  const [step, setStep] = useState(1)
  const [mood, setMood] = useState<'ansioso' | 'tedio' | 'estressado' | 'impulso' | 'calmo' | 'triste'>('ansioso')
  const [intensity, setIntensity] = useState<number>(5)
  const [trigger, setTrigger] = useState('')

  // Reset steps and values when modal opens
  useEffect(() => {
    if (isMentalMappingOpen) {
      setStep(1)
      setMood('ansioso')
      setIntensity(5)
      setTrigger('')
    }
  }, [isMentalMappingOpen])

  // Disable body scroll when mapping modal is open
  useEffect(() => {
    if (isMentalMappingOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isMentalMappingOpen])

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    casinoAudio.playTick()
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trigger.trim()) return

    casinoAudio.playWinMelody()

    // Determine the save behavior depending on the stage
    if (mappingStage === 'inicial' || mappingStage === null) {
      // Automatic interrupter mapping
      addEmotionalLog({
        mood,
        intensity,
        trigger,
        notes: 'Mapeamento automático disparado após as 3 primeiras apostas.'
      })
    } else {
      // Manual clinical stage mapping (Antes, Durante, Depois)
      completeStage(mappingStage, mood, intensity, trigger)
    }

    // Close the modal
    setMentalMappingOpen(false)
    setMappingStage(null)
  }

  // Get question text for step 2 depending on the stage
  const getQuestionText = () => {
    if (mappingStage === 'antes') return 'O que te levou a abrir o app?'
    if (mappingStage === 'durante') return 'O que você está sentindo enquanto joga?'
    if (mappingStage === 'depois') return 'Como se sente ao terminar a jogada?'
    return 'O que fez você querer jogar neste momento?'
  }

  return createPortal(
    <AnimatePresence>
      {isMentalMappingOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#0a0d10] border-2 border-neon-green/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,255,60,0.15)] relative overflow-hidden text-white my-8"
          >
            {/* Header branding decorative line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-neon-green via-emerald-400 to-neon-green" />

            {/* Shield indicator */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-neon-green">
                <Brain size={24} className="animate-bounce" />
                <span className="text-xs font-black tracking-widest uppercase">Mapeamento Clínico</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1 text-[9px] text-zinc-400 font-extrabold uppercase">
                <Lock size={10} className="text-neon-green" />
                Passo {step} de 2
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1 mb-5">
              <h2 className="text-xl font-black uppercase text-white font-display">Mapeamento do Momento</h2>
              <p className="text-[10px] text-zinc-400 font-medium">
                {step === 1 
                  ? 'Avalie seu humor e nível de urgência emocional antes de prosseguir.' 
                  : 'Identifique os gatilhos externos ou internos para o seu prontuário Psi.'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleNextStep}
                  className="space-y-4"
                >
                  {/* Mood Grid Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-neon-green font-black uppercase tracking-widest block">
                      Como você está se sentindo agora?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'calmo', label: 'Calmo', border: 'hover:border-emerald-500/40 text-emerald-400' },
                        { id: 'tedio', label: 'Tédio', border: 'hover:border-blue-500/40 text-blue-400' },
                        { id: 'ansioso', label: 'Ansioso', border: 'hover:border-yellow-500/40 text-yellow-400' },
                        { id: 'estressado', label: 'Estressado', border: 'hover:border-purple-500/40 text-purple-400' },
                        { id: 'impulso', label: 'Impulso', border: 'hover:border-red-500/40 text-red-500' },
                        { id: 'triste', label: 'Triste', border: 'hover:border-zinc-500/40 text-zinc-400' }
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                            mood === item.id
                              ? 'bg-zinc-900 border-neon-green text-white font-black shadow-[0_0_10px_rgba(0,255,60,0.1)]'
                              : 'bg-[#12161a] border-zinc-800 text-zinc-400'
                          } ${item.border}`}
                        >
                          <input
                            type="radio"
                            name="modal-mood"
                            value={item.id}
                            checked={mood === item.id}
                            onChange={() => {
                              casinoAudio.playTick()
                              setMood(item.id as any)
                            }}
                            className="sr-only"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Intensity Slider */}
                  <div className="space-y-2 bg-[#12161a] p-4 rounded-xl border border-zinc-800/80">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-neon-green font-black uppercase tracking-widest">
                        Termômetro de Urgência
                      </label>
                      <span className="text-sm font-black text-neon-green tabular-nums">
                        {intensity} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={intensity}
                      onChange={(e) => {
                        casinoAudio.playTick()
                        setIntensity(parseInt(e.target.value))
                      }}
                      className="w-full accent-neon-green bg-zinc-950 rounded-lg cursor-pointer h-2 border border-zinc-800"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-500 font-extrabold uppercase mt-1">
                      <span>0 - Sem vontade</span>
                      <span>5 - Moderada</span>
                      <span>10 - Compulsão</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    glow
                    className="w-full py-4 text-xs font-black uppercase tracking-widest shadow-[0_4px_15px_rgba(0,255,60,0.2)]"
                  >
                    Avançar <ArrowRight size={14} className="stroke-[2.5]" />
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Text Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-neon-green font-black uppercase tracking-widest">
                      {getQuestionText()}
                    </label>
                    <textarea
                      required
                      value={trigger}
                      onChange={(e) => setTrigger(e.target.value)}
                      placeholder="Descreva o que motivou ou o que está sentindo agora..."
                      rows={4}
                      className="w-full bg-[#12161a] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-neon-green transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        casinoAudio.playTick()
                        setStep(1)
                      }}
                      className="w-1/3 py-4 text-xs font-black uppercase tracking-widest"
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      glow
                      className="w-2/3 py-4 text-xs font-black uppercase tracking-widest shadow-[0_4px_15px_rgba(0,255,60,0.2)]"
                    >
                      Salvar <Save size={14} className="stroke-[2.5]" />
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
