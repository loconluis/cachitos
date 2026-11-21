import type { Visual } from '../visuals/types'

/** Una fracción como [numerador, denominador]. */
export type Frac = readonly [number, number]

/** Expresión aritmética que se evalúa en los tests para verificar cada reto. */
export type Expr =
  Frac | number | { op: 'add' | 'sub' | 'mul' | 'div' | 'max' | 'min'; args: readonly Expr[] }

/** Lo que significa una respuesta: acierto, o un error conceptual concreto. */
export type Outcome = { correct: true } | { misconception: string }

export interface Scene {
  /** Texto en pantalla. Es la fuente de verdad (la narración lo lee tal cual). `*así*` resalta. */
  text: string
  /** Id de un personaje de la serie. Sin `speaker` es el narrador. */
  speaker?: string
  visual: Visual
  /** Segundos que dura la escena. */
  seconds: number
}

export interface ChoiceOption {
  label: string
  /** Valor matemático de la opción (para verificar la respuesta). */
  value: Frac | number
  outcome: Outcome
}

export interface AnswerRule {
  /** Valores que caen en esta regla, o 'rest' para cualquier otro valor. */
  values: readonly number[] | 'rest'
  outcome: Outcome
}

interface ChallengeBase {
  id: string
  /** Habilidad que mide este reto (clave de `series.skills`). */
  skill: string
  prompt: string
  speaker?: string
  /** Respuesta correcta como expresión. El test la evalúa y la compara con la opción correcta. */
  solution: Expr
}

/** Opción múltiple. */
export interface ChoiceChallenge extends ChallengeBase {
  type: 'choice'
  options: readonly ChoiceOption[]
}

/** Manipulativo: deslizar para partir un círculo en N pedazos. El valor es N; cada pedazo vale 1/N. */
export interface SplitChallenge extends ChallengeBase {
  type: 'split'
  material: 'tortilla' | 'queso'
  min: number
  max: number
  start: number
  /** Pedazo de referencia que se dibuja punteado encima (por ejemplo [1, 4]). */
  reference?: Frac
  referenceLabel?: string
  answers: readonly AnswerRule[]
}

/** Manipulativo: tocar o arrastrar para llenar una barra de `parts` partes. El valor es k; vale k/parts. */
export interface FillChallenge extends ChallengeBase {
  type: 'fill'
  parts: number
  /** Barra de referencia que se muestra arriba, ya llena (por ejemplo [1, 2]). */
  reference?: Frac
  referenceLabel?: string
  barLabel?: string
  answers: readonly AnswerRule[]
}

export type Challenge = ChoiceChallenge | SplitChallenge | FillChallenge

export const END = 'cierre' as const

export interface Transition {
  /** Id del episodio siguiente, o END para ir al cierre. */
  to: string
  /** Escena puente que conecta con lo que sigue ("Lupita duda, veámoslo con la tortilla"). */
  bridge?: Scene
}

export interface Episode {
  id: string
  kind: 'main' | 'refuerzo'
  /** Etiqueta corta arriba: "Episodio 1", "Refuerzo". */
  label: string
  title: string
  scenes: readonly Scene[]
  challenge?: Challenge
  /** Lo que sigue al acertar (o al terminar, si el episodio no tiene reto). */
  next: Transition
  /** A dónde ir según el error conceptual de la respuesta elegida. */
  onError?: Readonly<Record<string, Transition>>
}

export interface Character {
  name: string
  /** Color del nombre y de la burbuja. */
  color: string
  look: {
    skin: string
    hair: string
    shirt: string
    hairStyle: 'trenzas' | 'chongo' | 'corto' | 'canas'
    accessory?: 'sombrero' | 'delantal' | 'lentes'
  }
}

export interface Misconception {
  /** Cómo se describe en "lo que te costaba". */
  struggled: string
  /** Cómo se describe en "lo que ya dominás" cuando lo superó. */
  mastered: string
  /** Actividad de 5 minutos para hacer en casa (va en el mensaje de WhatsApp). */
  homeActivity: string
}

export interface Series {
  id: string
  title: string
  subtitle: string
  start: string
  characters: Readonly<Record<string, Character>>
  skills: Readonly<Record<string, { label: string }>>
  misconceptions: Readonly<Record<string, Misconception>>
  episodes: Readonly<Record<string, Episode>>
  /** Voces para generar los audios (scripts/voces.ts): id de personaje o 'narrador' → voz del proveedor. */
  voices?: VoiceCasting
}

export interface VoiceCasting {
  /** Idioma que se le pide al proveedor (por ejemplo 'es'). */
  language: string
  /** Voz por defecto si un personaje no tiene una asignada. */
  fallback: string
  bySpeaker: Readonly<Record<string, string>>
  /** Instrucciones de estilo opcionales por personaje (tono, edad, acento). */
  styles?: Readonly<Record<string, string>>
}
