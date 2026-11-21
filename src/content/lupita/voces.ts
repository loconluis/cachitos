import type { VoiceCasting } from '../../engine/types'

/**
 * Reparto de voces para generar los audios con OpenAI (pnpm run voces).
 * Voces: alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer, verse, marin, cedar.
 * `styles` es opcional: indicaciones de tono para cada personaje. Escuchá las muestras
 * (pnpm run voces --muestra) y cambiá lo que no suene bien; al cambiar una voz o un estilo,
 * el script regenera solo las líneas de ese personaje.
 */
const RITMO =
  'Habla de forma natural y conversacional, con ritmo ágil y fluido, sin pausas largas ni tono de lectura. Español de Guatemala.'

export const voces: VoiceCasting = {
  language: 'es',
  fallback: 'coral',
  bySpeaker: {
    narrador: 'sage',
    lupita: 'marin',
    chepa: 'coral',
    beto: 'cedar',
  },
  styles: {
    narrador: `Narrador cercano y cálido, como quien cuenta una historia a un amigo. ${RITMO}`,
    lupita: `Habla como una niña pequeña de 7 años: voz muy aguda, aniñada y juguetona, con la entonación y la energía de una niña de primaria. Un poco de voz nasal y entusiasmo infantil. No suenes como una mujer adulta ni como actriz; suena como una niña real. ${RITMO}`,
    chepa: `Doña Chepa, señora mayor del mercado: cariñosa, directa y simpática, con voz algo ronca. ${RITMO}`,
    beto: `Don Beto, señor adulto del mercado: voz grave, amable y bromista. ${RITMO}`,
  },
}
