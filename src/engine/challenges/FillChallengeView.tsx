import { useRef, useState } from 'react'
import { ui } from '../../content/ui'
import { Barra } from '../../visuals/Barras'
import { RichText } from '../RichText'
import type { FillChallenge } from '../types'
import { ANSWER_BEAT_MS, type ChallengeProps } from './ChallengeView'

export function FillChallengeView({ challenge, onAnswer }: ChallengeProps<FillChallenge>) {
  const { parts, reference } = challenge
  const [k, setK] = useState(0)
  const [sent, setSent] = useState(false)
  const dragging = useRef(false)

  const fromPointer = (e: React.PointerEvent<HTMLDivElement>, isTap: boolean) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = Math.min(0.999, Math.max(0, (e.clientX - r.left) / r.width))
    const next = Math.floor(x * parts) + 1
    // Tocar la última parte llena la vacía (para poder corregir).
    const v = isTap && k === next ? next - 1 : next
    if (v !== k) {
      navigator.vibrate?.(8)
      setK(v)
    }
  }

  const submit = () => {
    if (sent) return
    setSent(true)
    navigator.vibrate?.(15)
    window.setTimeout(() => onAnswer(k), ANSWER_BEAT_MS)
  }

  return (
    <div className="flex flex-1 flex-col justify-between pt-4">
      <div className="flex flex-1 flex-col justify-center gap-6">
        {reference && (
          <div>
            {challenge.referenceLabel && (
              <p className="mb-1 text-base font-bold text-white/80">
                <RichText text={challenge.referenceLabel} />
              </p>
            )}
            <Barra parts={reference[1]} filled={reference[0]} color="#2EC4B6" />
          </div>
        )}
        <div>
          {challenge.barLabel && (
            <p className="mb-1 text-base font-bold text-white/80">
              <RichText text={challenge.barLabel} />
            </p>
          )}
          <div
            className="touch-none"
            onPointerDown={(e) => {
              if (sent) return
              e.currentTarget.setPointerCapture(e.pointerId)
              fromPointer(e, true)
              dragging.current = true
            }}
            onPointerMove={(e) => dragging.current && fromPointer(e, false)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            data-testid="fill-area"
          >
            <Barra parts={parts} filled={k} color="#F3B61F" instant />
          </div>
          <p className="mt-2 text-center text-sm font-bold text-white/70">{ui.fillHint}</p>
        </div>
      </div>
      <p className="my-2 text-center text-xl font-black" aria-live="polite">
        <RichText text={ui.fillStatus(k, parts)} />
      </p>
      <button
        type="button"
        onClick={submit}
        disabled={sent}
        className="h-14 w-full rounded-full bg-[#F3B61F] text-xl font-black text-[#2A1840] active:scale-95 disabled:opacity-60"
      >
        {ui.done}
      </button>
    </div>
  )
}
