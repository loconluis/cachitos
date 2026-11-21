import { useEffect } from 'react'
import { ui } from '../../content/ui'
import type { Narration } from '../narration'
import { RichText } from '../RichText'
import { SpeakerChip } from '../SceneView'
import type { Challenge } from '../types'
import { ChoiceChallengeView } from './ChoiceChallengeView'
import { FillChallengeView } from './FillChallengeView'
import { SplitChallengeView } from './SplitChallengeView'

export interface ChallengeProps<C extends Challenge> {
  challenge: C
  onAnswer: (value: number) => void
}

/** Tiempo para que se vea la respuesta elegida antes de seguir con la historia. */
export const ANSWER_BEAT_MS = 450

export function ChallengeView({
  challenge,
  narration,
  onAnswer,
  onReplay,
}: {
  challenge: Challenge
  narration: Narration
  onAnswer: (value: number) => void
  onReplay?: () => void
}) {
  const { enabled, speak, cancel } = narration
  useEffect(() => {
    if (enabled) speak(challenge.prompt, challenge.speaker, () => {})
    return cancel
  }, [challenge.prompt, challenge.speaker, enabled, speak, cancel])

  return (
    <div
      className="challenge-in absolute inset-0 z-10 flex flex-col bg-[#2A1840] px-4 pt-[72px] pb-5"
      role="dialog"
      aria-label={ui.challenge}
    >
      <div className="rounded-2xl border-2 border-[#F3B61F] bg-black/30 px-4 py-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="rounded-full bg-[#F3B61F] px-3 py-0.5 text-sm font-black text-[#2A1840] uppercase">
            {ui.challenge}
          </span>
          {onReplay && (
            <button
              type="button"
              onClick={onReplay}
              className="text-sm font-bold text-white/70 underline"
            >
              ↺ {ui.replay}
            </button>
          )}
        </div>
        <SpeakerChip speaker={challenge.speaker} />
        <p className="text-[20px] leading-snug font-bold">
          <RichText text={challenge.prompt} />
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        {challenge.type === 'choice' && (
          <ChoiceChallengeView challenge={challenge} onAnswer={onAnswer} />
        )}
        {challenge.type === 'split' && (
          <SplitChallengeView challenge={challenge} onAnswer={onAnswer} />
        )}
        {challenge.type === 'fill' && (
          <FillChallengeView challenge={challenge} onAnswer={onAnswer} />
        )}
      </div>
    </div>
  )
}
