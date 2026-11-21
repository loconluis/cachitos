import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { clearAll } from './engine/state'
import './index.css'

// Modo demo: ?reset borra el progreso para repetir la presentación.
const url = new URL(window.location.href)
if (url.searchParams.has('reset')) {
  clearAll()
  url.searchParams.delete('reset')
  window.history.replaceState(null, '', url.pathname + url.search + url.hash)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
