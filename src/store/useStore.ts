import { create } from 'zustand'
import type { EmotionalLog, Mission, SimulatedStat } from '../types/store'

interface AppState {
  currentTab: 'inicio' | 'missoes' | 'jogar' | 'extrato' | 'conta'
  balance: number
  xp: number
  level: number
  streak: number
  checkedIn: boolean
  modoCritico: boolean
  emotionalDiary: EmotionalLog[]
  missions: Mission[]
  simulatedBetsCount: number
  simulatedMoneyLost: number
  simulatedTimeLost: number // in seconds
  realMoneySaved: number // estimated real money saved by avoiding bets
  realBetsAvoided: number
  historicalStats: SimulatedStat[]
  cooldownActive: boolean
  cooldownTimeLeft: number // in seconds

  // Onboarding & Desmame
  registered: boolean
  userName: string
  selectedPlan: '30' | '60' | 'unlimited' | null
  simulatedDay: number
  registrationDate: string | null
  unclaimedDays: number // daily reward accumulation (max 3 days)
  claimedToday: boolean
  
  // Actions
  setTab: (tab: 'inicio' | 'missoes' | 'jogar' | 'extrato' | 'conta') => void
  addBalance: (amount: number) => void
  spendBalance: (amount: number) => boolean
  gainXp: (amount: number) => void
  toggleModoCritico: () => void
  addEmotionalLog: (log: Omit<EmotionalLog, 'id' | 'timestamp'>) => void
  completeMission: (id: string) => void
  incrementSimulatedStats: (moneyLost: number, timeLostSeconds: number) => void
  incrementRealSaved: (moneySaved: number) => void
  performCheckIn: () => void
  setCooldown: (seconds: number) => void
  tickCooldown: () => void
  resetStats: () => void

  // Onboarding & On-day Actions
  registerUser: (name: string, plan: '30' | '60' | 'unlimited') => void
  advanceDay: () => void
  claimDailyReward: () => number // returns amount claimed
}

export const useStore = create<AppState>((set, get) => ({
  currentTab: 'inicio',
  balance: 0, // Starts at 0 before registration
  xp: 0,      // Starts at 0 before registration
  level: 1,
  streak: 0,   // Starts at 0 clean days
  checkedIn: false,
  modoCritico: false,
  cooldownActive: false,
  cooldownTimeLeft: 0,
  simulatedBetsCount: 0,
  simulatedMoneyLost: 0,
  simulatedTimeLost: 0,
  realMoneySaved: 0,
  realBetsAvoided: 0,

  // Onboarding & Desmame Initial values
  registered: false,
  userName: '',
  selectedPlan: null,
  simulatedDay: 1,
  registrationDate: null,
  unclaimedDays: 0,
  claimedToday: false,

  
  // Mock emotional logs to show history
  emotionalDiary: [
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      mood: 'ancioso',
      intensity: 4,
      trigger: 'Propaganda de site de aposta no jogo de futebol',
      notes: 'Senti um forte impulso de abrir o app e apostar no segundo tempo para recuperar o dinheiro do fim de semana. Abri o RDBET e fiz o simulador de Double, vi que perderia tudo de novo. O impulso passou após 15 minutos.'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      mood: 'tedio',
      intensity: 3,
      trigger: 'Sozinho em casa à noite',
      notes: 'Tédio absoluto. O cérebro automaticamente procurou o cassino online para buscar emoção rápido. Completei a missão de respiração e comecei a jogar um videogame.'
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      mood: 'calmo',
      intensity: 1,
      trigger: 'Nenhum',
      notes: 'Dia tranquilo. Consegui focar no trabalho e não pensei em apostas. Completei meu check-in diário.'
    }
  ],

  // Mock missions
  missions: [
    {
      id: 'm-1',
      title: 'Registro de Gatilho',
      description: 'Registre suas emoções e o que desencadeou seu desejo de apostar hoje no Diário de Emoções.',
      xpReward: 30,
      balanceReward: 100,
      completed: false,
      category: 'diaria'
    },
    {
      id: 'm-2',
      title: 'Evitar o Cassino por 24h',
      description: 'Mantenha o foco. Fique um dia inteiro sem apostar dinheiro real em plataformas de aposta.',
      xpReward: 50,
      balanceReward: 250,
      completed: false,
      category: 'autocontrole'
    },
    {
      id: 'm-3',
      title: 'Desmascarando o Crash',
      description: 'Jogue o "Crash da Ansiedade" no simulador e assista à análise do padrão de perda.',
      xpReward: 25,
      balanceReward: 150,
      completed: false,
      category: 'educativa'
    },
    {
      id: 'm-4',
      title: 'Respiração Anti-Compulsão',
      description: 'Realize o exercício respiratório de 2 minutos no painel SOS.',
      xpReward: 30,
      balanceReward: 100,
      completed: false,
      category: 'diaria'
    },
    {
      id: 'm-5',
      title: 'Conexão de Apoio',
      description: 'Compartilhe sua evolução com um familiar ou seu contato de segurança cadastrado.',
      xpReward: 40,
      balanceReward: 200,
      completed: false,
      category: 'autocontrole'
    },
    {
      id: 'm-6',
      title: 'Entendendo o Reforço Variável',
      description: 'Leia o texto explicativo sobre como as bets manipulam seus neurotransmissores na tela inicial.',
      xpReward: 20,
      balanceReward: 100,
      completed: false,
      category: 'educativa'
    }
  ],

  // Chart data representing weekly progression
  historicalStats: [
    { date: 'Seg', simulatedSpent: 300, actualSaved: 100, anxietyPeak: 3 },
    { date: 'Ter', simulatedSpent: 200, actualSaved: 120, anxietyPeak: 4 },
    { date: 'Qua', simulatedSpent: 400, actualSaved: 80, anxietyPeak: 5 },
    { date: 'Qui', simulatedSpent: 150, actualSaved: 150, anxietyPeak: 2 },
    { date: 'Sex', simulatedSpent: 100, actualSaved: 200, anxietyPeak: 3 },
    { date: 'Sáb', simulatedSpent: 50, actualSaved: 300, anxietyPeak: 1 },
    { date: 'Dom', simulatedSpent: 0, actualSaved: 450, anxietyPeak: 1 }
  ],

  setTab: (tab) => set({ currentTab: tab }),

  addBalance: (amount) => set((state) => ({ balance: state.balance + amount })),

  spendBalance: (amount) => {
    const current = get().balance
    if (current >= amount) {
      set({ balance: current - amount })
      return true
    }
    return false
  },

  gainXp: (amount) => set((state) => {
    const newXp = state.xp + amount
    if (newXp >= 100) {
      return {
        xp: newXp - 100,
        level: state.level + 1
      }
    }
    return { xp: newXp }
  }),

  toggleModoCritico: () => set((state) => ({ modoCritico: !state.modoCritico })),

  addEmotionalLog: (log) => set((state) => {
    const newLog: EmotionalLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    
    let xpToGain = 0
    let balanceToGain = 0
    
    const updatedMissions = state.missions.map(m => {
      if (m.id === 'm-1' && !m.completed) {
        xpToGain = m.xpReward
        balanceToGain = m.balanceReward
        return { ...m, completed: true }
      }
      return m
    })

    let nextXp = state.xp + xpToGain
    let nextLevel = state.level
    if (nextXp >= 100) {
      nextXp -= 100
      nextLevel += 1
    }

    return {
      emotionalDiary: [newLog, ...state.emotionalDiary],
      missions: updatedMissions,
      xp: nextXp,
      level: nextLevel,
      balance: state.balance + balanceToGain
    }
  }),

  completeMission: (id) => set((state) => {
    const mission = state.missions.find(m => m.id === id)
    if (!mission || mission.completed) return {}
    
    let nextXp = state.xp + mission.xpReward
    let nextLevel = state.level
    if (nextXp >= 100) {
      nextXp -= 100
      nextLevel += 1
    }

    return {
      missions: state.missions.map(m => m.id === id ? { ...m, completed: true } : m),
      xp: nextXp,
      level: nextLevel,
      balance: state.balance + mission.balanceReward
    }
  }),

  incrementSimulatedStats: (moneyLost, timeLostSeconds) => set((state) => {
    let xpToGain = 0
    let balanceToGain = 0
    const updatedMissions = state.missions.map(m => {
      if (m.id === 'm-3' && !m.completed) {
        xpToGain = m.xpReward
        balanceToGain = m.balanceReward
        return { ...m, completed: true }
      }
      return m
    })

    let nextXp = state.xp + xpToGain
    let nextLevel = state.level
    if (nextXp >= 100) {
      nextXp -= 100
      nextLevel += 1
    }

    return {
      simulatedBetsCount: state.simulatedBetsCount + 1,
      simulatedMoneyLost: state.simulatedMoneyLost + moneyLost,
      simulatedTimeLost: state.simulatedTimeLost + timeLostSeconds,
      missions: updatedMissions,
      xp: nextXp,
      level: nextLevel,
      balance: state.balance + balanceToGain
    }
  }),

  incrementRealSaved: (moneySaved) => set((state) => ({
    realMoneySaved: state.realMoneySaved + moneySaved,
    realBetsAvoided: state.realBetsAvoided + 1
  })),

  performCheckIn: () => set((state) => {
    if (state.checkedIn) return {}
    
    let nextXp = state.xp + 20
    let nextLevel = state.level
    if (nextXp >= 100) {
      nextXp -= 100
      nextLevel += 1
    }

    return {
      checkedIn: true,
      streak: state.streak + 1,
      xp: nextXp,
      level: nextLevel,
      balance: state.balance + 10
    }
  }),

  setCooldown: (seconds) => set({
    cooldownActive: true,
    cooldownTimeLeft: seconds
  }),

  tickCooldown: () => set((state) => {
    if (state.cooldownTimeLeft <= 1) {
      return {
        cooldownActive: false,
        cooldownTimeLeft: 0
      }
    }
    return {
      cooldownTimeLeft: state.cooldownTimeLeft - 1
    }
  }),

  resetStats: () => set((state) => ({
    balance: 0,
    xp: 0,
    level: 1,
    streak: 0,
    checkedIn: false,
    simulatedBetsCount: 0,
    simulatedMoneyLost: 0,
    simulatedTimeLost: 0,
    realMoneySaved: 0,
    realBetsAvoided: 0,
    emotionalDiary: [],
    missions: state.missions.map(m => ({ ...m, completed: false })),
    registered: false,
    userName: '',
    selectedPlan: null,
    simulatedDay: 1,
    registrationDate: null,
    unclaimedDays: 0,
    claimedToday: false
  })),

  registerUser: (name, plan) => set({
    registered: true,
    userName: name,
    selectedPlan: plan,
    registrationDate: new Date().toISOString(),
    balance: 50,
    xp: 50,
    level: 3,
    streak: 0,
    simulatedDay: 1,
    claimedToday: true,
    unclaimedDays: 0,
    realMoneySaved: 0
  }),

  advanceDay: () => set((state) => {
    const wasClaimed = state.claimedToday
    return {
      simulatedDay: state.simulatedDay + 1,
      unclaimedDays: wasClaimed ? state.unclaimedDays : Math.min(3, state.unclaimedDays + 1),
      claimedToday: false,
      streak: state.streak + 1,
      realMoneySaved: state.realMoneySaved + 50
    }
  }),

  claimDailyReward: () => {
    const state = get()
    if (state.claimedToday) return 0

    const daysToClaim = Math.min(3, state.unclaimedDays + 1)
    const payout = daysToClaim * 50

    set((s) => ({
      balance: s.balance + payout,
      claimedToday: true,
      unclaimedDays: 0
    }))

    return payout
  }
}))
