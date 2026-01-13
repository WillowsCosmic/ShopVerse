'use client'
import { persistor, store } from '@/store/store'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from './loading'

const GlobalProviders = ({children}) => {
  return (
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Loading />}>
            {children}
        </PersistGate>
    </Provider>
  )
}

export default GlobalProviders