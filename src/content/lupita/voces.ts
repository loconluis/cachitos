import type { VoiceCasting } from '../../engine/types'

/**
 * Reparto de voces para generar los audios con xAI (pnpm run voces).
 * Voces de xAI: eve, ara, rex, sal, leo. Escuchá las muestras y cambiá lo que no suene bien;
 * al cambiar una voz, el script regenera solo las líneas de ese personaje.
 */
export const voces: VoiceCasting = {
  language: 'es',
  fallback: 'eve',
  bySpeaker: {
    narrador: 'sal',
    lupita: 'ara',
    chepa: 'eve',
    beto: 'rex',
  },
}
