import { Barras } from './Barras'
import { Circulo } from './Circulo'
import { Comparar } from './Comparar'
import { Puesto } from './Puesto'
import type { Visual } from './types'

/** Registro de componentes visuales: el contenido elige uno por `kind` y le pasa sus datos. */
export function VisualView({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case 'puesto':
      return <Puesto people={visual.people} goods={visual.goods} />
    case 'circulo':
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <Circulo {...visual} className="w-[78%] max-w-[280px]" />
          {visual.caption && <p className="text-center text-2xl font-black">{visual.caption}</p>}
        </div>
      )
    case 'comparar':
      return <Comparar {...visual} />
    case 'barras':
      return <Barras {...visual} />
    case 'titulo':
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
          {visual.emoji && <span className="pop-in text-6xl">{visual.emoji}</span>}
          <span className="text-sm font-black tracking-[0.2em] text-[#F3B61F] uppercase">
            {visual.kicker}
          </span>
          <h1 className="text-4xl leading-tight font-black">{visual.title}</h1>
        </div>
      )
  }
}
