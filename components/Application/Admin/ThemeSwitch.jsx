'use client'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { TiWeatherSunny } from "react-icons/ti";
import { RiMoonClearLine } from "react-icons/ri";
import { useTheme } from 'next-themes';


const ThemeSwitch = () => {
    const {setTheme} = useTheme()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" className="cursor-pointer">
                    <TiWeatherSunny className='dark:hidden'/>
                    <RiMoonClearLine className='hidden dark:block' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                    
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeSwitch