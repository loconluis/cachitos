import { useState } from 'react'
import { RichText } from '../RichText'
import type { ChoiceChallenge } from '../types'
import { ANSWER_BEAT_MS, type ChallengeProps } from './ChallengeView'

export function ChoiceChallengeView({ challenge, onAnswer }: ChallengeProps<ChoiceChallenge>) {
  const [picked, setPicked] = useState<number | null>(null)
  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    navigator.vibrate?.(15)
    window.setTimeout(() => onAnswer(i), ANSWER_BEAT_MS)
  }
  const cols = challenge.options.length === 2 ? 'grid-cols-2' : 'grid-cols-1'
  return (
    <div className={`my-auto grid gap-3 ${cols}`}>
      {challenge.options.map((o, i) => (
        <button
          key={i}
          type="button"
          onClick={() => pick(i)}
          disabled={picked !== null}
          className={`flex min-h-[120px] items-center justify-center rounded-2xl border-[3px] px-3 py-4 text-center text-2xl font-black transition-transform duration-150 active:scale-95 ${
            picked === i
              ? 'scale-105 border-[#F3B61F] bg-[#F3B61F] text-[#2A1840]'
              : 'border-white/70 bg-white/10'
          } ${picked !== null && picked !== i ? 'opacity-40' : ''}`}
        >
          <span>
            <RichText text={o.label} stacked />
          </span>
        </button>
      ))}
    </div>
  )
}
