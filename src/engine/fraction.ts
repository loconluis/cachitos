import type { Expr, Frac } from './types'

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a || 1
}

export function frac(n: number, d = 1): Frac {
  if (d === 0) throw new Error('Denominador cero')
  const s = d < 0 ? -1 : 1
  const g = gcd(n, d)
  return [(s * n) / g, (s * d) / g]
}

export const toFrac = (v: Frac | number): Frac =>
  typeof v === 'number' ? frac(v) : frac(v[0], v[1])

export const add = (a: Frac, b: Frac) => frac(a[0] * b[1] + b[0] * a[1], a[1] * b[1])
export const sub = (a: Frac, b: Frac) => frac(a[0] * b[1] - b[0] * a[1], a[1] * b[1])
export const mul = (a: Frac, b: Frac) => frac(a[0] * b[0], a[1] * b[1])
export const div = (a: Frac, b: Frac) => frac(a[0] * b[1], a[1] * b[0])
export const cmp = (a: Frac, b: Frac) => a[0] * b[1] - b[0] * a[1]
export const eq = (a: Frac | number, b: Frac | number) => cmp(toFrac(a), toFrac(b)) === 0

export function evaluate(e: Expr): Frac {
  if (typeof e === 'number' || Array.isArray(e)) return toFrac(e as Frac | number)
  const [first, ...rest] = (e as Exclude<Expr, Frac | number>).args.map(evaluate)
  if (!first) throw new Error('Expresión sin argumentos')
  const { op } = e as Exclude<Expr, Frac | number>
  return rest.reduce((acc, x) => {
    switch (op) {
      case 'add':
        return add(acc, x)
      case 'sub':
        return sub(acc, x)
      case 'mul':
        return mul(acc, x)
      case 'div':
        return div(acc, x)
      case 'max':
        return cmp(acc, x) >= 0 ? acc : x
      case 'min':
        return cmp(acc, x) <= 0 ? acc : x
    }
  }, first)
}

export const show = (f: Frac) => (f[1] === 1 ? `${f[0]}` : `${f[0]}/${f[1]}`)
