import React from 'react'

const layout = ({children}) => {
  return (
    <div 
      className='h-screen w-screen flex justify-center items-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50' 
    >
      
        {children}
    </div>
  )
}

export default layout