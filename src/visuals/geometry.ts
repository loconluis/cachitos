import type { Material } from './types'

export const MATERIALS: Record<Material, { fill: string; hi: string; edge: string; spot: string }> =
  {
    tortilla: { fill: '#E9C27E', hi: '#FFD98C', edge: '#B98340', spot: '#9A6430' },
    queso: { fill: '#FFF6DF', hi: '#FFFFFF', edge: '#D9C48E', spot: '#E6D7AE' },
  }

export const R = 80
export const C = 100

export function point(angleDeg: number, r: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180
  return [C + r * Math.cos(a), C + r * Math.sin(a)]
}

/** Path SVG de un pedazo de pastel, empezando a las 12 y en sentido horario. */
export function wedgePath(i: number, n: number, r = R): string {
  return arcPath(i / n, (i + 1) / n, r)
}

/** Pedazo entre dos fracciones de vuelta (0 = las 12, 1 = vuelta completa). */
export function arcPath(from: number, to: number, r = R): string {
  if (to - from >= 1)
    return `M ${C - r} ${C} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`
  const a0 = -90 + from * 360
  const a1 = -90 + to * 360
  const [x0, y0] = point(a0, r)
  const [x1, y1] = point(a1, r)
  const large = a1 - a0 > 180 ? 1 : 0
  return `M ${C} ${C} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`
}
