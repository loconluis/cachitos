import type { Episode } from '../../engine/types'

/**
 * REFUERZO 1 · La tortilla
 * Ataca: "denominador más grande = fracción más grande".
 * Se parte una tortilla en más pedazos y cada pedazo se achica.
 * Reto nuevo (manipulativo): partir la tortilla para que cada pedazo sea la mitad de 1/4.
 */
export const r1: Episode = {
  id: 'r1',
  kind: 'refuerzo',
  label: 'Refuerzo',
  title: 'La tortilla',
  scenes: [
    {
      speaker: 'lupita',
      text: 'Agarré una tortilla del canasto. Es *una* tortilla entera.',
      visual: { kind: 'circulo', material: 'tortilla', parts: 1 },
      seconds: 4,
    },
    {
      speaker: 'lupita',
      text: 'La parto en 2. Cada pedazo es *1/2*.',
      visual: {
        kind: 'circulo',
        material: 'tortilla',
        parts: 2,
        highlight: 1,
        spread: true,
        pieceLabels: true,
      },
      seconds: 3.5,
    },
    {
      speaker: 'lupita',
      text: 'Ahora en 4. Cada pedazo es *1/4*. ¿Viste? Se achicó.',
      visual: {
        kind: 'circulo',
        material: 'tortilla',
        parts: 4,
        highlight: 1,
        spread: true,
        pieceLabels: true,
      },
      seconds: 4.5,
    },
    {
      speaker: 'lupita',
      text: 'Y en 8. Cada pedazo es *1/8*. Más chiquito todavía.',
      visual: {
        kind: 'circulo',
        material: 'tortilla',
        parts: 8,
        highlight: 1,
        spread: true,
        pieceLabels: true,
      },
      seconds: 4.5,
    },
    {
      text: 'El número de abajo dice *en cuántos pedazos partiste*. Más pedazos, pedazos más chiquitos.',
      visual: {
        kind: 'comparar',
        material: 'tortilla',
        left: [1, 4],
        right: [1, 8],
        winner: 'left',
        winnerTag: '1/4 es más grande',
      },
      seconds: 6,
    },
    {
      speaker: 'beto',
      text: '¡Ey, Lupita! Mi nieto quiere probar tortilla, pero solo un pedacito: *la mitad de 1/4*.',
      visual: {
        kind: 'puesto',
        people: [
          { id: 'lupita', mood: 'feliz' },
          { id: 'beto', mood: 'feliz' },
        ],
        goods: ['tortillas'],
      },
      seconds: 5,
    },
  ],
  challenge: {
    id: 'reto-1b',
    type: 'split',
    skill: 'comparar',
    speaker: 'beto',
    prompt: 'Partí la tortilla para que cada pedazo sea *la mitad de 1/4*.',
    material: 'tortilla',
    min: 1,
    max: 12,
    start: 1,
    reference: [1, 4],
    referenceLabel: '1/4 de tortilla',
    solution: { op: 'div', args: [[1, 4], 2] },
    answers: [
      { values: [8], outcome: { correct: true } },
      { values: 'rest', outcome: { misconception: 'denominador-mayor' } },
    ],
  },
  next: {
    to: 'ep2',
    bridge: {
      speaker: 'beto',
      text: '¡Eso! En 8 pedazos, cada uno es *1/8*: la mitad de 1/4. Gracias, patoja.',
      visual: {
        kind: 'circulo',
        material: 'tortilla',
        parts: 8,
        highlight: 1,
        spread: true,
        caption: '1/8',
      },
      seconds: 5,
    },
  },
  onError: {
    'denominador-mayor': { to: 'r1-repaso' },
  },
}

/**
 * REPASO de R1: si vuelve a fallar, se le muestra la respuesta con la tortilla y se sigue
 * con la historia (sin regañar y sin quedarse en un ciclo).
 */
export const r1Repaso: Episode = {
  id: 'r1-repaso',
  kind: 'refuerzo',
  label: 'Repaso',
  title: 'Un cuarto partido a la mitad',
  scenes: [
    {
      text: 'Mirá este pedazo: es *1/4* de tortilla.',
      visual: {
        kind: 'circulo',
        material: 'tortilla',
        parts: 4,
        highlight: 1,
        spread: true,
        pieceLabels: true,
      },
      seconds: 3.5,
    },
    {
      text: 'Si partís cada cuarto a la mitad, la tortilla queda en *8 pedazos*.',
      visual: {
        kind: 'circulo',
        material: 'tortilla',
        parts: 8,
        highlight: 2,
        spread: true,
        pieceLabels: true,
      },
      seconds: 5,
    },
    {
      text: 'Cada pedazo es *1/8*: la mitad de 1/4. Más pedazos, más chiquitos.',
      visual: {
        kind: 'circulo',
        material: 'tortilla',
        parts: 8,
        highlight: 1,
        spread: true,
        caption: '1/8',
      },
      seconds: 5,
    },
    {
      speaker: 'beto',
      text: 'Ahí está: 1/8 para mi nieto. ¡Gracias, Lupita!',
      visual: {
        kind: 'puesto',
        people: [
          { id: 'lupita', mood: 'feliz' },
          { id: 'beto', mood: 'feliz' },
        ],
        goods: ['tortillas'],
      },
      seconds: 4,
    },
  ],
  next: { to: 'ep2' },
}
