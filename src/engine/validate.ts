import { eq, evaluate, show, toFrac } from './fraction'
import { outcomeFor } from './state'
import type { Challenge, Episode, Frac, Outcome, Scene, Series, Transition } from './types'
import { END } from './types'

/** Valor matemático que representa la respuesta `v` de un reto. */
export function answerValue(ch: Challenge, v: number): Frac | number | undefined {
  if (ch.type === 'choice') return ch.options[v]?.value
  if (ch.type === 'split') return [1, v]
  return [v, ch.parts]
}

/** Todas las respuestas posibles de un reto (índices de opción o valores del manipulativo). */
export function possibleAnswers(ch: Challenge): number[] {
  if (ch.type === 'choice') return ch.options.map((_, i) => i)
  const [lo, hi] = ch.type === 'split' ? [ch.min, ch.max] : [0, ch.parts]
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
}

export function outgoing(ep: Episode): Transition[] {
  return [ep.next, ...Object.values(ep.onError ?? {})]
}

/**
 * Revisa que el contenido de una serie sea coherente: grafo sin callejones sin salida,
 * cada error conceptual con su refuerzo, y cada respuesta correcta verificada con aritmética.
 * Devuelve la lista de problemas (vacía si todo está bien).
 */
export function validateSeries(series: Series): string[] {
  const problems: string[] = []
  const p = (where: string, msg: string) => problems.push(`[${series.id}/${where}] ${msg}`)
  const exists = (to: string) => to === END || to in series.episodes

  const checkScene = (where: string, s: Scene) => {
    if (!s.text.trim()) p(where, 'escena sin texto')
    if ((s.text.split('*').length - 1) % 2) p(where, `asteriscos sin cerrar en "${s.text}"`)
    if (!(s.seconds >= 1.5 && s.seconds <= 12)) p(where, `duración rara: ${s.seconds}s`)
    if (s.speaker && !series.characters[s.speaker]) p(where, `personaje "${s.speaker}" no existe`)
    if (s.visual.kind === 'puesto')
      for (const person of s.visual.people)
        if (!series.characters[person.id])
          p(where, `personaje "${person.id}" no existe en el visual`)
  }

  if (!series.episodes[series.start]) p('start', `el episodio inicial "${series.start}" no existe`)

  for (const [key, ep] of Object.entries(series.episodes)) {
    if (ep.id !== key) p(key, `el id "${ep.id}" no coincide con la clave`)
    if (!ep.scenes.length && !ep.challenge) p(key, 'episodio vacío')
    ep.scenes.forEach((s, i) => checkScene(`${key}#${i + 1}`, s))

    for (const t of outgoing(ep)) {
      if (!exists(t.to)) p(key, `apunta a "${t.to}", que no existe`)
      if (t.bridge) checkScene(`${key}→${t.to}`, t.bridge)
    }
    for (const m of Object.keys(ep.onError ?? {}))
      if (!series.misconceptions[m]) p(key, `onError usa el error "${m}", que no está definido`)

    const ch = ep.challenge
    if (!ch) {
      if (ep.onError && Object.keys(ep.onError).length) p(key, 'tiene onError pero no tiene reto')
      continue
    }
    if (!series.skills[ch.skill]) p(key, `habilidad "${ch.skill}" no existe`)
    if (ch.speaker && !series.characters[ch.speaker]) p(key, `personaje "${ch.speaker}" no existe`)
    if (ch.type === 'split' && (ch.start < ch.min || ch.start > ch.max))
      p(key, 'start fuera de rango')

    const solution = evaluate(ch.solution)
    let correctCount = 0
    for (const v of possibleAnswers(ch)) {
      let outcome: Outcome
      try {
        outcome = outcomeFor(ch, v)
      } catch (e) {
        p(key, (e as Error).message)
        continue
      }
      const value = answerValue(ch, v)
      const label = ch.type === 'choice' ? `opción "${ch.options[v]?.label}"` : `valor ${v}`
      if ('correct' in outcome) {
        correctCount++
        if (value === undefined) p(key, `${label} es correcta pero no tiene valor para verificar`)
        else if (!eq(value, solution))
          p(key, `${label} vale ${show(toFrac(value))} pero la solución es ${show(solution)}`)
      } else {
        if (!series.misconceptions[outcome.misconception])
          p(key, `${label}: el error "${outcome.misconception}" no está definido`)
        if (!ep.onError?.[outcome.misconception])
          p(key, `${label}: no hay a dónde ir con el error "${outcome.misconception}"`)
        if (value !== undefined && eq(value, solution))
          p(
            key,
            `${label} vale lo mismo que la solución (${show(solution)}) pero está marcada como incorrecta`,
          )
      }
    }
    if (!correctCount) p(key, 'el reto no tiene ninguna respuesta correcta')
  }

  // Grafo: todo alcanzable desde el inicio, sin ciclos, y desde todo episodio se llega al cierre.
  const reachable = new Set<string>()
  const stack = [series.start]
  while (stack.length) {
    const id = stack.pop()!
    if (id === END || reachable.has(id)) continue
    reachable.add(id)
    const ep = series.episodes[id]
    if (ep) stack.push(...outgoing(ep).map((t) => t.to))
  }
  for (const id of Object.keys(series.episodes))
    if (!reachable.has(id)) p(id, 'no se puede llegar a este episodio desde el inicio')

  const state = new Map<string, 'visiting' | 'done'>()
  const visit = (id: string, path: string[]) => {
    if (id === END) return
    if (state.get(id) === 'done') return
    if (state.get(id) === 'visiting') return p(id, `ciclo: ${[...path, id].join(' → ')}`)
    state.set(id, 'visiting')
    const ep = series.episodes[id]
    if (ep) {
      const targets = outgoing(ep)
      if (!targets.length) p(id, 'callejón sin salida')
      for (const t of targets) visit(t.to, [...path, id])
    }
    state.set(id, 'done')
  }
  // Sin ciclos + cada episodio tiene salida a un destino existente ⇒ todo camino llega al cierre.
  visit(series.start, [])

  return problems
}

/** Segundos de escenas en el camino donde se acierta todo (sin contar el tiempo de responder). */
export function happyPathSeconds(series: Series): {
  seconds: number
  challenges: number
  path: string[]
} {
  let seconds = 0
  let challenges = 0
  const path: string[] = []
  let id = series.start
  while (id !== END && series.episodes[id] && path.length < 100) {
    const ep: Episode = series.episodes[id]!
    path.push(id)
    seconds += ep.scenes.reduce((a, s) => a + s.seconds, 0) + (ep.next.bridge?.seconds ?? 0)
    if (ep.challenge) challenges++
    id = ep.next.to
  }
  return { seconds, challenges, path }
}
