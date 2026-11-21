/**
 * Textos de la interfaz (botones, ayudas). El texto de la historia vive en cada serie.
 * Español de Guatemala, con voseo.
 */
export const ui = {
  challenge: 'Reto',
  done: '¡Listo!',
  replay: 'Ver de nuevo',
  paused: 'En pausa',
  tapToResume: 'Tocá para seguir',
  narrationOn: 'Narración activada',
  narrationOff: 'Activar narración',
  splitHint: 'Deslizá el dedo sobre la tortilla ← →',
  splitStatus: (n: number) => (n === 1 ? 'Entera: 1 pedazo' : `${n} pedazos: cada uno es 1/${n}`),
  fillHint: 'Tocá o arrastrá sobre la barra para llenarla',
  fillStatus: (k: number, n: number) => `Llenaste ${k}/${n}`,
  more: 'Más',
  less: 'Menos',
  restart: 'Empezar de nuevo',
}
