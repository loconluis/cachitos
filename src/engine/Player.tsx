import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { ui } from '../content/ui'
import { ChallengeView } from './challenges/ChallengeView'
import { Closing } from './Closing'
import { useNarration } from './narration'
import { SceneView } from './SceneView'
import { bridgeScene, loadState, reduce, saveState, type Action } from './state'
import type { Scene, Series } from './types'

function ProgressBar({
  total,
  current,
  hasChallenge,
  inChallenge,
  seconds,
  paused,
  clockKey,
  onTimeUp,
}: {
  total: number
  current: number
  hasChallenge: boolean
  inChallenge: boolean
  seconds: number
  paused: boolean
  clockKey: string
  onTimeUp: () => void
}) {
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
          {i < current || inChallenge ? (
            <div className="h-full w-full bg-white" />
          ) : i === current ? (
            <div
              key={clockKey}
              className="progress-fill h-full w-full bg-white"
              style={{
                animationDuration: `${seconds}s`,
                animationPlayState: paused ? 'paused' : 'running',
              }}
              onAnimationEnd={onTimeUp}
            />
          ) : null}
        </div>
      ))}
      {hasChallenge && (
        <div
          className={`h-[3px] w-5 rounded-full ${inChallenge ? 'bg-[#F3B61F]' : 'bg-[#F3B61F]/40'}`}
        />
      )}
    </div>
  )
}

export function Player({ series }: { series: Series }) {
  const [state, dispatch] = useReducer(
    (s: ReturnType<typeof loadState>, a: Action) => reduce(series, s, a),
    series,
    loadState,
  )
  const [paused, setPaused] = useState(false)
  const [tick, setTick] = useState(0)
  const narration = useNarration(series.id)
  const { speak, preload, cancel, enabled: narrating } = narration

  useEffect(() => saveState(state), [state])

  const ep = series.episodes[state.episode]
  const { phase } = state
  const scene: Scene | undefined =
    phase.name === 'scenes'
      ? ep?.scenes[phase.index]
      : phase.name === 'bridge'
        ? bridgeScene(series, phase)
        : undefined
  const sceneKey = `${state.episode}|${JSON.stringify(phase)}|${tick}`

  const go = useCallback((a: Action) => {
    dispatch(a)
    setPaused(false)
    setTick((t) => t + 1)
  }, [])

  // Reloj de la escena: avanza cuando terminó el tiempo y (si hay narración) terminó la voz.
  const clock = useRef({ key: '', timeUp: false, spoken: false })
  const narratingRef = useRef(narrating)

  useEffect(() => {
    clock.current = { key: sceneKey, timeUp: false, spoken: false }
  }, [sceneKey])

  useEffect(() => {
    narratingRef.current = narrating
    // Si apagan la narración cuando el tiempo ya se acabó, seguimos.
    if (!narrating && clock.current.key === sceneKey && clock.current.timeUp)
      go({ type: 'advance' })
  }, [narrating, sceneKey, go])

  useEffect(() => {
    if (!scene || paused || !narrating || clock.current.spoken) return
    let live = true
    speak(scene.text, scene.speaker, () => {
      if (!live || clock.current.key !== sceneKey) return
      clock.current.spoken = true
      if (clock.current.timeUp) go({ type: 'advance' })
    })
    return () => {
      live = false
      cancel()
    }
  }, [scene, sceneKey, paused, narrating, speak, cancel, go])

  // Precargar el audio de lo que viene, para que no haya silencio entre escenas.
  const upcoming =
    phase.name === 'scenes' ? (ep?.scenes[phase.index + 1] ?? ep?.challenge) : undefined
  useEffect(() => {
    if (!narrating || !upcoming) return
    if ('prompt' in upcoming) preload(upcoming.prompt, upcoming.speaker)
    else preload(upcoming.text, upcoming.speaker)
  }, [narrating, upcoming, preload])

  const onTimeUp = useCallback(() => {
    if (clock.current.key !== sceneKey) return
    clock.current.timeUp = true
    if (clock.current.spoken || !narratingRef.current) go({ type: 'advance' })
  }, [sceneKey, go])

  // Teclado, para presentar desde la compu: ← → y espacio.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase.name === 'challenge' || phase.name === 'end') return
      if (e.key === 'ArrowRight') go({ type: 'advance' })
      else if (e.key === 'ArrowLeft') go({ type: 'back' })
      else if (e.key === ' ') {
        e.preventDefault()
        setPaused((p) => !p)
      } else return
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase.name, go])

  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    if (x < 0.3) go({ type: 'back' })
    else if (x > 0.7) go({ type: 'advance' })
    else setPaused((p) => !p)
  }

  if (!ep) return null

  if (phase.name === 'end')
    return (
      <Closing
        series={series}
        attempts={state.attempts}
        onRestart={() => go({ type: 'restart' })}
      />
    )

  const inBridge = phase.name === 'bridge'
  const inChallenge = phase.name === 'challenge'
  const total = inBridge ? 1 : ep.scenes.length
  const current = phase.name === 'scenes' ? phase.index : inBridge ? 0 : total

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {scene && <SceneView key={sceneKey} scene={scene} />}

      {scene && (
        <div className="absolute inset-0 z-10" onClick={onTap} data-testid="tap-area">
          {paused && (
            <div className="pop-in absolute inset-0 flex flex-col items-center justify-center bg-black/35">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/50 text-4xl">
                ❚❚
              </div>
              <p className="mt-3 text-lg font-black">{ui.paused}</p>
              <p className="text-white/75">{ui.tapToResume}</p>
            </div>
          )}
        </div>
      )}

      {inChallenge && ep.challenge && (
        <ChallengeView
          key={sceneKey}
          challenge={ep.challenge}
          narration={narration}
          onAnswer={(value) => go({ type: 'answer', value })}
          onReplay={ep.scenes.length ? () => go({ type: 'replay' }) : undefined}
        />
      )}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/50 to-transparent px-3 pt-3 pb-6">
        <ProgressBar
          total={total}
          current={current}
          hasChallenge={!inBridge && !!ep.challenge}
          inChallenge={inChallenge}
          seconds={scene?.seconds ?? 1}
          paused={paused}
          clockKey={sceneKey}
          onTimeUp={onTimeUp}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-bold text-white/90">
            <span className={ep.kind === 'refuerzo' ? 'text-[#2EC4B6]' : 'text-[#F3B61F]'}>
              {ep.label}
            </span>
            <span className="text-white/60"> · </span>
            {ep.title}
          </p>
          {narration.available && (
            <button
              type="button"
              onClick={narration.toggle}
              className="pointer-events-auto rounded-full bg-black/40 px-3 py-1 text-sm font-bold"
              aria-pressed={narration.enabled}
              aria-label={narration.enabled ? ui.narrationOn : ui.narrationOff}
            >
              {narration.enabled ? '🔊' : '🔈'}
            </button>
          )}
        </div>
      </header>
    </div>
  )
}
