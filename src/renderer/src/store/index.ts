// https://github.com/DeMonix666/react-test-nextjs-github/blob/master/src/app/store.ts
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import GlobalReducer from './global'

export function makeStore(): any {
  return configureStore({
    reducer: {
      global: GlobalReducer
    }
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store
