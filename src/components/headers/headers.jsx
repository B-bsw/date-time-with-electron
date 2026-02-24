import React, { useContext } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { AppContext } from '../../App'
import { ModeToggle } from '../ui/mode-toggle'

const Headers = () => {
  const { county, setCounty } = useContext(AppContext)

  return (
    <div className="fixed top-0 left-0 w-full bg-transparent z-50">
      <div className="my-4 flex justify-end pr-10 gap-4 items-center">
        <ModeToggle />
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <code className="bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-1.5 hover:cursor-pointer transition-colors font-mono text-sm border border-border">
                TimeZone
              </code>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="bg-popover text-popover-foreground border-border min-w-[120px]"
            >
              <DropdownMenuLabel>TimeZone</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={county} onValueChange={setCounty}>
                <DropdownMenuRadioItem value="th">THAI</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="en">EN</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="cn">CHINA</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="kr">KOREA</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default Headers
