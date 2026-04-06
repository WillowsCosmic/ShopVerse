'use client'
import React from 'react'
import UserDropdown from './UserDropdown'
import ThemeSwitch from './ThemeSwitch'
import { Button } from '@/components/ui/button'
import { RiMenu4Fill } from 'react-icons/ri'
import { useSidebar } from '@/components/ui/sidebar'


const Topbar = () => {
  const {toggleSidebar} = useSidebar() 
  return (
    <div className='fixed top-0 left-0 w-full h-14 bg-white dark:bg-card border-b flex items-center justify-between px-5 md:ps-72 md:pe-8'>
        <div>
            search component
        </div>
        <div className='flex items-center gap-2'>
          <ThemeSwitch />
          <UserDropdown />
          <Button onClick={toggleSidebar} type="button" size="icon" className="ms-2 md:hidden">
            <RiMenu4Fill />
          </Button>
        </div>
    </div>
  )
}

export default Topbar