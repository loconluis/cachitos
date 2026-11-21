import type { Misconception } from '../../engine/types'

/**
 * Errores conceptuales que la serie detecta. Cada respuesta incorrecta apunta a uno de estos.
 * - struggled: aparece en el cierre, en "Lo que te costaba".
 * - mastered: aparece en "Lo que ya dominás" si lo superó después.
 * - homeActivity: va en el mensaje de WhatsApp para la familia (5 minutos en casa).
 */
export const errores: Record<string, Misconception> = {
  'denominador-mayor': {
    struggled:
      'Pensar que un número más grande abajo es una fracción más grande (que 1/8 es más que 1/4).',
    mastered: 'Entre más pedazos partís algo, más chiquito sale cada uno: 1/4 es más que 1/8.',
    homeActivity:
      'Agarren una tortilla o una hoja de papel. Pártanla en 2, luego en 4 y luego en 8. Pregúntenle: ¿qué pedazo es más grande, 1/4 o 1/8? ¿Por qué?',
  },
  'numeros-distintos': {
    struggled:
      'Pensar que si los números son distintos, las cantidades también (que 2/4 no es lo mismo que 1/2).',
    mastered: '2/4 y 1/2 son la misma cantidad escrita de dos formas.',
    homeActivity:
      'Doblen una hoja a la mitad y pinten una mitad. Después doblen otra vez y cuenten: ¿cuántos cuartos quedaron pintados? ¿Cambió lo pintado?',
  },
  'suma-directa': {
    struggled: 'Sumar los de arriba y los de abajo (creer que 1/2 + 1/4 = 2/6).',
    mastered: 'Para sumar fracciones, primero los pedazos tienen que ser del mismo tamaño.',
    homeActivity:
      'Con una tortilla partida en 4: junten media tortilla (2 cuartos) y un cuarto más. ¿Cuántos cuartos son? Escríbanlo juntos.',
  },
}
