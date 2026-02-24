import React, { createContext, useState, useEffect } from 'react'
import Home from './components/interface/page'
import Headers from './components/headers/headers'

export const AppContext = createContext(null)

const App = () => {
  const [active, setActive] = useState(false)
  const [time, setTime] = useState(new Date())
  const [county, setCounty] = useState('th')
  const [toggleFull, setToggleFull] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AppContext.Provider
      value={{
        active,
        setActive,
        time,
        county,
        setCounty,
        setToggleFull,
        toggleFull,
      }}
    >
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Headers />
        <Home />
      </div>
    </AppContext.Provider>
  )
}

export default App
