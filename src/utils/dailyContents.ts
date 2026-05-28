export interface DailyContentItem {
  title: string
  subtitle: string
  url: string
  reward: number
  duration: number // in seconds
}

// Curated therapeutic list of videos/readings for 30/60 days plans
const contentList: Array<Omit<DailyContentItem, 'reward' | 'duration'>> = [
  {
    title: "Como a dopamina atua no vício de apostas",
    subtitle: "Vídeo explicativo sobre neurobiologia do cérebro",
    url: "https://www.youtube.com/watch?v=w7v_19jP9g8"
  },
  {
    title: "O viés cognitivo da ilusão de controle",
    subtitle: "Artigo prático sobre como funcionam as estatísticas",
    url: "https://www.responsiblegambling.org/for-the-public/safer-play/gambling-myths-and-facts/"
  },
  {
    title: "O efeito Near-Miss (Quase Vitória)",
    subtitle: "Vídeo curto analisando gatilhos psicológicos das quase vitórias",
    url: "https://www.youtube.com/watch?v=xq2dC7U62k0"
  },
  {
    title: "Entendendo o Reforço Variável de Skinner",
    subtitle: "Artigo sobre o mecanismo por trás do algoritmo das rodadas",
    url: "https://www.who.int/news-room/fact-sheets/detail/gambling-disorder"
  },
  {
    title: "Como quebrar o hábito compulsivo de apostar",
    subtitle: "Artigo prático sobre a substituição comportamental de hábitos",
    url: "https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/gambling"
  },
  {
    title: "Por que as bets virtuais sempre lucram a longo prazo?",
    subtitle: "Vídeo sobre a matemática e o retorno ao jogador (RTP)",
    url: "https://www.youtube.com/watch?v=PMR4M7H9N_c"
  },
  {
    title: "A Falácia do Apostador no Cassino",
    subtitle: "Vídeo explicativo sobre a independência das probabilidades",
    url: "https://www.youtube.com/watch?v=xq2dC7U62k0"
  },
  {
    title: "Protegendo sua Saúde Mental contra as Bets",
    subtitle: "Guia clínico com exercícios preventivos",
    url: "https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/gambling"
  },
  {
    title: "Neuromarketing: A psicologia secreta dos cassinos",
    subtitle: "Artigo sobre cores, sons e glows que estimulam o jogo",
    url: "https://www.responsiblegambling.org/for-the-public/safer-play/gambling-myths-and-facts/"
  },
  {
    title: "O Custo Oculto da Aposta Compulsiva",
    subtitle: "Artigo sobre finanças pessoais e saúde emocional",
    url: "https://www.who.int/news-room/fact-sheets/detail/gambling-disorder"
  }
]

export const getDailyContent = (day: number): DailyContentItem => {
  // Use day modulo to cycle through curated contents
  const index = Math.max(0, (day - 1) % contentList.length)
  const item = contentList[index]

  return {
    ...item,
    reward: 25, // Vale 25 moedas fictícias
    duration: 180 // 3 minutos (180 segundos) de trava
  }
}
