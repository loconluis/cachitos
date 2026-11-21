import { useCallback, useEffect, useRef, useState } from 'react'
import { audioKey, toSpeech, type VoiceManifest } from './speechText'

const PREF_KEY = 'cachitos:narracion'
const LANG_RANK = ['es-gt', 'es-mx', 'es-419', 'es-us', 'es-co', 'es-es']

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('es'))
  if (!voices.length) return null
  const rank = (v: SpeechSynthesisVoice) => {
    const i = LANG_RANK.indexOf(v.lang.toLowerCase().replace('_', '-'))
    return (i < 0 ? LANG_RANK.length : i) - (v.localService ? 0.5 : 0)
  }
  return [...voices].sort((a, b) => rank(a) - rank(b))[0] ?? null
}

const voicesBase = (seriesId: string) => `${import.meta.env.BASE_URL}voces/${seriesId}/`

/**
 * Narración opcional. Primero usa los audios pregenerados (public/voces/<serie>/, ver
 * scripts/voces.ts); si una línea no tiene audio, usa speechSynthesis con una voz en español.
 * `available` es falso si no hay ni audios ni voz en español: la interfaz esconde el botón.
 */
export function useNarration(seriesId: string) {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [manifest, setManifest] = useState<VoiceManifest | null>(null)
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(PREF_KEY) === '1'
    } catch {
      return false
    }
  })
  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const update = () => setVoice(pickVoice())
    update()
    window.speechSynthesis.addEventListener('voiceschanged', update)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update)
  }, [])

  useEffect(() => {
    let live = true
    fetch(`${voicesBase(seriesId)}manifest.json`)
      .then((r) => (r.ok ? (r.json() as Promise<VoiceManifest>) : null))
      .then((m) => live && setManifest(m && Object.keys(m).length ? m : null))
      .catch(() => live && setManifest(null))
    return () => {
      live = false
    }
  }, [seriesId])

  const cancel = useCallback(() => {
    if (audio.current) {
      audio.current.onended = audio.current.onerror = null
      audio.current.pause()
      audio.current = null
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  const speakDevice = useCallback(
    (text: string, finish: () => void) => {
      if (!voice) return finish()
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(toSpeech(text))
      u.voice = voice
      u.lang = voice.lang
      u.rate = 1.05
      u.onend = finish
      u.onerror = finish
      window.speechSynthesis.speak(u)
    },
    [voice],
  )

  /** Lee una línea. `onEnd` se llama una sola vez, al terminar o si no se pudo leer. */
  const speak = useCallback(
    (text: string, speaker: string | undefined, onEnd: () => void) => {
      cancel()
      let done = false
      const finish = () => {
        if (!done) {
          done = true
          onEnd()
        }
      }
      const entry = manifest?.[audioKey(text, speaker)]
      if (!entry) return speakDevice(text, finish)

      const a = new Audio(voicesBase(seriesId) + entry.file)
      audio.current = a
      a.onended = finish
      a.onerror = () => speakDevice(text, finish)
      a.play().catch((err: DOMException) => {
        // Sin un toque previo el navegador no deja reproducir: seguimos sin voz.
        if (err.name === 'NotAllowedError') finish()
        else if (err.name !== 'AbortError') speakDevice(text, finish)
      })
    },
    [manifest, seriesId, cancel, speakDevice],
  )

  /** Precarga el audio de una línea que viene pronto, para que no haya silencio al cambiar. */
  const preload = useCallback(
    (text: string, speaker: string | undefined) => {
      const entry = manifest?.[audioKey(text, speaker)]
      if (entry) new Audio(voicesBase(seriesId) + entry.file).preload = 'auto'
    },
    [manifest, seriesId],
  )

  const toggle = useCallback(() => {
    setEnabled((e) => {
      try {
        localStorage.setItem(PREF_KEY, e ? '0' : '1')
      } catch {
        /* sin almacenamiento */
      }
      return !e
    })
  }, [])

  useEffect(() => {
    if (!enabled) cancel()
  }, [enabled, cancel])

  const available = voice !== null || manifest !== null
  return { available, enabled: available && enabled, toggle, speak, preload, cancel }
}

export type Narration = ReturnType<typeof useNarration>
