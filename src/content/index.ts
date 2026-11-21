import type { Series } from '../engine/types'
import { lupita } from './lupita'

/** Series disponibles. Para agregar otra, creá su carpeta en src/content/ y agregala acá. */
export const allSeries: readonly Series[] = [lupita]

export const defaultSeries = lupita
