import React, { useContext } from 'react'
import { AppContext } from '../../App'

const DateDay = () => {
  const weekday = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Sat ']
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const { time } = useContext(AppContext)

  return (
    <div className="text-center transition-all duration-300">
      <div className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-1 font-medium">
        {weekday[time.getDay()]} | {month[time.getMonth()]}
      </div>
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
        {time.getDate()} / {time.getMonth() + 1} / {time.getFullYear()}
      </div>
    </div>
  )
}

export default DateDay
