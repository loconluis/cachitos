import type { Frac } from '../engine/types'

export type Mood = 'feliz' | 'duda' | 'sorpresa' | 'neutral'
export type Material = 'tortilla' | 'queso'
export type Goods = 'queso' | 'tortillas' | 'frijol' | 'monedas'

/**
 * Componentes visuales que puede usar una escena. Cada `kind` corresponde a un
 * componente en src/visuals/. El contenido solo pasa datos.
 */
export type Visual =
  /** El puesto del mercado con personajes al frente. */
  | { kind: 'puesto'; people: readonly { id: string; mood?: Mood }[]; goods?: readonly Goods[] }
  /** Una tortilla o un queso partido en `parts`; los primeros `highlight` pedazos se resaltan. */
  | {
      kind: 'circulo'
      material: Material
      parts: number
      highlight?: number
      /** Separa los pedazos resaltados hacia afuera. */
      spread?: boolean
      /** Escribe 1/N dentro de cada pedazo. */
      pieceLabels?: boolean
      caption?: string
    }
  /** Dos pedazos lado a lado para comparar. */
  | {
      kind: 'comparar'
      material: Material
      left: Frac
      right: Frac
      winner?: 'left' | 'right' | 'tie'
      winnerTag?: string
    }
  /** Barras horizontales (o superpuestas) para comparar fracciones. */
  | {
      kind: 'barras'
      bars: readonly { parts: number; filled: number; label?: string; color?: string }[]
      overlap?: boolean
      caption?: string
    }
  /** Tarjeta de título grande. */
  | { kind: 'titulo'; kicker: string; title: string; emoji?: string }
