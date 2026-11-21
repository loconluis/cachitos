import type { Series } from './types'

const DENOM: Record<number, [string, string]> = {
  2: ['medio', 'medios'],
  3: ['tercio', 'tercios'],
  4: ['cuarto', 'cuartos'],
  5: ['quinto', 'quintos'],
  6: ['sexto', 'sextos'],
  7: ['séptimo', 'séptimos'],
  8: ['octavo', 'octavos'],
  9: ['noveno', 'novenos'],
  10: ['décimo', 'décimos'],
  12: ['doceavo', 'doceavos'],
}

/** Convierte el texto en pantalla a algo que la voz lea bien: "3/4" → "3 cuartos", "Q20" → "20 quetzales". */
export function toSpeech(text: string): string {
  return text
    .replace(/\*/g, '')
    .replace(/(\d+)\/(\d+)/g, (_m, n: string, d: string) => {
      const w = DENOM[Number(d)]
      if (!w) return `${n} sobre ${d}`
      return n === '1' ? `un ${w[0]}` : `${n} ${w[1]}`
    })
    .replace(
      /Q\s?(\d+(?:\.\d+)?)/g,
      (_, q: string) => `${q} ${q === '1' ? 'quetzal' : 'quetzales'}`,
    )
    .replace(/\blb\b/g, 'libras')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export const NARRATOR = 'narrador'

/**
 * Clave del audio pregrabado de una línea. Depende del texto y de quién habla: si alguien
 * edita el texto, la clave cambia y la app vuelve a la voz del dispositivo hasta regenerar.
 */
export function audioKey(text: string, speaker?: string): string {
  const s = `${speaker ?? NARRATOR}|${text}`
  let h = 0x811c9dc5 // FNV-1a 32 bits
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

export interface NarrationLine {
  key: string
  text: string
  speaker: string
  /** Dónde aparece (para mensajes del script). */
  where: string
}

/** Todas las líneas narrables de una serie: escenas, escenas puente y enunciados de retos. */
export function narrationLines(series: Series, onlyEpisodes?: readonly string[]): NarrationLine[] {
  const lines = new Map<string, NarrationLine>()
  const add = (text: string, speaker: string | undefined, where: string) => {
    const key = audioKey(text, speaker)
    if (!lines.has(key)) lines.set(key, { key, text, speaker: speaker ?? NARRATOR, where })
  }
  for (const ep of Object.values(series.episodes)) {
    if (onlyEpisodes?.length && !onlyEpisodes.includes(ep.id)) continue
    ep.scenes.forEach((s, i) => add(s.text, s.speaker, `${ep.id}#${i + 1}`))
    if (ep.challenge) add(ep.challenge.prompt, ep.challenge.speaker, `${ep.id}:reto`)
    for (const [via, t] of Object.entries({ next: ep.next, ...ep.onError }))
      if (t.bridge) add(t.bridge.text, t.bridge.speaker, `${ep.id}→${via}`)
  }
  return [...lines.values()]
}

/** Manifiesto de audios pregrabados: clave → archivo. Lo escribe scripts/voces.ts. */
export type VoiceManifest = Record<string, { file: string; voice: string; text: string }>
