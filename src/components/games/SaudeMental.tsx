import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import { Wind, HeartPulse, BrainCircuit, ShieldAlert, Award, Phone } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { BreathingBox } from '../ui/BreathingBox'
import { TriggerForm } from '../missions/TriggerForm'
import { casinoAudio } from '../../utils/audioEngine'

export const SaudeMental: React.FC = () => {
  const { gainXp, addBalance } = useStore()
  
  const [activeSubTab, setActiveSubTab] = useState<'respiracao' | 'gatilho' | 'quiz' | 'info'>('respiracao')

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const quizQuestions = [
    {
      question: "O que é o 'Efeito Quase-Vitória' (Near-Miss) nos cassinos?",
      options: [
        "Um bug técnico que faz a roleta parar no número errado.",
        "Uma estratégia visual que simula que você quase ganhou (ex: 2 rolos iguais e o 3º diferente) para estimular dopamina e forçar a próxima aposta.",
        "Uma rodada bônus que dobra seus lucros na aposta seguinte."
      ],
      correctIndex: 1,
      explanation: "Parar 'quase' na vitória engana o cérebro, ativando picos de dopamina idênticos aos da vitória real. Isso dá a falsa ilusão de que você está 'perto' de ganhar."
    },
    {
      question: "Como o 'Reforço Variável' gera vício?",
      options: [
        "Ao entregar prêmios de forma totalmente imprevisível, mantendo o cérebro em constante expectativa e obsessão pela próxima tentativa.",
        "Garantindo que a banca pague o valor investido após um determinado número de rodadas consecutivas.",
        "Diminuindo a probabilidade de ganhar à medida que você passa mais tempo no jogo."
      ],
      correctIndex: 0,
      explanation: "A imprevisibilidade é o maior gatilho para o vício. Se o cérebro soubesse exatamente quando ganharia, o jogo perderia a graça rapidamente. A incerteza escraviza a atenção."
    },
    {
      question: "O que define a famosa 'Falácia do Jogador'?",
      options: [
        "Acreditar que os cassinos online estão quebrando leis locais.",
        "A sensação de culpa e remorso após perder dinheiro da família.",
        "A crença irracional de que rodadas passadas influenciam probabilidades futuras (ex: achar que por ter dado 5 pretos seguidos, o próximo obrigatoriamente será vermelho)."
      ],
      correctIndex: 2,
      explanation: "Em geradores de números aleatórios (RNG) ou roletas, cada rodada é um evento 100% independente. O histórico anterior não tem influência alguma sobre a probabilidade da rodada atual."
    }
  ]

  const handleAnswerSelect = (idx: number) => {
    setSelectedAnswer(idx)
    casinoAudio.playTick()
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctIndex
    if (isCorrect) {
      setQuizScore(prev => prev + 1)
      casinoAudio.playCoinChime()
    } else {
      casinoAudio.playWarning()
    }

    setSelectedAnswer(null)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setQuizFinished(true)
      // Reward completion
      gainXp(40)
      addBalance(150)
      casinoAudio.playWinMelody()
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setQuizFinished(false)
    setQuizScore(0)
    setQuizStarted(true)
    casinoAudio.playTick()
  }

  return (
    <div className="space-y-4">
      {/* Tab Selectors */}
      <div className="flex gap-2 border-b border-cyber-border pb-2 overflow-x-auto scrollbar-none select-none">
        {[
          { id: 'respiracao', label: 'Respiração', icon: Wind },
          { id: 'gatilho', label: 'Diário SOS', icon: HeartPulse },
          { id: 'quiz', label: 'Quiz Dopamina', icon: BrainCircuit },
          { id: 'info', label: 'Danos Clínicos', icon: ShieldAlert }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                casinoAudio.playTick()
                setActiveSubTab(tab.id as any)
              }}
              className={`px-3 py-2 rounded-lg font-black text-[9px] tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all border shrink-0 ${
                isActive 
                  ? 'bg-neon-green text-black border-neon-green shadow-lg shadow-neon-green/10' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <Icon size={12} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Contents */}
      <div className="space-y-4">
        {activeSubTab === 'respiracao' && (
          <div className="space-y-4 animate-fade-in">
            <BreathingBox />
            
            <Card className="p-4 bg-[#12161a] border border-cyber-border space-y-2.5">
              <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block">
                Por que respirar funciona?
              </span>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                Quando a vontade de apostar (fissura) ataca, o corpo entra em estado de alerta adrenérgico, acelerando o batimento cardíaco e bloqueando a tomada de decisão racional (córtex pré-frontal). Respirações profundas de 4 segundos ativam o sistema nervoso parassimpático, desacelerando o coração e restaurando o controle racional de forma fisiológica.
              </p>
            </Card>
          </div>
        )}

        {activeSubTab === 'gatilho' && (
          <div className="animate-fade-in">
            <TriggerForm />
          </div>
        )}

        {activeSubTab === 'quiz' && (
          <div className="animate-fade-in">
            {!quizStarted && !quizFinished ? (
              <Card className="p-5 text-center space-y-4 bg-[#12161a]">
                <div className="w-14 h-14 bg-neon-green/10 border border-neon-green/30 rounded-full flex items-center justify-center text-neon-green glow-green mx-auto">
                  <BrainCircuit size={28} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Quiz da Manipulação de Dopamina
                  </h3>
                  <p className="text-[10px] text-zinc-400 max-w-[90%] mx-auto leading-relaxed">
                    Responda às perguntas sobre os truques neurocientíficos e estatísticos que as casas de aposta usam para manter você jogando.
                  </p>
                </div>

                <div className="bg-zinc-950 border border-cyber-border p-3 rounded-lg text-left text-[9px] text-zinc-500 flex gap-2">
                  <Award size={14} className="text-neon-yellow shrink-0 mt-0.5" />
                  <p>
                    Recompensa de Conclusão: <strong className="text-white">+150 moedas fictícias</strong> de saldo e <strong className="text-white">+40 XP</strong> para progredir seu nível de autocontrole.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    casinoAudio.playTick()
                    setQuizStarted(true)
                  }}
                  variant="primary"
                  glow
                  className="w-full"
                >
                  Iniciar Teste Terapêutico
                </Button>
              </Card>
            ) : quizFinished ? (
              <Card className="p-5 text-center space-y-4 bg-[#12161a]">
                <div className="w-14 h-14 bg-emerald-950/40 border border-emerald-500 rounded-full flex items-center justify-center text-neon-green glow-green mx-auto">
                  <Award size={28} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Concluído com Sucesso!
                  </h3>
                  <p className="text-[10px] text-zinc-400 max-w-[90%] mx-auto leading-relaxed">
                    Excelente! Conhecer a ciência por trás do vício é um dos maiores pilares para a dessensibilização dos gatilhos compulsivos.
                  </p>
                  <p className="text-xs font-black text-neon-green mt-1">
                    Seu Score: {quizScore} / {quizQuestions.length} corretas
                  </p>
                </div>

                <div className="bg-zinc-950 border border-cyber-border p-3.5 rounded-xl text-[10px] text-zinc-400 space-y-1">
                  <span className="text-white font-extrabold block uppercase tracking-wide">Moedas & XP creditados</span>
                  <p>Sua carteira fictícia foi abastecida e sua experiência aumentou.</p>
                </div>

                <Button
                  onClick={resetQuiz}
                  variant="secondary"
                  className="w-full"
                >
                  Refazer Quiz
                </Button>
              </Card>
            ) : (
              <Card className="p-5 space-y-4 bg-[#12161a] border border-cyber-border text-left">
                <div className="flex justify-between items-center text-[9px] text-zinc-500 font-extrabold uppercase">
                  <span>Questão {currentQuestion + 1} de {quizQuestions.length}</span>
                  <span className="text-neon-yellow">Score: {quizScore}</span>
                </div>

                <h4 className="text-xs font-extrabold text-white leading-relaxed">
                  {quizQuestions[currentQuestion].question}
                </h4>

                <div className="space-y-2">
                  {quizQuestions[currentQuestion].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-[11px] leading-relaxed transition-all cursor-pointer ${
                        selectedAnswer === idx 
                          ? 'bg-zinc-800 border-zinc-500 font-extrabold text-white ring-1 ring-zinc-700' 
                          : 'bg-zinc-950 border-cyber-border text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  variant="primary"
                  glow
                  className="w-full mt-2"
                >
                  Confirmar Resposta & Avançar
                </Button>
              </Card>
            )}
          </div>
        )}

        {activeSubTab === 'info' && (
          <div className="space-y-4 animate-fade-in">
            <Card className="p-4 bg-[#12161a] border border-cyber-border space-y-3">
              <div className="flex items-center gap-2 text-neon-red">
                <ShieldAlert size={16} className="text-glow-red" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-wider">
                  Mapeamento Clínico do Vício em Bets
                </h4>
              </div>

              <div className="space-y-3 text-[10px] text-zinc-400 leading-relaxed font-medium">
                <div className="p-3 bg-zinc-950 rounded-xl space-y-1">
                  <span className="text-white font-extrabold uppercase block text-[9px] tracking-wide">
                    1. Dessensibilização de Receptores
                  </span>
                  <p>
                    O cérebro busca equilíbrio. Quando exposto a estímulos visuais piscantes e promessas de ganhos de cassinos, ele se adapta reduzindo o número de receptores de dopamina ativos. Isso faz com que atividades cotidianas saudáveis pareçam chatas e desinteressantes, gerando uma dependência progressiva.
                  </p>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl space-y-1">
                  <span className="text-white font-extrabold uppercase block text-[9px] tracking-wide">
                    2. Perda de Juízo Crítico (Lobo Frontal)
                  </span>
                  <p>
                    A adrenalina liberada durante perdas e ganhos rápidos inibe a atividade do córtex pré-frontal, área responsável por travar impulsos impulsivos. O jogador acaba apostando de forma frenética para tentar "recuperar" o saldo perdido, um fenômeno patológico clássico chamado Chasing.
                  </p>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl space-y-1">
                  <span className="text-white font-extrabold uppercase block text-[9px] tracking-wide">
                    3. Ilusão de Controle da Banca
                  </span>
                  <p>
                    Ao contrário do que dizem os influenciadores e sites de apostas, nenhuma estratégia (Martingale, controle de stake, análise de histórico de crash ou roleta) consegue superar o RTP (Return to Player) negativo programado na matemática do cassino. A casa sempre vence no longo prazo.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-zinc-900 border border-cyber-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-950 border border-red-500/30 rounded-xl flex items-center justify-center text-neon-red">
                  <Phone size={18} className="text-glow-red" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black text-white uppercase tracking-wider block">Precisa Conversar Agora?</span>
                  <span className="text-[9px] text-zinc-400 font-medium">Fale com voluntários acolhedores do CVV gratuitamente.</span>
                </div>
              </div>
              <a
                href="tel:188"
                className="px-3.5 py-1.5 bg-neon-red hover:bg-neon-red-glow text-white font-black text-[10px] tracking-wider uppercase rounded-lg shadow-lg shadow-red-900/20"
              >
                Ligar 188
              </a>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
