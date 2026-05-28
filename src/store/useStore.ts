import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

  // Clinical & Refinements additions
  avatarId: string // pre-defined avatar (1 to 4)
  betCounter: number // tracks bets to trigger mental mapping (Mapeamento do Momento)
  isMentalMappingOpen: boolean
  activityHistory: Array<{
    id: string
    type: 'cadastro' | 'gameplay' | 'mapeamento' | 'checkin'
    description: string
    timestamp: string
    details?: any
  }>
  
  // Mapping steps state
  mappingAntesCompleted: boolean
  mappingDuranteCompleted: boolean
  mappingDepoisCompleted: boolean
  mappingAntesText: string
  mappingDuranteText: string
  mappingDepoisText: string
  hasCompletedInitialMapping: boolean
  mappingStage: 'antes' | 'durante' | 'depois' | 'inicial' | null
  lastMappingDate: string | null
  dailyMappingCompletedDate: string | null

  // Content by credits state
  contentStatus: 'unlocked' | 'cooldown' | 'ready' | 'claimed'
  contentTimer: number
  contentDate: string | null
  activeGame: 'slots' | 'double' | 'mines' | 'roleta' | 'dice' | 'mental' | null
  setActiveGame: (game: 'slots' | 'double' | 'mines' | 'roleta' | 'dice' | 'mental' | null) => void
  
  // Actions
  startContentCooldown: (durationSeconds: number) => void
  tickContentCooldowns: () => void
  claimContentReward: () => void
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

  // Clinical & Refinements actions
  setAvatarId: (id: string) => void
  setUserName: (name: string) => void
  setMentalMappingOpen: (open: boolean) => void
  incrementBetsCount: () => void
  addActivityLog: (type: 'cadastro' | 'gameplay' | 'mapeamento' | 'checkin', description: string, details?: any) => void
  completeStage: (stage: 'antes' | 'durante' | 'depois', mood: 'ansioso' | 'tedio' | 'estressado' | 'impulso' | 'calmo' | 'triste', intensity: number, reason: string) => void
  claimMappingReward: () => void
  setMappingStage: (stage: 'antes' | 'durante' | 'depois' | 'inicial' | null) => void
  checkAndResetDailyMapping: () => void

  // Onboarding & On-day Actions
  registerUser: (name: string, plan: '30' | '60' | 'unlimited') => void
  advanceDay: () => void
  claimDailyReward: () => number // returns amount claimed
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
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

  // Clinical & Refinements additions default values
  avatarId: '1',
  betCounter: 0,
  isMentalMappingOpen: false,
  activityHistory: [],
  mappingAntesCompleted: false,
  mappingDuranteCompleted: false,
  mappingDepoisCompleted: false,
  mappingAntesText: '',
  mappingDuranteText: '',
  mappingDepoisText: '',
  hasCompletedInitialMapping: false,
  mappingStage: null,
  lastMappingDate: null,
  dailyMappingCompletedDate: null,
  contentStatus: 'unlocked',
  contentTimer: 0,
  contentDate: null,
  activeGame: null,

  
  emotionalDiary: [],

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
      title: 'Desmascarando os Slots',
      description: 'Jogue o "Slots RD" no simulador e analise como a volatilidade impacta o saldo.',
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

  setActiveGame: (game) => set({ activeGame: game }),
  setTab: (tab) => set({ currentTab: tab, activeGame: null }),

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
    
    const activityLog = {
      id: `act-${Date.now()}-map`,
      type: 'mapeamento' as const,
      description: `Mapeamento Mental: Sentimento: ${log.mood.toUpperCase()} (Intensidade ${log.intensity}/10)`,
      timestamp: new Date().toISOString(),
      details: { mood: log.mood, intensity: log.intensity, trigger: log.trigger }
    }

    return {
      emotionalDiary: [newLog, ...state.emotionalDiary],
      activityHistory: [activityLog, ...state.activityHistory],
      lastMappingDate: new Date().toLocaleDateString()
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
    const gameLog = {
      id: `act-${Date.now()}-game`,
      type: 'gameplay' as const,
      description: `Simulação de Aposta: Perda virtual de R$ ${moneyLost.toFixed(2)}`,
      timestamp: new Date().toISOString(),
      details: { moneyLost, timeLostSeconds }
    }

    return {
      simulatedBetsCount: state.simulatedBetsCount + 1,
      simulatedMoneyLost: state.simulatedMoneyLost + moneyLost,
      simulatedTimeLost: state.simulatedTimeLost + timeLostSeconds,
      activityHistory: [gameLog, ...state.activityHistory]
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
    claimedToday: false,
    avatarId: '1',
    betCounter: 0,
    isMentalMappingOpen: false,
    activityHistory: [],
    mappingAntesCompleted: false,
    mappingDuranteCompleted: false,
    mappingDepoisCompleted: false,
    mappingAntesText: '',
    mappingDuranteText: '',
    mappingDepoisText: '',
    hasCompletedInitialMapping: false,
    mappingStage: null,
    lastMappingDate: null,
    dailyMappingCompletedDate: null,
    contentStatus: 'unlocked',
    contentTimer: 0,
    contentDate: null,
    activeGame: null
  })),

  registerUser: (name, plan) => {
    const registrationDate = new Date().toISOString()
    const initLog = {
      id: `act-${Date.now()}-reg`,
      type: 'cadastro' as const,
      description: `Cadastro de usuário "${name}" realizado no plano ${plan === 'unlimited' ? 'Ilimitado' : plan + ' Dias'}`,
      timestamp: registrationDate
    }
    set({
      registered: true,
      userName: name,
      selectedPlan: plan,
      registrationDate,
      balance: 50,
      xp: 0,
      level: 1,
      streak: 0,
      simulatedDay: 1,
      claimedToday: true,
      unclaimedDays: 0,
      realMoneySaved: 0,
      avatarId: '1',
      betCounter: 0,
      isMentalMappingOpen: false,
      activityHistory: [initLog],
      mappingAntesCompleted: false,
      mappingDuranteCompleted: false,
      mappingDepoisCompleted: false,
      mappingAntesText: '',
      mappingDuranteText: '',
      mappingDepoisText: '',
      hasCompletedInitialMapping: false,
      mappingStage: null,
      lastMappingDate: null,
      dailyMappingCompletedDate: null,
      contentStatus: 'unlocked',
      contentTimer: 0,
      contentDate: null,
      activeGame: null
    })
  },

  advanceDay: () => set((state) => {
    const nextDay = state.simulatedDay + 1
    const newBalance = state.balance + 50 // Automatic daily reward
    const dayLog = {
      id: `act-${Date.now()}-day`,
      type: 'checkin' as const,
      description: `Avanço de Dia para Dia ${nextDay}: Banca diária de R$ 50,00 adicionada automaticamente.`,
      timestamp: new Date().toISOString()
    }
    return {
      simulatedDay: nextDay,
      balance: newBalance,
      claimedToday: true,
      unclaimedDays: 0,
      streak: state.streak + 1,
      realMoneySaved: state.realMoneySaved + 50,
      mappingAntesCompleted: false,
      mappingDuranteCompleted: false,
      mappingDepoisCompleted: false,
      mappingAntesText: '',
      mappingDuranteText: '',
      mappingDepoisText: '',
      dailyMappingCompletedDate: null,
      contentStatus: 'unlocked',
      contentTimer: 0,
      contentDate: null,
      activityHistory: [dayLog, ...state.activityHistory]
    }
  }),

  claimDailyReward: () => {
    return 0 // reward is automatic now
  },

  setAvatarId: (id) => set({ avatarId: id }),

  setUserName: (name) => set({ userName: name }),

  setMentalMappingOpen: (open) => set({ isMentalMappingOpen: open }),

  incrementBetsCount: () => set((state) => {
    const today = new Date().toLocaleDateString()
    if (state.lastMappingDate === today) {
      return {} // Already mapped today (voluntarily or automatically), no popup!
    }
    const nextCount = state.betCounter + 1
    if (nextCount >= 3) {
      return {
        betCounter: 0,
        isMentalMappingOpen: true,
        lastMappingDate: today
      }
    }
    return {
      betCounter: nextCount
    }
  }),

  addActivityLog: (type, description, details) => set((state) => {
    const newLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      description,
      timestamp: new Date().toISOString(),
      details
    }
    return {
      activityHistory: [newLog, ...state.activityHistory]
    }
  }),

  completeStage: (stage, mood, intensity, reason) => set((state) => {
    const newLog = {
      id: `log-${Date.now()}-${stage}`,
      timestamp: new Date().toISOString(),
      mood,
      intensity,
      trigger: reason,
      notes: `Mapeamento voluntário etapa: ${stage.toUpperCase()}`
    }

    const activityLog = {
      id: `act-${Date.now()}-${stage}`,
      type: 'mapeamento' as const,
      description: `Mapeamento Mental (${stage.toUpperCase()}): Sentimento: ${mood.toUpperCase()} (Intensidade ${intensity}/10). Motivo: "${reason}"`,
      timestamp: new Date().toISOString()
    }

    const updates: Partial<AppState> = {
      emotionalDiary: [newLog, ...state.emotionalDiary],
      activityHistory: [activityLog, ...state.activityHistory],
      lastMappingDate: new Date().toLocaleDateString()
    }

    if (stage === 'antes') {
      updates.mappingAntesCompleted = true
      updates.mappingAntesText = reason
    } else if (stage === 'durante') {
      updates.mappingDuranteCompleted = true
      updates.mappingDuranteText = reason
    } else if (stage === 'depois') {
      updates.mappingDepoisCompleted = true
      updates.mappingDepoisText = reason
    }

    return updates
  }),

  claimMappingReward: () => set((state) => {
    if (!state.mappingAntesCompleted || !state.mappingDuranteCompleted || !state.mappingDepoisCompleted) {
      return {}
    }
    const bonus = 15
    const today = new Date().toLocaleDateString()
    const activityLog = {
      id: `act-${Date.now()}-bonus`,
      type: 'checkin' as const,
      description: `Recompensa de R$ 15,00 resgatada por completar as 3 etapas do Mapeamento do Momento`,
      timestamp: new Date().toISOString()
    }
    return {
      balance: state.balance + bonus,
      dailyMappingCompletedDate: today,
      activityHistory: [activityLog, ...state.activityHistory]
    }
  }),

  setMappingStage: (stage) => set({ mappingStage: stage }),

  startContentCooldown: (durationSeconds) => set(() => {
    const today = new Date().toLocaleDateString()
    return {
      contentStatus: 'cooldown',
      contentTimer: durationSeconds,
      contentDate: today
    }
  }),

  tickContentCooldowns: () => set((state) => {
    if (state.contentStatus === 'cooldown') {
      const nextVal = state.contentTimer - 1
      if (nextVal <= 0) {
        return {
          contentStatus: 'ready',
          contentTimer: 0
        }
      } else {
        return {
          contentTimer: nextVal
        }
      }
    }
    return {}
  }),

  claimContentReward: () => set((state) => {
    const bonus = 25
    const today = new Date().toLocaleDateString()
    const activityLog = {
      id: `act-${Date.now()}-content-daily`,
      type: 'checkin' as const,
      description: `Recompensa de R$ 25,00 resgatada por concluir o Conteúdo do Dia`,
      timestamp: new Date().toISOString()
    }
    return {
      balance: state.balance + bonus,
      contentStatus: 'claimed',
      contentDate: today,
      activityHistory: [activityLog, ...state.activityHistory]
    }
  }),

  checkAndResetDailyMapping: () => {
    const today = new Date().toLocaleDateString()
    const { dailyMappingCompletedDate, contentDate } = get()
    const updates: Partial<AppState> = {}
    
    if (dailyMappingCompletedDate && dailyMappingCompletedDate !== today) {
      updates.mappingAntesCompleted = false
      updates.mappingDuranteCompleted = false
      updates.mappingDepoisCompleted = false
      updates.mappingAntesText = ''
      updates.mappingDuranteText = ''
      updates.mappingDepoisText = ''
      updates.dailyMappingCompletedDate = null
    }

    if (contentDate && contentDate !== today) {
      updates.contentStatus = 'unlocked'
      updates.contentTimer = 0
      updates.contentDate = null
    }

    if (Object.keys(updates).length > 0) {
      set(updates)
    }
  }
    }),
    {
      name: 'rdbet-clinical-storage'
    }
  )
)

if (typeof window !== 'undefined') {
  (window as any).store = useStore
}

