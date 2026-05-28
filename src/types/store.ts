export interface EmotionalLog {
  id: string
  timestamp: string
  mood: 'ansioso' | 'tedio' | 'estressado' | 'impulso' | 'calmo' | 'triste'
  intensity: number // 0 to 10 scale
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
