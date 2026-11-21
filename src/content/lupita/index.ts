import type { Episode, Series } from '../../engine/types'
import { END } from '../../engine/types'
import { ep1 } from './ep1-queso'
import { errores } from './errores'
import { personajes } from './personajes'
import { r1, r1Repaso } from './r1-tortilla'
import { voces } from './voces'

// TODO(contenido): episodio 2 provisional mientras revisamos el motor con Ep. 1 y R1.
const ep2: Episode = {
  id: 'ep2',
  kind: 'main',
  label: 'Episodio 2',
  title: 'Continuará…',
  scenes: [
    {
      text: 'Lupita sigue atendiendo… (el episodio 2 está en construcción).',
      visual: {
        kind: 'titulo',
        kicker: 'El puesto de Lupita · Ep. 2',
        title: 'Continuará…',
        emoji: '🫘',
      },
      seconds: 3,
    },
  ],
  next: { to: END },
}

const episodes = [ep1, r1, r1Repaso, ep2]

export const lupita: Series = {
  id: 'lupita',
  title: 'El puesto de Lupita',
  subtitle: 'Fracciones en el mercado',
  start: 'ep1',
  characters: personajes,
  misconceptions: errores,
  skills: {
    comparar: { label: 'Comparar fracciones como 1/4 y 1/8' },
    equivalencia: { label: 'Reconocer fracciones equivalentes (2/4 = 1/2)' },
    suma: { label: 'Sumar fracciones con distinto denominador' },
    'de-cantidad': { label: 'Sacar la fracción de una cantidad (3/4 de Q20)' },
  },
  episodes: Object.fromEntries(episodes.map((e) => [e.id, e])),
  voices: voces,
}
