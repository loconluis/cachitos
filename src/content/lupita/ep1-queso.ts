import type { Episode } from '../../engine/types'

/**
 * EPISODIO 1 · Un cuarto de queso
 * Idea: comparar fracciones unitarias (1/4 vs 1/8).
 * Error que detecta: "denominador más grande = fracción más grande" → R1.
 */
export const ep1: Episode = {
  id: 'ep1',
  kind: 'main',
  label: 'Episodio 1',
  title: 'Un cuarto de queso',
  scenes: [
    {
      text: 'Sábado, 6 de la mañana. En el mercado.',
      visual: {
        kind: 'titulo',
        kicker: 'El puesto de Lupita · Ep. 1',
        title: 'Un cuarto de queso',
        emoji: '🧀',
      },
      seconds: 3,
    },
    {
      speaker: 'lupita',
      text: 'Mi mamá se fue a Xela y me dejó sola con el puesto. *Todo el día.*',
      visual: { kind: 'puesto', people: [{ id: 'lupita', mood: 'sorpresa' }] },
      seconds: 4.5,
    },
    {
      speaker: 'lupita',
      text: 'Me dijo: «Las cuentas son fáciles, mija». Púchica… ojalá.',
      visual: { kind: 'puesto', people: [{ id: 'lupita', mood: 'duda' }] },
      seconds: 4,
    },
    {
      speaker: 'chepa',
      text: '¡Buenos días, patoja! ¿Y tu mamá? Bueno, vos me atendés.',
      visual: {
        kind: 'puesto',
        people: [
          { id: 'lupita', mood: 'neutral' },
          { id: 'chepa', mood: 'feliz' },
        ],
      },
      seconds: 4,
    },
    {
      speaker: 'chepa',
      text: 'Vienen mis nietos a almorzar. Dame queso: *1/4 o 1/8*, el que sea *más grande*.',
      visual: { kind: 'circulo', material: 'queso', parts: 1 },
      seconds: 5,
    },
    {
      speaker: 'lupita',
      text: 'Uno dice 4, el otro dice 8… ¿Cuál le doy?',
      visual: {
        kind: 'puesto',
        people: [
          { id: 'lupita', mood: 'duda' },
          { id: 'chepa', mood: 'neutral' },
        ],
      },
      seconds: 4,
    },
  ],
  challenge: {
    id: 'reto-1',
    type: 'choice',
    skill: 'comparar',
    speaker: 'chepa',
    prompt: '¿Qué pedazo de queso es *más grande*?',
    solution: {
      op: 'max',
      args: [
        [1, 4],
        [1, 8],
      ],
    },
    options: [
      { label: '1/4 de queso', value: [1, 4], outcome: { correct: true } },
      { label: '1/8 de queso', value: [1, 8], outcome: { misconception: 'denominador-mayor' } },
    ],
  },
  next: {
    to: 'ep2',
    bridge: {
      speaker: 'chepa',
      text: '¡Cabal! Entre menos pedazos partís el queso, más grande sale cada uno. Me llevo mi cuarto.',
      visual: {
        kind: 'comparar',
        material: 'queso',
        left: [1, 4],
        right: [1, 8],
        winner: 'left',
        winnerTag: '1/4 es más grande',
      },
      seconds: 5.5,
    },
  },
  onError: {
    'denominador-mayor': {
      to: 'r1',
      bridge: {
        text: 'Lupita duda. 8 es más que 4… pero ¿el pedazo también? Veámoslo con una tortilla.',
        visual: {
          kind: 'puesto',
          people: [
            { id: 'lupita', mood: 'duda' },
            { id: 'chepa', mood: 'neutral' },
          ],
          goods: ['tortillas'],
        },
        seconds: 5,
      },
    },
  },
}
