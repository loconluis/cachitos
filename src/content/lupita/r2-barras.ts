import type { Episode } from '../../engine/types'

/**
 * REFUERZO 2 · La barra
 * Ataca: "números distintos = cantidades distintas" (creer que 2/4 no es lo mismo que 1/2).
 * Se dibuja la libra como una barra; 1/2 y 2/4 superpuestas cubren lo mismo.
 * Reto nuevo (manipulativo): llenar una pesa en octavos hasta tener lo mismo que 3/4.
 */
export const r2: Episode = {
  id: 'r2',
  kind: 'refuerzo',
  label: 'Refuerzo',
  title: 'La barra',
  scenes: [
    {
      speaker: 'lupita',
      text: 'Dibujo la libra de frijol como una barra. Esta es *una libra* entera.',
      visual: { kind: 'barras', bars: [{ parts: 1, filled: 1, label: '1' }] },
      seconds: 4,
    },
    {
      speaker: 'lupita',
      text: 'La parto en 2 y pinto un pedazo: *media libra*.',
      visual: { kind: 'barras', bars: [{ parts: 2, filled: 1, label: '1/2' }] },
      seconds: 4,
    },
    {
      speaker: 'lupita',
      text: 'Otra barra igual, partida en 4. Pinto dos pedazos: *2/4*.',
      visual: {
        kind: 'barras',
        bars: [
          { parts: 2, filled: 1, label: '1/2' },
          { parts: 4, filled: 2, label: '2/4' },
        ],
      },
      seconds: 4.5,
    },
    {
      speaker: 'lupita',
      text: 'Las pongo una encima de la otra… ¡Cubren *lo mismo*!',
      visual: {
        kind: 'barras',
        bars: [
          { parts: 2, filled: 1, label: '1/2' },
          { parts: 4, filled: 2 },
        ],
        overlap: true,
        caption: '1/2 = 2/4',
      },
      seconds: 4.5,
    },
    {
      text: 'Si partís cada pedazo en 2, tenés *el doble de pedazos*, pero cada uno es la mitad. Lo pintado *no cambia*.',
      visual: {
        kind: 'barras',
        bars: [
          { parts: 2, filled: 1, label: '1/2' },
          { parts: 4, filled: 2, label: '2/4' },
          { parts: 8, filled: 4, label: '4/8' },
        ],
      },
      seconds: 7,
    },
    {
      speaker: 'chepa',
      text: '¡Patoja! Quiero *3/4 de libra* de frijol, pero tu pesa nueva marca en *octavos*.',
      visual: {
        kind: 'puesto',
        people: [
          { id: 'lupita', mood: 'feliz' },
          { id: 'chepa', mood: 'neutral' },
        ],
        goods: ['frijol'],
      },
      seconds: 5,
    },
  ],
  challenge: {
    id: 'reto-2b',
    type: 'fill',
    skill: 'equivalencia',
    speaker: 'chepa',
    prompt: 'Llená la pesa hasta tener lo mismo que *3/4 de libra*.',
    parts: 8,
    reference: [3, 4],
    referenceLabel: 'Lo que pidió: 3/4 lb',
    barLabel: 'La pesa, en octavos',
    solution: [3, 4],
    answers: [
      { values: [6], outcome: { correct: true } },
      { values: 'rest', outcome: { misconception: 'numeros-distintos' } },
    ],
  },
  next: {
    to: 'ep3',
    bridge: {
      speaker: 'chepa',
      text: '¡Eso! *6/8* de libra es lo mismo que 3/4. Gracias, Lupita.',
      visual: {
        kind: 'barras',
        bars: [
          { parts: 4, filled: 3, label: '3/4' },
          { parts: 8, filled: 6 },
        ],
        overlap: true,
        caption: '3/4 = 6/8',
      },
      seconds: 5,
    },
  },
  onError: {
    'numeros-distintos': { to: 'r2-repaso' },
  },
}

/**
 * REPASO de R2: si vuelve a fallar, se le muestra la respuesta con las barras y se sigue
 * con la historia (sin regañar y sin quedarse en un ciclo).
 */
export const r2Repaso: Episode = {
  id: 'r2-repaso',
  kind: 'refuerzo',
  label: 'Repaso',
  title: 'Tres cuartos en octavos',
  scenes: [
    {
      text: 'Mirá esta barra: *3/4* de libra.',
      visual: { kind: 'barras', bars: [{ parts: 4, filled: 3, label: '3/4' }] },
      seconds: 3.5,
    },
    {
      text: 'Si partís cada cuarto a la mitad, la barra queda en *8 pedazos*.',
      visual: {
        kind: 'barras',
        bars: [
          { parts: 4, filled: 3, label: '3/4' },
          { parts: 8, filled: 6, label: '6/8' },
        ],
      },
      seconds: 5,
    },
    {
      text: 'Los 3 cuartos ahora son *6 octavos*. Cubren lo mismo: 3/4 es igual a 6/8.',
      visual: {
        kind: 'barras',
        bars: [
          { parts: 4, filled: 3, label: '3/4' },
          { parts: 8, filled: 6 },
        ],
        overlap: true,
        caption: '3/4 = 6/8',
      },
      seconds: 5,
    },
    {
      speaker: 'chepa',
      text: 'Ahí está: 6/8, mis tres cuartos de libra. ¡Gracias, Lupita!',
      visual: {
        kind: 'puesto',
        people: [
          { id: 'lupita', mood: 'feliz' },
          { id: 'chepa', mood: 'feliz' },
        ],
        goods: ['frijol'],
      },
      seconds: 4,
    },
  ],
  next: { to: 'ep3' },
}
