import type { Frac } from '../engine/types'

const SIZES = {
  sm: 'text-lg leading-none',
  md: 'text-3xl leading-none',
  lg: 'text-5xl leading-none',
}

/** Fracción apilada (numerador sobre denominador). */
export function Fraccion({
  value,
  size = 'md',
}: {
  value: Frac | number
  size?: keyof typeof SIZES
}) {
  if (typeof value === 'number')
    return <span className={`font-black tabular-nums ${SIZES[size]}`}>{value}</span>
  return (
    <span
      className={`inline-flex flex-col items-center font-black tabular-nums ${SIZES[size]}`}
      aria-label={`${value[0]} de ${value[1]}`}
    >
      <span>{value[0]}</span>
      <span className="my-[0.12em] h-[0.09em] min-h-[3px] w-[1.3em] rounded-full bg-current" />
      <span>{value[1]}</span>
    </span>
  )
}
