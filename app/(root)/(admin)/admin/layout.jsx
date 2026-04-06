import AppSidebar from '@/components/Application/Admin/AppSidebar'
import ThemeProvider from '@/components/Application/Admin/ThemeProvider'
import Topbar from '@/components/Application/Admin/topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <main className='md:w-[calc(100vw-16rem)]'>
          <div className='pt-17.5 px-8 min-h-[calc(100vh-40px)] pb-10'>
            <Topbar />
            {children}
          </div>
          <div className='border-t h-10 flex justify-center items-center bg-gray-50 dark:bg-background text-sm'>
            @2026 Purbali | All Rights reserved
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default layout