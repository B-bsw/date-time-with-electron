import React, { useEffect, useState, useContext } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { AppContext } from '../../App'
import Time from '../times/time'
import DateDay from '../dates/date'
import MusicStatus from '../music/MusicStatus'

const iconFull = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-arrows-maximize"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 4l4 0l0 4" />
      <path d="M14 10l6 -6" />
      <path d="M8 20l-4 0l0 -4" />
      <path d="M4 20l6 -6" />
      <path d="M16 20l4 0l0 -4" />
      <path d="M14 14l6 6" />
      <path d="M8 4l-4 0l0 4" />
      <path d="M4 4l6 6" />
    </svg>
  )
}

const iconNotFull = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-arrows-minimize"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 9l4 0l0 -4" />
      <path d="M3 3l6 6" />
      <path d="M5 15l4 0l0 4" />
      <path d="M3 21l6 -6" />
      <path d="M19 9l-4 0l0 -4" />
      <path d="M15 9l6 -6" />
      <path d="M19 15l-4 0l0 4" />
      <path d="M15 15l6 6" />
    </svg>
  )
}

export default function Home() {
  const { active, setActive } = useContext(AppContext)
  const handle = useFullScreenHandle()
  const [isInactive, setIsInactive] = useState(false)

  useEffect(() => {
    if (handle.active) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [handle.active, setActive])

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key.toLowerCase() === 'f') {
        if (!active) {
          handle.enter()
        } else {
          handle.exit()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [active, handle])

  useEffect(() => {
    let timeout
    const handleActivity = () => {
      setIsInactive(false)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        setIsInactive(true)
      }, 3000)
    }

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('mousedown', handleActivity)
    window.addEventListener('keydown', handleActivity)

    handleActivity()

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('mousedown', handleActivity)
      window.removeEventListener('keydown', handleActivity)
    }
  }, [])

  return (
    <FullScreen handle={handle}>
      <div
        className={`flex h-screen items-center justify-center dark:bg-black transition-colors duration-300 ${active && isInactive ? 'cursor-none' : ''}`}
      >
        <div className="flex flex-col items-center gap-5">
          <Time />
          <div className="p-5 flex flex-col items-center gap-3">
            <DateDay />
            <MusicStatus />
          </div>
          <section
            className={`${isInactive ? 'scale-0 opacity-0' : 'hover:bg-accent hover:text-accent-foreground cursor-pointer hover:scale-110 active:scale-95'} bg-secondary text-secondary-foreground fixed bottom-10 m-10 rounded-xl p-3 text-lg transition-all duration-500 md:text-xl lg:text-3xl`}
            onClick={active ? handle.exit : handle.enter}
          >
            {active ? iconNotFull() : iconFull()}
          </section>
        </div>
      </div>
    </FullScreen>
  )
}
