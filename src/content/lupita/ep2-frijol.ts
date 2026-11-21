import type { Episode } from '../../engine/types'

/**
 * EPISODIO 2 · Media libra de frijol
 * Idea: equivalencia (2/4 de libra = media libra).
 * Error que detecta: "números distintos = cantidades distintas" → R2.
 * Nota: en los textos que se leen en voz alta se escribe "de libra", no "lb" (la voz lo lee mal).
 */
export const ep2: Episode = {
  id: 'ep2',
  kind: 'main',
  label: 'Episodio 2',
  title: 'Media libra de frijol',
  scenes: [
    {
      text: 'Media mañana. El frijol se está vendiendo bien.',
      visual: {
        kind: 'titulo',
        kicker: 'El puesto de Lupita · Ep. 2',
        title: 'Media libra de frijol',
        emoji: '🫘',
      },
      seconds: 3,
    },
    {
      speaker: 'beto',
      text: '¡Buenas, patoja! Dame *media libra* de frijol, por favor.',
      visual: {
        kind: 'puesto',
        people: [
          { id: 'lupita', mood: 'neutral' },
          { id: 'beto', mood: 'feliz' },
        ],
        goods: ['frijol'],
      },
      seconds: 4,
    },
    {
      speaker: 'lupita',
      text: 'Tengo bolsitas de *1/4* de libra. Le pongo dos: *2/4* de libra.',
      visual: {
        kind: 'barras',
        bars: [{ parts: 4, filled: 2, label: '2/4' }],
        caption: 'Dos bolsitas de 1/4 lb',
      },
      seconds: 4.5,
    },
    {
      speaker: 'beto',
      text: '¿2/4? Yo te pedí *media libra*, no dos cuartos. ¿Me estás dando de menos?',
      visual: {
        kind: 'puesto',
        people: [
          { id: 'lupita', mood: 'sorpresa' },
          { id: 'beto', mood: 'duda' },
        ],
        goods: ['frijol'],
      },
      seconds: 5,
    },
    {
      speaker: 'lupita',
      text: 'Dice 2 y 4, no 1 y 2… ¿Le estaré dando de menos?',
      visual: {
        kind: 'puesto',
        people: [
          { id: 'lupita', mood: 'duda' },
          { id: 'beto', mood: 'neutral' },
        ],
        goods: ['frijol'],
      },
      seconds: 4,
    },
  ],
  challenge: {
    id: 'reto-2',
    type: 'choice',
    skill: 'equivalencia',
    speaker: 'beto',
    prompt: '¿Cuánto frijol le falta a Don Beto para tener *media libra*?',
    // Lo que falta: media libra menos lo que ya está en la pesa (2/4). La respuesta correcta es 0.
    solution: {
      op: 'sub',
      args: [
        [1, 2],
        [2, 4],
      ],
    },
    options: [
      { label: 'Nada: 2/4 ya es media libra', value: 0, outcome: { correct: true } },
      {
        label: 'Le falta 1/4 de libra',
        value: [1, 4],
        outcome: { misconception: 'numeros-distintos' },
      },
    ],
  },
  next: {
    to: 'ep3',
    bridge: {
      speaker: 'beto',
      text: '¡Cabal! Dos cuartos de libra son *media libra*. Ahí está completa, gracias.',
      visual: {
        kind: 'barras',
        bars: [
          { parts: 2, filled: 1, label: '1/2' },
          { parts: 4, filled: 2 },
        ],
        overlap: true,
        caption: '1/2 = 2/4',
      },
      seconds: 5,
    },
  },
  onError: {
    'numeros-distintos': {
      to: 'r2',
      bridge: {
        text: 'Lupita duda. 2 y 4 son números más grandes que 1 y 2… ¿pero es más frijol? Veámoslo con una barra.',
        visual: {
          kind: 'puesto',
          people: [
            { id: 'lupita', mood: 'duda' },
            { id: 'beto', mood: 'neutral' },
          ],
          goods: ['frijol'],
        },
        seconds: 6,
      },
    },
  },
}
