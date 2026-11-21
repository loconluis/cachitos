const COLORS = ['#F3B61F', '#2EC4B6', '#E4572E', '#8E3B8C']

export interface BarSpec {
  parts: number
  filled: number
  label?: string
  color?: string
}

/** Una barra partida en `parts`, con `filled` partes llenas. */
export function Barra({
  parts,
  filled,
  color = COLORS[0],
  label,
  translucent,
  instant,
}: BarSpec & { translucent?: boolean; instant?: boolean }) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="relative flex h-14 flex-1 overflow-hidden rounded-xl border-[3px] border-white/80 bg-white/10">
        {Array.from({ length: parts }, (_, i) => (
          <div key={i} className="relative flex-1 border-r-2 border-white/60 last:border-r-0">
            <div
              className={`absolute inset-0 origin-left transition-transform ${instant ? 'duration-100' : 'duration-300'}`}
              style={{
                background: color,
                opacity: translucent ? 0.65 : 1,
                transform: `scaleX(${i < filled ? 1 : 0})`,
                transitionDelay: instant ? '0ms' : `${i * 80}ms`,
              }}
            />
          </div>
        ))}
      </div>
      {label && <span className="w-14 text-right text-2xl font-black">{label}</span>}
    </div>
  )
}

export function Barras({
  bars,
  overlap,
  caption,
}: {
  bars: readonly BarSpec[]
  overlap?: boolean
  caption?: string
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6">
      {overlap ? (
        <div className="relative w-full">
          {bars.map((b, i) => (
            <div key={i} className={i === 0 ? 'relative' : 'absolute inset-0'}>
              <Barra {...b} color={b.color ?? COLORS[i % COLORS.length]} translucent={i > 0} />
            </div>
          ))}
        </div>
      ) : (
        bars.map((b, i) => <Barra key={i} {...b} color={b.color ?? COLORS[i % COLORS.length]} />)
      )}
      {caption && <p className="text-center text-lg font-bold text-white/80">{caption}</p>}
    </div>
  )
}
