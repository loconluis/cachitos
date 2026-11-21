import type { Challenge, Episode, Outcome, Scene, Series, Transition } from './types'
import { END } from './types'

export interface Attempt {
  episode: string
  challenge: string
  skill: string
  correct: boolean
  misconception?: string
}

export type Phase =
  | { name: 'scenes'; index: number }
  | { name: 'challenge' }
  /** Escena puente. `via` es 'next' (acierto) o el id del error conceptual. */
  | { name: 'bridge'; from: string; via: string }
  | { name: 'end' }

export interface PlayState {
  seriesId: string
  episode: string
  phase: Phase
  attempts: Attempt[]
}

export type Action =
  | { type: 'advance' }
  | { type: 'back' }
  | { type: 'answer'; value: number }
  | { type: 'replay' }
  | { type: 'restart' }

/** Valor de respuesta → significado. En opción múltiple el valor es el índice de la opción. */
export function outcomeFor(ch: Challenge, value: number): Outcome {
  if (ch.type === 'choice') {
    const opt = ch.options[value]
    if (!opt) throw new Error(`Opción ${value} no existe en ${ch.id}`)
    return opt.outcome
  }
  const rule =
    ch.answers.find((r) => r.values !== 'rest' && r.values.includes(value)) ??
    ch.answers.find((r) => r.values === 'rest')
  if (!rule) throw new Error(`El valor ${value} no tiene regla en ${ch.id}`)
  return rule.outcome
}

export function transitionFor(ep: Episode, via: string): Transition {
  if (via === 'next') return ep.next
  const t = ep.onError?.[via]
  if (!t) throw new Error(`El episodio ${ep.id} no sabe a dónde ir con el error "${via}"`)
  return t
}

export function bridgeScene(series: Series, phase: Phase): Scene | undefined {
  if (phase.name !== 'bridge') return undefined
  const ep = series.episodes[phase.from]
  return ep && transitionFor(ep, phase.via).bridge
}

export function initialState(series: Series): PlayState {
  return {
    seriesId: series.id,
    episode: series.start,
    phase: { name: 'scenes', index: 0 },
    attempts: [],
  }
}

function enter(state: PlayState, series: Series, to: string): PlayState {
  if (to === END) return { ...state, phase: { name: 'end' } }
  const ep = series.episodes[to]
  if (!ep) throw new Error(`Episodio "${to}" no existe`)
  const phase: Phase = ep.scenes.length ? { name: 'scenes', index: 0 } : { name: 'challenge' }
  return { ...state, episode: to, phase }
}

function follow(state: PlayState, series: Series, ep: Episode, via: string): PlayState {
  const t = transitionFor(ep, via)
  if (t.bridge) return { ...state, phase: { name: 'bridge', from: ep.id, via } }
  return enter(state, series, t.to)
}

export function reduce(series: Series, state: PlayState, action: Action): PlayState {
  const ep = series.episodes[state.episode]
  if (!ep) return initialState(series)
  const { phase } = state

  switch (action.type) {
    case 'restart':
      return initialState(series)

    case 'replay':
      return ep.scenes.length ? { ...state, phase: { name: 'scenes', index: 0 } } : state

    case 'back':
      if (phase.name === 'scenes')
        return { ...state, phase: { name: 'scenes', index: Math.max(0, phase.index - 1) } }
      if (phase.name === 'challenge' && ep.scenes.length)
        return { ...state, phase: { name: 'scenes', index: ep.scenes.length - 1 } }
      return state

    case 'advance':
      if (phase.name === 'scenes') {
        if (phase.index + 1 < ep.scenes.length)
          return { ...state, phase: { name: 'scenes', index: phase.index + 1 } }
        return ep.challenge
          ? { ...state, phase: { name: 'challenge' } }
          : follow(state, series, ep, 'next')
      }
      if (phase.name === 'bridge') {
        const from = series.episodes[phase.from]
        return from ? enter(state, series, transitionFor(from, phase.via).to) : initialState(series)
      }
      return state // el reto bloquea el avance

    case 'answer': {
      if (phase.name !== 'challenge' || !ep.challenge) return state
      const ch = ep.challenge
      const outcome = outcomeFor(ch, action.value)
      const correct = 'correct' in outcome
      const attempt: Attempt = {
        episode: ep.id,
        challenge: ch.id,
        skill: ch.skill,
        correct,
        ...(correct ? {} : { misconception: outcome.misconception }),
      }
      const next = { ...state, attempts: [...state.attempts, attempt] }
      return follow(next, series, ep, correct ? 'next' : outcome.misconception)
    }
  }
}

// ---------- Persistencia (localStorage, tolerante a fallos) ----------

const key = (seriesId: string) => `cachitos:v1:${seriesId}`

export function loadState(series: Series): PlayState {
  try {
    const raw = localStorage.getItem(key(series.id))
    if (!raw) return initialState(series)
    const s = JSON.parse(raw) as PlayState
    if (s.seriesId !== series.id || !series.episodes[s.episode]) return initialState(series)
    if (s.phase.name === 'bridge' && !bridgeScene(series, s.phase))
      return enter(s, series, s.episode)
    return s
  } catch {
    return initialState(series)
  }
}

export function saveState(state: PlayState) {
  try {
    localStorage.setItem(key(state.seriesId), JSON.stringify(state))
  } catch {
    /* sin almacenamiento: el demo sigue funcionando en memoria */
  }
}

export function clearAll() {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i)
      if (k?.startsWith('cachitos:')) localStorage.removeItem(k)
    }
  } catch {
    /* nada que borrar */
  }
}
