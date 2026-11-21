import { Fraccion } from '../visuals/Fraccion'

const FRACTION = /(\d+\/\d+)/

function withFractions(text: string, stacked: boolean, keyPrefix: string) {
  return text.split(FRACTION).map((t, i) => {
    if (i % 2 === 0) return t
    const [n, d] = t.split('/').map(Number) as [number, number]
    return stacked ? (
      <span key={`${keyPrefix}${i}`} className="mx-auto mb-1 block w-fit">
        <Fraccion value={[n, d]} size="md" />
      </span>
    ) : (
      <span key={`${keyPrefix}${i}`} className="font-black whitespace-nowrap tabular-nums">
        {t}
      </span>
    )
  })
}

/** Texto de contenido: `*así*` se resalta en amarillo y las fracciones van en negrita (o apiladas). */
export function RichText({ text, stacked = false }: { text: string; stacked?: boolean }) {
  return (
    <>
      {text.split('*').map((p, i) =>
        i % 2 ? (
          <mark key={i} className="bg-transparent text-[#F3B61F]">
            {withFractions(p, stacked, `${i}-`)}
          </mark>
        ) : (
          <span key={i}>{withFractions(p, stacked, `${i}-`)}</span>
        ),
      )}
    </>
  )
}
