import { configureStore } from '@reduxjs/toolkit'
import weatherReducer from './weatherSlice'
import newsReducer from './newsSlice'
import financeReducer from './financeSlice'

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    news: newsReducer,
    finance: financeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

