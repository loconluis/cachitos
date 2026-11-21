import { VisualView } from '../visuals/VisualView'
import { RichText } from './RichText'
import { useSeries } from './SeriesContext'
import type { Scene } from './types'

export function SpeakerChip({ speaker }: { speaker?: string }) {
  const c = useSeries().characters[speaker ?? '']
  if (!c) return null
  return (
    <span
      className="mb-1 inline-block rounded-full px-3 py-0.5 text-sm font-black text-[#2A1A12]"
      style={{ background: c.color }}
    >
      {c.name}
    </span>
  )
}

/** Una escena: visual arriba, texto abajo. Sin controles: el reproductor y el modo grabar la envuelven. */
export function SceneView({ scene }: { scene: Scene }) {
  return (
    <div className="absolute inset-0 flex flex-col pt-[72px] pb-5">
      <div className="scene-in relative min-h-0 flex-1">
        <VisualView visual={scene.visual} />
      </div>
      <div className="text-in mx-4 mt-3 rounded-2xl bg-black/40 px-4 py-3">
        <SpeakerChip speaker={scene.speaker} />
        <p className={`text-[21px] leading-snug font-bold ${scene.speaker ? '' : 'italic'}`}>
          <RichText text={scene.text} />
        </p>
      </div>
    </div>
  )
}
