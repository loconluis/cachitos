import type { Episode, Series } from '../../engine/types'
import { END } from '../../engine/types'
import { ep1 } from './ep1-queso'
import { ep2 } from './ep2-frijol'
import { errores } from './errores'
import { personajes } from './personajes'
import { r1, r1Repaso } from './r1-tortilla'
import { r2, r2Repaso } from './r2-barras'
import { voces } from './voces'

// TODO(contenido): episodio 3 provisional. Deja el gancho de la suma (1/2 + 1/4) y va al cierre.
const ep3: Episode = {
  id: 'ep3',
  kind: 'main',
  label: 'Episodio 3',
  title: 'Continuará…',
  scenes: [
    {
      speaker: 'chepa',
      text: '¡Ay, patoja, se me olvidó! Dame *media libra* de frijol y *un cuarto* más.',
      visual: {
        kind: 'puesto',
        people: [
          { id: 'lupita', mood: 'sorpresa' },
          { id: 'chepa', mood: 'feliz' },
        ],
        goods: ['frijol'],
      },
      seconds: 4.5,
    },
    {
      speaker: 'lupita',
      text: '¿Media más un cuarto? ¿Y eso cuánto es?',
      visual: { kind: 'puesto', people: [{ id: 'lupita', mood: 'duda' }], goods: ['frijol'] },
      seconds: 3.5,
    },
    {
      text: 'Lupita sigue atendiendo… (el episodio 3 está en construcción).',
      visual: {
        kind: 'titulo',
        kicker: 'El puesto de Lupita · Ep. 3',
        title: 'Continuará…',
        emoji: '⚖️',
      },
      seconds: 3,
    },
  ],
  next: { to: END },
}

const episodes = [ep1, r1, r1Repaso, ep2, r2, r2Repaso, ep3]

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
