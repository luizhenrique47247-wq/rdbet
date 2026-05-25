export interface EmotionalLog {
  id: string
  timestamp: string
  mood: 'ancioso' | 'tedio' | 'estressado' | 'impulso' | 'calmo' | 'triste'
  intensity: number // 1 to 5
  trigger: string
  notes: string
}

export interface Mission {
  id: string
  title: string
  description: string
  xpReward: number
  balanceReward: number
  completed: boolean
  category: 'diaria' | 'autocontrole' | 'educativa'
}

export interface SimulatedStat {
  date: string
  simulatedSpent: number
  actualSaved: number
  anxietyPeak: number
}
