import React from 'react'
import { useStore } from './store/useStore'
import { Layout } from './layouts/Layout'
import { Inicio } from './pages/Inicio'
import { Missoes } from './pages/Missoes'
import { Jogar } from './pages/Jogar'
import { Extrato } from './pages/Extrato'
import { Conta } from './pages/Conta'

const App: React.FC = () => {
  const { currentTab } = useStore()

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'inicio':
        return <Inicio />
      case 'missoes':
        return <Missoes />
      case 'jogar':
        return <Jogar />
      case 'extrato':
        return <Extrato />
      case 'conta':
        return <Conta />
      default:
        return <Inicio />
    }
  }

  return (
    <Layout>
      {renderActiveTab()}
    </Layout>
  )
}

export default App
