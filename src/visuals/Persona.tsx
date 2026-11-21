import type { Character } from '../engine/types'
import type { Mood } from './types'

/** Busto de un personaje. Todo sale de `look`, así otra serie define sus personajes con datos. */
export function Persona({
  look,
  mood = 'neutral',
  x = 0,
  flip,
}: {
  look: Character['look']
  mood?: Mood
  x?: number
  flip?: boolean
}) {
  const { skin, hair, shirt, hairStyle, accessory } = look
  const mouth = {
    feliz: (
      <path
        d="M -11 14 Q 0 24 11 14"
        stroke="#4A2A1A"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    ),
    duda: (
      <path
        d="M -9 18 Q 2 13 10 17"
        stroke="#4A2A1A"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    ),
    sorpresa: <ellipse cx={0} cy={17} rx={5} ry={6.5} fill="#4A2A1A" />,
    neutral: <path d="M -8 16 L 8 16" stroke="#4A2A1A" strokeWidth={3} strokeLinecap="round" />,
  }[mood]
  const brows =
    mood === 'duda' ? (
      <>
        <path d="M -20 -12 L -8 -9" stroke={hair} strokeWidth={3} strokeLinecap="round" />
        <path d="M 8 -14 L 20 -10" stroke={hair} strokeWidth={3} strokeLinecap="round" />
      </>
    ) : mood === 'sorpresa' ? (
      <>
        <path
          d="M -20 -15 Q -14 -19 -8 -15"
          stroke={hair}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 8 -15 Q 14 -19 20 -15"
          stroke={hair}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      </>
    ) : null

  return (
    <g transform={`translate(${x} 0) scale(${flip ? -1 : 1} 1)`}>
      {/* cuerpo */}
      <path d="M -46 120 Q -44 62 0 58 Q 44 62 46 120 Z" fill={shirt} />
      {accessory === 'delantal' && (
        <path d="M -24 120 L -20 74 L 20 74 L 24 120 Z" fill="#FFFFFF" opacity={0.85} />
      )}
      <rect x={-8} y={36} width={16} height={24} rx={6} fill={skin} />
      {/* pelo de atrás */}
      {hairStyle === 'trenzas' && (
        <>
          <path
            d="M -30 0 Q -40 40 -30 78"
            stroke={hair}
            strokeWidth={11}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 30 0 Q 40 40 30 78"
            stroke={hair}
            strokeWidth={11}
            fill="none"
            strokeLinecap="round"
          />
          <circle cx={-30} cy={80} r={5} fill="#E4572E" />
          <circle cx={30} cy={80} r={5} fill="#2EC4B6" />
        </>
      )}
      {hairStyle === 'chongo' && <circle cx={0} cy={-38} r={15} fill={hair} />}
      {/* cabeza */}
      <ellipse cx={0} cy={0} rx={31} ry={35} fill={skin} />
      {/* pelo de enfrente */}
      {hairStyle === 'canas' ? (
        <path
          d="M -32 -4 Q -30 -40 0 -38 Q 30 -40 32 -4 Q 22 -22 0 -24 Q -22 -22 -32 -4 Z"
          fill={hair}
        />
      ) : hairStyle === 'corto' ? (
        <path
          d="M -32 -2 Q -34 -42 0 -40 Q 34 -42 32 -2 Q 26 -24 4 -26 Q -22 -26 -32 -2 Z"
          fill={hair}
        />
      ) : (
        <path
          d="M -33 4 Q -36 -40 0 -38 Q 36 -40 33 4 Q 28 -20 0 -22 Q -28 -20 -33 4 Z"
          fill={hair}
        />
      )}
      {/* ojos */}
      <ellipse cx={-13} cy={0} rx={3.6} ry={mood === 'sorpresa' ? 5.5 : 4.4} fill="#2A1A12" />
      <ellipse cx={13} cy={0} rx={3.6} ry={mood === 'sorpresa' ? 5.5 : 4.4} fill="#2A1A12" />
      {accessory === 'lentes' && (
        <g stroke="#2A1A12" strokeWidth={2} fill="none">
          <circle cx={-13} cy={0} r={9} />
          <circle cx={13} cy={0} r={9} />
          <path d="M -4 0 L 4 0" />
        </g>
      )}
      {brows}
      <ellipse cx={-21} cy={10} rx={5} ry={3} fill="#E4572E" opacity={0.25} />
      <ellipse cx={21} cy={10} rx={5} ry={3} fill="#E4572E" opacity={0.25} />
      {mouth}
      {accessory === 'sombrero' && (
        <g>
          <ellipse cx={0} cy={-30} rx={50} ry={9} fill="#D9A441" />
          <path d="M -24 -30 Q -22 -60 0 -60 Q 22 -60 24 -30 Z" fill="#E8B850" />
          <rect x={-24} y={-38} width={48} height={6} fill="#7A3B1E" />
        </g>
      )}
    </g>
  )
}
