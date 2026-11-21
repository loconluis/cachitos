import { useEffect, useState, type ReactNode } from 'react'
import { defaultSeries } from './content'
import { Player } from './engine/Player'
import { SeriesContext } from './engine/SeriesContext'

const W = 360
const H = 640

/** En escritorio, el teléfono se dibuja centrado y escalado para proyectarlo ante el jurado. */
function useDesktopScale(): number | null {
  const compute = () => {
    const desktop = window.matchMedia('(min-width: 700px) and (min-height: 560px)').matches
    return desktop
      ? Math.min((window.innerHeight - 48) / (H + 24), (window.innerWidth - 48) / (W + 24))
      : null
  }
  const [scale, setScale] = useState(compute)
  useEffect(() => {
    const onResize = () => setScale(compute())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return scale
}

function Frame({ children }: { children: ReactNode }) {
  const scale = useDesktopScale()
  if (scale === null)
    return <div className="stage relative h-dvh w-full overflow-hidden">{children}</div>
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-[#140B1F]">
      <div
        className="shrink-0 rounded-[36px] bg-[#0B0612] p-3 shadow-2xl ring-1 ring-white/10"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className="stage relative overflow-hidden rounded-[26px]"
          style={{ width: W, height: H }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function App() {
  const series = defaultSeries
  return (
    <SeriesContext.Provider value={series}>
      <Frame>
        <Player series={series} />
      </Frame>
    </SeriesContext.Provider>
  )
}
