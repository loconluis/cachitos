import { describe, expect, it } from 'vitest'
import { lupita } from '../content/lupita'
import { initialState, reduce, type Action, type PlayState } from './state'
import type { Series } from './types'
import { validateSeries } from './validate'

function run(series: Series, actions: Action[], from = initialState(series)): PlayState {
  return actions.reduce((s, a) => reduce(series, s, a), from)
}

/** Avanza hasta el siguiente reto (o el cierre). */
function toChallenge(series: Series, s: PlayState): PlayState {
  for (let i = 0; i < 100 && s.phase.name !== 'challenge' && s.phase.name !== 'end'; i++)
    s = reduce(series, s, { type: 'advance' })
  return s
}

const optionIndex = (label: string) =>
  lupita.episodes.ep1!.challenge!.type === 'choice'
    ? lupita.episodes.ep1!.challenge!.options.findIndex((o) => o.label.startsWith(label))
    : -1

describe('flujo del episodio 1', () => {
  it('fallar eligiendo 1/8 lleva a R1, luego a un reto distinto, y luego al episodio 2', () => {
    let s = toChallenge(lupita, initialState(lupita))
    expect(s.episode).toBe('ep1')

    s = reduce(lupita, s, { type: 'answer', value: optionIndex('1/8') })
    expect(s.phase).toMatchObject({ name: 'bridge', via: 'denominador-mayor' })

    s = reduce(lupita, s, { type: 'advance' })
    expect(s.episode).toBe('r1')

    s = toChallenge(lupita, s)
    const ch = lupita.episodes[s.episode]!.challenge!
    expect(ch.id).not.toBe(lupita.episodes.ep1!.challenge!.id)
    expect(ch.skill).toBe(lupita.episodes.ep1!.challenge!.skill)
    expect(ch.type).toBe('split')

    s = reduce(lupita, s, { type: 'answer', value: 8 })
    s = toChallenge(lupita, reduce(lupita, s, { type: 'advance' }))
    expect(s.episode).toBe('ep2')
    expect(s.attempts.map((a) => a.correct)).toEqual([false, true])
  })

  it('acertar 1/4 sigue directo al episodio 2', () => {
    let s = toChallenge(lupita, initialState(lupita))
    s = reduce(lupita, s, { type: 'answer', value: optionIndex('1/4') })
    s = reduce(lupita, s, { type: 'advance' })
    expect(s.episode).toBe('ep2')
  })

  it('fallar también en R1 pasa por el repaso y retoma la historia', () => {
    let s = toChallenge(lupita, initialState(lupita))
    s = reduce(lupita, s, { type: 'answer', value: optionIndex('1/8') })
    s = toChallenge(lupita, reduce(lupita, s, { type: 'advance' }))
    s = reduce(lupita, s, { type: 'answer', value: 2 })
    expect(s.episode).toBe('r1-repaso')
    s = toChallenge(lupita, s)
    expect(s.episode === 'ep2' || s.phase.name === 'end').toBe(true)
  })

  it('el reto bloquea el avance hasta responder', () => {
    const s = toChallenge(lupita, initialState(lupita))
    expect(reduce(lupita, s, { type: 'advance' })).toBe(s)
  })

  it('retroceder no pasa de la primera escena', () => {
    const s = run(lupita, [{ type: 'back' }, { type: 'back' }])
    expect(s.phase).toEqual({ name: 'scenes', index: 0 })
  })
})

describe('el validador detecta contenido roto', () => {
  it('opción incorrecta sin refuerzo, destino inexistente y respuesta mal calculada', () => {
    const ep1 = lupita.episodes.ep1!
    const broken: Series = {
      ...lupita,
      episodes: {
        ...lupita.episodes,
        ep1: {
          ...ep1,
          onError: {},
          next: { to: 'no-existe' },
          challenge: { ...ep1.challenge!, solution: [1, 8] } as typeof ep1.challenge,
        },
      },
    }
    const problems = validateSeries(broken).join('\n')
    expect(problems).toMatch(/no hay a dónde ir con el error "denominador-mayor"/)
    expect(problems).toMatch(/apunta a "no-existe"/)
    expect(problems).toMatch(/vale 1\/4 pero la solución es 1\/8/)
  })

  it('detecta ciclos', () => {
    const r1 = lupita.episodes['r1-repaso']!
    const cyclic: Series = {
      ...lupita,
      episodes: { ...lupita.episodes, 'r1-repaso': { ...r1, next: { to: 'r1' } } },
    }
    expect(validateSeries(cyclic).join('\n')).toMatch(/ciclo/)
  })
})
