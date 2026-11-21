import { useSeries } from '../engine/SeriesContext'
import { Persona } from './Persona'
import type { Goods, Mood } from './types'

const STRIPES = [
  '#E4572E',
  '#F3B61F',
  '#2EC4B6',
  '#8E3B8C',
  '#F3B61F',
  '#E4572E',
  '#2EC4B6',
  '#8E3B8C',
  '#F3B61F',
]

function Good({ kind, x }: { kind: Goods; x: number }) {
  switch (kind) {
    case 'queso':
      return (
        <g transform={`translate(${x} 222)`}>
          <ellipse cx={0} cy={6} rx={30} ry={12} fill="#E6D7AE" />
          <rect x={-30} y={-6} width={60} height={12} fill="#F4E8C6" />
          <ellipse cx={0} cy={-6} rx={30} ry={12} fill="#FFF6DF" stroke="#D9C48E" />
        </g>
      )
    case 'tortillas':
      return (
        <g transform={`translate(${x} 220)`}>
          <path d="M -34 -4 L 34 -4 L 26 18 L -26 18 Z" fill="#B5652B" />
          <path d="M -34 -4 L 34 -4" stroke="#7A3B1E" strokeWidth={3} />
          {[0, 1, 2].map((i) => (
            <ellipse
              key={i}
              cx={0}
              cy={-8 - i * 4}
              rx={28}
              ry={7}
              fill="#E9C27E"
              stroke="#B98340"
            />
          ))}
          <path d="M -30 -14 Q 0 -30 30 -14 L 30 -8 L -30 -8 Z" fill="#E4572E" opacity={0.9} />
        </g>
      )
    case 'frijol':
      return (
        <g transform={`translate(${x} 214)`}>
          <path d="M -24 24 Q -30 -8 -16 -18 L 16 -18 Q 30 -8 24 24 Z" fill="#C9A66B" />
          <ellipse cx={0} cy={-16} rx={16} ry={5} fill="#2A1A12" />
          <text x={0} y={10} textAnchor="middle" fontSize={11} fontWeight={800} fill="#5A3412">
            lb
          </text>
        </g>
      )
    case 'monedas':
      return (
        <g transform={`translate(${x} 226)`}>
          {[0, 1, 2].map((i) => (
            <ellipse
              key={i}
              cx={i * 6 - 6}
              cy={-i * 5}
              rx={14}
              ry={5}
              fill="#F3B61F"
              stroke="#B5852B"
            />
          ))}
          <text x={0} y={-16} textAnchor="middle" fontSize={12} fontWeight={900} fill="#F3B61F">
            Q
          </text>
        </g>
      )
  }
}

export function Puesto({
  people,
  goods = ['queso', 'tortillas'],
}: {
  people: readonly { id: string; mood?: Mood }[]
  goods?: readonly Goods[]
}) {
  const { characters } = useSeries()
  const xs = people.length === 1 ? [180] : people.length === 2 ? [112, 250] : [80, 180, 280]
  return (
    <svg viewBox="0 0 360 300" className="h-full w-full" role="img" aria-label="Puesto del mercado">
      <rect width={360} height={300} fill="#3B2350" />
      <rect y={40} width={360} height={200} fill="#4A2D63" />
      {/* toldo */}
      {STRIPES.map((c, i) => (
        <rect key={i} x={i * 40} y={0} width={40} height={42} fill={c} />
      ))}
      {STRIPES.map((c, i) => (
        <path key={i} d={`M ${i * 40} 42 q 20 22 40 0 Z`} fill={c} />
      ))}
      <rect x={8} y={60} width={8} height={180} fill="#7A3B1E" />
      <rect x={344} y={60} width={8} height={180} fill="#7A3B1E" />
      {people.map((p, i) => {
        const c = characters[p.id]
        if (!c) return null
        return (
          <g key={p.id} transform={`translate(${xs[i] ?? 180} 120)`}>
            <g className="person-in" style={{ animationDelay: `${i * 120}ms` }}>
              <Persona look={c.look} mood={p.mood} flip={i > 0} />
            </g>
          </g>
        )
      })}
      {/* mesa */}
      <rect x={0} y={228} width={360} height={72} fill="#8A4B22" />
      <rect x={0} y={228} width={360} height={10} fill="#A35E2E" />
      {[60, 150, 240, 330].map((x) => (
        <rect key={x} x={x} y={244} width={3} height={56} fill="#6E3A18" />
      ))}
      {goods.map((g, i) => (
        <Good key={g} kind={g} x={50 + i * (260 / Math.max(1, goods.length - 1 || 1))} />
      ))}
    </svg>
  )
}
