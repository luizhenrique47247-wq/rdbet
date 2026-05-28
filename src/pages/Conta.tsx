import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '../store/useStore'
import { 
  Shield, Flame, BookOpen, ClipboardList, Activity, Pencil
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { cn } from '../utils/cn'
import { casinoAudio } from '../utils/audioEngine'
import { motion, AnimatePresence } from 'framer-motion'

const avatars = [
  { id: '1', emoji: '🛡️', label: 'Guardião' },
  { id: '2', emoji: '🧠', label: 'Equilíbrio' },
  { id: '3', emoji: '🧘', label: 'Zen' },
  { id: '4', emoji: '🍀', label: 'Racional' }
]

export const Conta: React.FC = () => {
  const { 
    streak, 
    realMoneySaved,
    simulatedMoneyLost,
    selectedPlan,
    simulatedDay,
    avatarId,
    setAvatarId,
    setUserName,
    setTab,
    activityHistory,
    userName,
    emotionalDiary
  } = useStore()

  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [newName, setNewName] = useState(userName)
  const [selectedAvatarId, setSelectedAvatarId] = useState(avatarId)
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({})

  // Sync state values when modal opens
  useEffect(() => {
    if (editProfileOpen) {
      setNewName(userName)
      setSelectedAvatarId(avatarId)
    }
  }, [editProfileOpen, userName, avatarId])

  // Reset failed image states if registration updates
  useEffect(() => {
    setFailedAvatars({})
  }, [avatarId])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    casinoAudio.playWinMelody()
    setUserName(newName.trim())
    setAvatarId(selectedAvatarId)
    setEditProfileOpen(false)
  }

  // Get current date formatted
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="space-y-6 text-center select-none pb-8 animate-fade-in max-w-md mx-auto">
      {/* Premium Avatar Layout (Circular green orbit + intersecting rotating dot) */}
      <div className="relative py-4">
        <div 
          onClick={() => {
            casinoAudio.playTick()
            setEditProfileOpen(true)
          }}
          className="relative w-28 h-28 mx-auto flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform"
        >
          {/* Inner orbit line */}
          <div className="absolute w-24 h-24 rounded-full border-2 border-neon-green" />
          
          {/* Outer orbit line with rotating green dot */}
          <motion.div 
            className="absolute w-28 h-28 rounded-full border border-neon-green/30"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
          >
            <div className="absolute top-1.5 right-2 w-3.5 h-3.5 bg-neon-green rounded-full shadow-[0_0_12px_rgba(0,255,60,0.9)] glow-green" />
          </motion.div>
          
          {/* Inner avatar background showing selected image */}
          <div className="w-20 h-20 bg-[#12161a] border border-cyber-border rounded-full flex items-center justify-center overflow-hidden">
            {!failedAvatars[avatarId] ? (
              <img 
                src={`${import.meta.env.BASE_URL}avatars/avatar${avatarId}.png`}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
                onError={() => setFailedAvatars(prev => ({ ...prev, [avatarId]: true }))}
              />
            ) : (
              <span className="text-3xl select-none">
                {avatars.find(a => a.id === avatarId)?.emoji || '🛡️'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Name & Edit Button */}
      <div className="space-y-3 flex flex-col items-center">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider font-display">
          {userName ? userName.toUpperCase() : "USUÁRIO VIP"}
        </h2>
        
        <button
          onClick={() => {
            casinoAudio.playTick()
            setEditProfileOpen(true)
          }}
          className="px-5 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/40 rounded-full text-[10px] font-black uppercase text-zinc-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Pencil size={11} className="text-zinc-500" />
          EDITAR PERFIL
        </button>
      </div>

      {/* Side-by-side stats widget cards */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Left: Dias Limpos */}
        <Card 
          className="p-5 border-red-500/20 bg-red-950/5 relative overflow-hidden flex flex-col items-center justify-center h-28 text-center"
        >
          <div className="absolute bottom-1 right-1 text-red-500/10 opacity-20 pointer-events-none">
            <Flame size={72} className="stroke-[1.5]" />
          </div>
          <span className="text-[10px] text-red-400 font-black uppercase tracking-widest block mb-2">
            DIAS LIMPOS
          </span>
          <span className="text-4xl font-black text-white tabular-nums leading-none">
            {streak}
          </span>
        </Card>

        {/* Right: Protegido */}
        <Card 
          className="p-5 border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden flex flex-col items-center justify-center h-28 text-center"
        >
          <div className="absolute bottom-1 right-1 text-emerald-500/10 opacity-20 pointer-events-none">
            <Shield size={72} className="stroke-[1.5]" />
          </div>
          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest block mb-2">
            PROTEGIDO
          </span>
          <div className="flex items-baseline justify-center leading-none">
            <span className="text-emerald-400 font-black text-base mr-1">R$</span>
            <span className="text-3xl font-black text-white tabular-nums">
              {realMoneySaved.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </Card>
      </div>

      {/* Vertical buttons stack */}
      <div className="flex flex-col gap-3.5 mt-6 w-full">
        {/* ACESSAR EXTRATO REAL */}
        <button
          onClick={() => {
            casinoAudio.playTick()
            setTab('extrato')
          }}
          className="w-full py-4 bg-[#ff3344] hover:bg-[#ff4d5a] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_4px_15px_rgba(255,51,68,0.3)] hover:scale-[1.01]"
        >
          <Activity size={16} className="stroke-[2.5]" />
          ACESSAR EXTRATO REAL
        </button>

        {/* GUIA DE AJUDA S.O.S */}
        <button
          onClick={() => {
            casinoAudio.playTick()
            alert("Abrindo Guia de Ajuda S.O.S. com links úteis de acolhimento.")
          }}
          className="w-full py-4 bg-[#12161a] border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 text-zinc-300 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2.5"
        >
          <BookOpen size={16} />
          GUIA DE AJUDA S.O.S
        </button>

        {/* DIÁRIO PRO PSI */}
        <button
          onClick={() => {
            casinoAudio.playTick()
            window.print()
          }}
          className="w-full py-4 bg-[#12161a] border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 text-zinc-300 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2.5"
        >
          <ClipboardList size={16} />
          DIÁRIO PRO PSI
        </button>
      </div>

      {/* PORTALED PRINT REPORT SHEET */}
      {createPortal(
        <div className="print-report-sheet hidden text-left bg-white text-black p-10 font-sans">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-900 pb-4 mb-6">
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-black">
              RDBET - PROTOCOLO CLÍNICO DE REDUÇÃO DE DANOS
            </h1>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mt-1">
              Prontuário e Histórico de Monitoramento de Ludopatia
            </h2>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="font-bold">Usuário: <span className="font-normal">{userName || 'Paciente Desconhecido'}</span></p>
              <p className="font-bold">Data de Emissão: <span className="font-normal">{currentDate}</span></p>
            </div>
            <div>
              <p className="font-bold">Plano de Redução: <span className="font-normal">{selectedPlan === 'unlimited' ? 'Ilimitado (Manutenção)' : `${selectedPlan} Dias`}</span></p>
              <p className="font-bold">Dia Clínico: <span className="font-normal">Dia {simulatedDay}</span></p>
            </div>
          </div>

          {/* Clinical stats summary */}
          <div className="grid grid-cols-3 gap-3 text-center mb-6">
            <div className="p-3 border border-gray-300 rounded bg-gray-50">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Sobriedade</span>
              <span className="text-xl font-extrabold">{streak} Dias Limpos</span>
            </div>
            <div className="p-3 border border-gray-300 rounded bg-gray-50">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Saldo Economizado</span>
              <span className="text-xl font-extrabold text-emerald-800">R$ {realMoneySaved.toFixed(2)}</span>
            </div>
            <div className="p-3 border border-gray-300 rounded bg-gray-50">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Simulação de Perdas</span>
              <span className="text-xl font-extrabold text-red-700">R$ {simulatedMoneyLost.toFixed(2)}</span>
            </div>
          </div>

          {/* Activities list */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider mb-2">
              Histórico de Registro de Atividades Recentes
            </h3>
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  <th className="w-1/4">Data / Hora</th>
                  <th className="w-1/4">Categoria</th>
                  <th className="w-2/4">Detalhes do Evento</th>
                </tr>
              </thead>
              <tbody>
                {activityHistory.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-400">Nenhum evento registrado</td>
                  </tr>
                ) : (
                  activityHistory.map((act) => (
                    <tr key={act.id}>
                      <td>{new Date(act.timestamp).toLocaleString('pt-BR')}</td>
                      <td className="font-bold">
                        {act.type === 'cadastro' && 'Cadastro'}
                        {act.type === 'gameplay' && 'Gameplay'}
                        {act.type === 'mapeamento' && 'Mapeamento'}
                        {act.type === 'checkin' && 'Checkin'}
                      </td>
                      <td>{act.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mapeamentos list */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider mb-2">
              Histórico do Mapeamento do Momento (Gatilhos e Reflexões)
            </h3>
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  <th className="w-1/5">Data / Hora</th>
                  <th className="w-1/5">Humor</th>
                  <th className="w-1/5">Intensidade</th>
                  <th className="w-2/5">Gatilhos / O que escreveu</th>
                </tr>
              </thead>
              <tbody>
                {emotionalDiary.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-400">Nenhum mapeamento voluntário registrado</td>
                  </tr>
                ) : (
                  emotionalDiary.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                      <td className="font-bold uppercase text-red-600">{log.mood}</td>
                      <td className="font-bold">{log.intensity}/10</td>
                      <td>
                        <div><strong>Gatilho Relatado:</strong> {log.trigger}</div>
                        {log.notes && <div className="mt-1 text-gray-600"><strong>Observações:</strong> {log.notes}</div>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Signoff signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-300 text-xs">
            <div className="flex flex-col items-center">
              <div className="w-48 border-b border-gray-400 mt-12 mb-2" />
              <p className="font-bold text-gray-600">Assinatura do Paciente / Usuário</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-48 border-b border-gray-400 mt-12 mb-2" />
              <p className="font-bold text-gray-600">Terapeuta Responsável / CRP</p>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="mt-12 text-[10px] text-gray-500 text-center leading-relaxed">
            Este documento é gerado de forma digital e representa a consolidação do diário pessoal de redução de danos RDBET. O aplicativo apoia a terapia cognitivo-comportamental, servindo como registro voluntário do paciente.
          </div>
        </div>,
        document.body
      )}

      {/* PORTALED PROFILE EDIT MODAL */}
      {createPortal(
        <AnimatePresence>
          {editProfileOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-sm bg-[#12161a] border-2 border-cyber-border rounded-2xl p-5 shadow-2xl relative overflow-hidden text-white"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-border">
                  <span className="text-xs font-black uppercase text-white tracking-widest">
                    Editar Perfil
                  </span>
                  <button
                    onClick={() => {
                      casinoAudio.playTick()
                      setEditProfileOpen(false)
                    }}
                    className="text-zinc-500 hover:text-white font-extrabold text-xs cursor-pointer uppercase tracking-widest bg-transparent border-none"
                  >
                    Fechar
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">
                      Nome do Jogador
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Digite seu nome ou apelido"
                      className="w-full bg-zinc-950 border border-cyber-border rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-700 focus:border-neon-green focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Avatar Picker */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">
                      Escolha uma Foto de Perfil
                    </label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {avatars.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            casinoAudio.playTick()
                            setSelectedAvatarId(av.id)
                          }}
                          className={cn(
                            "p-3 bg-zinc-950 border-2 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-neon-green/45",
                            selectedAvatarId === av.id 
                              ? 'border-neon-green bg-zinc-900 shadow-[0_0_10px_rgba(0,255,60,0.15)] scale-102' 
                              : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          )}
                        >
                          <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center overflow-hidden bg-[#12161a]">
                            {!failedAvatars[av.id] ? (
                              <img 
                                src={`${import.meta.env.BASE_URL}avatars/avatar${av.id}.png`}
                                alt={av.label}
                                className="w-full h-full object-cover rounded-full"
                                onError={() => setFailedAvatars(prev => ({ ...prev, [av.id]: true }))}
                              />
                            ) : (
                              <span className="text-xl">{av.emoji}</span>
                            )}
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-wider">{av.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        casinoAudio.playTick()
                        setEditProfileOpen(false)
                      }}
                      className="w-1/2 py-3 bg-zinc-900 border border-cyber-border text-zinc-400 hover:text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-3 bg-neon-green hover:bg-neon-green-glow text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center border-none"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
