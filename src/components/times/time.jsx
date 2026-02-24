import React, { useContext } from 'react'
import { AppContext } from '../../App'

const Time = () => {
  const zone = [
    { key: 'th', country: 'th-TH', timeZone: 'Asia/Bangkok' },
    { key: 'en', country: 'en-US', timeZone: 'America/New_York' },
    { key: 'cn', country: 'zh-CN', timeZone: 'Asia/Shanghai' },
    { key: 'kr', country: 'ko-KR', timeZone: 'Asia/Seoul' },
    { key: 'jp', country: 'ja-JP', timeZone: 'Asia/Tokyo' },
  ]
  const { time, county } = useContext(AppContext)

  const currentZone = zone.find(z => z.key === county) || zone[0]

  return (
    <div className="flex items-end justify-center select-none">
      <section className="text-8xl font-bold tracking-tighter text-foreground md:text-[10rem] lg:text-[12rem] tabular-nums leading-none">
        {time.toLocaleTimeString(currentZone.country, {
          timeZone: currentZone.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </section>
      <section className="ml-4 flex justify-center pb-3 md:pb-6 text-4xl font-bold text-muted-foreground md:text-6xl lg:text-8xl tabular-nums leading-none">
        {String(time.getSeconds()).padStart(2, '0')}
      </section>
    </div>
  )
}

export default Time
