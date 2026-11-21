import type { Frac } from '../engine/types'
import { MATERIALS, arcPath } from './geometry'
import { Fraccion } from './Fraccion'
import type { Material } from './types'

function Piece({ material, value, win }: { material: Material; value: Frac; win: boolean }) {
  const m = MATERIALS[material]
  const n = value[1]
  return (
    <div className={`flex flex-col items-center gap-2 ${win ? 'win-pulse' : ''}`}>
      <svg viewBox="0 0 200 200" className="w-36" aria-hidden>
        <circle
          cx={100}
          cy={100}
          r={80}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity={0.35}
          strokeWidth={2}
          strokeDasharray="5 6"
        />
        {Array.from({ length: n }, (_, i) => (
          <path
            key={i}
            d={arcPath(i / n, (i + 1) / n)}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity={0.2}
          />
        ))}
        <path
          d={arcPath(0, value[0] / value[1])}
          fill={win ? m.hi : m.fill}
          stroke={win ? '#E4572E' : m.edge}
          strokeWidth={win ? 4 : 2}
          strokeLinejoin="round"
          className="piece-in"
        />
      </svg>
      <Fraccion value={value} size="lg" />
    </div>
  )
}

export function Comparar({
  material,
  left,
  right,
  winner,
  winnerTag,
}: {
  material: Material
  left: Frac
  right: Frac
  winner?: 'left' | 'right' | 'tie'
  winnerTag?: string
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="flex items-end justify-center gap-4">
        <Piece material={material} value={left} win={winner === 'left' || winner === 'tie'} />
        <span className="pb-10 text-3xl font-black text-white/60">
          {winner === 'tie' ? '=' : 'vs'}
        </span>
        <Piece material={material} value={right} win={winner === 'right' || winner === 'tie'} />
      </div>
      {winnerTag && (
        <span className="pop-in rounded-full bg-[#F3B61F] px-4 py-1 text-base font-black text-[#3B2350]">
          {winnerTag}
        </span>
      )}
    </div>
  )
}
