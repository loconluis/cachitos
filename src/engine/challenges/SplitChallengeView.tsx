import { useRef, useState } from 'react'
import { ui } from '../../content/ui'
import { Circulo } from '../../visuals/Circulo'
import { RichText } from '../RichText'
import type { SplitChallenge } from '../types'
import { ANSWER_BEAT_MS, type ChallengeProps } from './ChallengeView'

/** Píxeles de arrastre por cada corte nuevo. */
const STEP_PX = 26

export function SplitChallengeView({ challenge, onAnswer }: ChallengeProps<SplitChallenge>) {
  const { min, max } = challenge
  const [n, setN] = useState(challenge.start)
  const [touched, setTouched] = useState(false)
  const [sent, setSent] = useState(false)
  const drag = useRef<{ x: number; n: number } | null>(null)

  const set = (v: number) => {
    const c = Math.min(max, Math.max(min, v))
    setTouched(true)
    setN((prev) => {
      if (prev !== c) navigator.vibrate?.(8)
      return c
    })
  }

  const onDown = (e: React.PointerEvent) => {
    if (sent) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, n }
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const r = e.currentTarget.getBoundingClientRect()
    // Las coordenadas de pantalla pueden estar escaladas (marco de teléfono en escritorio).
    const scale = r.width / e.currentTarget.clientWidth || 1
    set(drag.current.n + Math.round((e.clientX - drag.current.x) / scale / STEP_PX))
  }
  const onUp = () => {
    drag.current = null
  }

  const submit = () => {
    if (sent) return
    setSent(true)
    navigator.vibrate?.(15)
    window.setTimeout(() => onAnswer(n), ANSWER_BEAT_MS)
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-between pt-2">
      <div
        className="relative flex w-full flex-1 touch-none items-center justify-center"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        data-testid="split-area"
      >
        <Circulo
          material={challenge.material}
          parts={n}
          highlight={n > 1 ? 1 : 0}
          reference={challenge.reference}
          still
          className="w-[72%] max-w-[260px]"
        />
        {challenge.referenceLabel && (
          <span className="absolute top-1 right-4 rounded-full border-2 border-dashed border-white px-2 py-0.5 text-xs font-bold">
            <RichText text={challenge.referenceLabel} />
          </span>
        )}
        {!touched && (
          <span className="hint-slide pointer-events-none absolute bottom-2 rounded-full bg-black/60 px-3 py-1 text-sm font-bold">
            {ui.splitHint}
          </span>
        )}
      </div>
      <p className="my-2 text-xl font-black" aria-live="polite">
        <RichText text={ui.splitStatus(n)} />
      </p>
      <div className="flex w-full items-center gap-3">
        <button
          type="button"
          aria-label={ui.less}
          onClick={() => set(n - 1)}
          disabled={sent || n <= min}
          className="h-14 w-14 rounded-full bg-white/15 text-3xl font-black disabled:opacity-30"
        >
          −
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={sent}
          className="h-14 flex-1 rounded-full bg-[#F3B61F] text-xl font-black text-[#2A1840] active:scale-95 disabled:opacity-60"
        >
          {ui.done}
        </button>
        <button
          type="button"
          aria-label={ui.more}
          onClick={() => set(n + 1)}
          disabled={sent || n >= max}
          className="h-14 w-14 rounded-full bg-white/15 text-3xl font-black disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  )
}
