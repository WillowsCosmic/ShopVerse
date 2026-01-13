import { combineReducers, configureStore } from "@reduxjs/toolkit"
import persistReducer from "redux-persist/es/persistReducer"
import persistStore from "redux-persist/es/persistStore"
import localStorage from "redux-persist/es/storage"
import authReducer from "./reducer/authReducer"


// App slices will be there in root
const rootReducers = combineReducers({
    authStore:authReducer
})

// key: Identifier for the persisted state in storage
// storage: Where to save the state

const persistConfig = {
    key:'root',
    storage: localStorage
}

// Wraps your root reducer with persistence capabilities.

const persistedReducer = persistReducer(persistConfig,rootReducers)

// Uses the persisted reducer
// serializableCheck: false: Disables Redux Toolkit's serializable check

export const store = configureStore({
    reducer: persistedReducer,
    middleware:(getDefaultMiddleware) => 
        getDefaultMiddleware({serializableCheck: false})
})

// Creates a persistor instance that handles the actual saving/loading of state.

export const persistor = persistStore(store)