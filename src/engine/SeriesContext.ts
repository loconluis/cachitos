import { createContext, useContext } from 'react'
import type { Series } from './types'

export const SeriesContext = createContext<Series | null>(null)

export function useSeries(): Series {
  const s = useContext(SeriesContext)
  if (!s) throw new Error('Falta <SeriesContext.Provider>')
  return s
}
