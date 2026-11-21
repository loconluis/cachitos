import { describe, expect, it } from 'vitest'
import { happyPathSeconds, validateSeries } from '../engine/validate'
import { allSeries } from './index'

/** Tiempo estimado que tarda alguien en responder cada reto, para el criterio de "menos de 6 minutos". */
const SECONDS_PER_CHALLENGE = 15

describe.each(allSeries.map((s) => [s.id, s] as const))('serie %s', (_, series) => {
  it('el grafo es coherente y cada respuesta correcta está verificada', () => {
    expect(validateSeries(series)).toEqual([])
  })

  it('recorrerla acertando todo toma menos de 6 minutos', () => {
    const { seconds, challenges } = happyPathSeconds(series)
    expect(seconds + challenges * SECONDS_PER_CHALLENGE).toBeLessThan(6 * 60)
  })
})

describe('narración pregrabada', () => {
  it('cada línea tiene una clave estable que cambia si cambia el texto o quién habla', async () => {
    const { audioKey, narrationLines } = await import('../engine/speechText')
    expect(audioKey('Hola', 'lupita')).toBe(audioKey('Hola', 'lupita'))
    expect(audioKey('Hola', 'lupita')).not.toBe(audioKey('Hola.', 'lupita'))
    expect(audioKey('Hola', 'lupita')).not.toBe(audioKey('Hola', 'beto'))
    for (const series of allSeries) {
      const lines = narrationLines(series)
      const ep1 = series.episodes[series.start]!
      expect(lines.some((l) => l.text === ep1.scenes[0]!.text)).toBe(true)
      if (ep1.challenge) expect(lines.some((l) => l.text === ep1.challenge!.prompt)).toBe(true)
      if (ep1.next.bridge) expect(lines.some((l) => l.text === ep1.next.bridge!.text)).toBe(true)
    }
  })

  it('la voz lee bien fracciones y quetzales', async () => {
    const { toSpeech } = await import('../engine/speechText')
    expect(toSpeech('*1/4* o 3/8 de Q20 🧀')).toBe('un cuarto o 3 octavos de 20 quetzales')
  })
})
