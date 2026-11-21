import { C, MATERIALS, R, point, wedgePath, arcPath } from './geometry'
import type { Material } from './types'

interface Props {
  material: Material
  parts: number
  highlight?: number
  spread?: boolean
  pieceLabels?: boolean
  /** Pedazo de referencia punteado, como fracción del total. */
  reference?: readonly [number, number]
  /** Sin animación de entrada (para el manipulativo, que cambia a cada rato). */
  still?: boolean
  className?: string
}

export function Circulo({
  material,
  parts,
  highlight = 0,
  spread,
  pieceLabels,
  reference,
  still,
  className,
}: Props) {
  const m = MATERIALS[material]
  const n = Math.max(1, Math.round(parts))
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={`${material} en ${n} partes`}
    >
      <circle cx={C} cy={C + 4} r={R + 2} fill="#000" opacity={0.18} />
      {Array.from({ length: n }, (_, i) => {
        const on = i < highlight
        const mid = -90 + ((i + 0.5) * 360) / n
        const [dx, dy] = point(mid, on && spread ? 10 : 0).map((v) => v - C)
        const [sx, sy] = point(mid, R * 0.55)
        const [tx, ty] = point(mid, R * 0.62)
        return (
          <g
            key={i}
            style={{
              transform: `translate(${dx}px, ${dy}px)`,
              transition: 'transform 400ms cubic-bezier(.2,.8,.2,1)',
            }}
          >
            <g className={still ? undefined : 'piece-in'} style={{ animationDelay: `${i * 60}ms` }}>
              <path
                d={wedgePath(i, n)}
                fill={on ? m.hi : m.fill}
                stroke={on ? '#E4572E' : m.edge}
                strokeWidth={on ? 3 : 1.5}
                strokeLinejoin="round"
              />
              {material === 'tortilla' && n <= 12 && !pieceLabels && (
                <>
                  <circle cx={sx - 4} cy={sy + 3} r={3} fill={m.spot} opacity={0.35} />
                  <circle cx={sx + 6} cy={sy - 5} r={2} fill={m.spot} opacity={0.3} />
                </>
              )}
              {pieceLabels && n > 1 && n <= 8 && (
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={n <= 4 ? 18 : 13}
                  fontWeight={800}
                  fill="#5A3412"
                >
                  1/{n}
                </text>
              )}
            </g>
          </g>
        )
      })}
      {reference && reference[1] > 0 && (
        <path
          d={arcPath(0, reference[0] / reference[1], R + 6)}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={3}
          strokeDasharray="7 6"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
