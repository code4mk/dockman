import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import { AppDispatch, AppState } from '@store/index'

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
