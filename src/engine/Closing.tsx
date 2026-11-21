import { ui } from '../content/ui'
import type { Attempt } from './state'
import type { Series } from './types'

/** Cierre provisional (el resumen completo y WhatsApp vienen después). */
export function Closing({
  series,
  attempts,
  onRestart,
}: {
  series: Series
  attempts: Attempt[]
  onRestart: () => void
}) {
  const errors = attempts.filter((a) => !a.correct)
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-black">{series.title}</h1>
      <p className="text-lg text-white/80">
        Retos: {attempts.length} · Errores: {errors.length}
      </p>
      <ul className="text-left text-base text-white/80">
        {errors.map((a, i) => (
          <li key={i}>
            • {series.misconceptions[a.misconception ?? '']?.struggled ?? a.misconception}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-full bg-[#F3B61F] px-6 py-3 text-lg font-black text-[#2A1840]"
      >
        {ui.restart}
      </button>
    </div>
  )
}
