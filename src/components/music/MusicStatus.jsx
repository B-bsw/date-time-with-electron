import React, { useState, useEffect } from 'react'
import { Music } from 'lucide-react'

const MusicStatus = () => {
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchMusicStatus = async () => {
      try {
        if (window.electronAPI && window.electronAPI.getMusicStatus) {
          const music = await window.electronAPI.getMusicStatus()
          setStatus(music)
        }
      } catch (error) {
        console.error('Failed to fetch music status:', error)
      }
    }

    fetchMusicStatus()
    const interval = setInterval(fetchMusicStatus, 5000) // อัปเดตทุก 5 วินาที

    return () => clearInterval(interval)
  }, [])

  if (!status || status === 'No music playing' || status === 'null') return null

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 bg-secondary/40 hover:bg-secondary/60 backdrop-blur-md rounded-2xl text-secondary-foreground text-sm md:text-base border border-white transition-all duration-300">
      <div className="relative flex items-center justify-center">
        <Music className="w-4 h-4 animate-bounce" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
      <span className="font-medium tracking-tight truncate max-w-[200px] sm:max-w-[300px] md:max-w-xl">
        {status}
      </span>
    </div>
  )
}

export default MusicStatus
