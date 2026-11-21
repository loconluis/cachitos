/**
 * Genera los audios de la narración con la API de texto a voz de xAI.
 *
 *   pnpm run voces                 genera lo que falta o cambió (todas las series)
 *   pnpm run voces --muestra       una línea por personaje, para comparar voces
 *   pnpm run voces --solo ep1,r1
 *   pnpm run voces --force         regenera todo lo seleccionado
 *   pnpm run voces --dry           solo muestra qué haría y cuánto costaría
 *
 * Necesita XAI_API_KEY en .env.local. La clave se usa solo acá, nunca va dentro de la app.
 * Escribe public/voces/<serie>/<clave>.mp3 y public/voces/<serie>/manifest.json.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { runnerImport } from 'vite'
import type { Series } from '../src/engine/types'
import type * as SpeechText from '../src/engine/speechText'

const ENDPOINT = 'https://api.x.ai/v1/tts'
const USD_PER_MILLION_CHARS = 15

const { values: args } = parseArgs({
  args: process.argv.slice(2).filter((a) => a !== '--'),
  options: {
    muestra: { type: 'boolean', default: false },
    solo: { type: 'string' },
    force: { type: 'boolean', default: false },
    dry: { type: 'boolean', default: false },
  },
})

try {
  process.loadEnvFile('.env.local')
} catch {
  /* sin .env.local: puede venir del entorno */
}
const apiKey = process.env.XAI_API_KEY?.trim()
if (!apiKey && !args.dry) {
  console.error('Falta XAI_API_KEY. Copiá .env.example a .env.local y pegá tu clave de xAI.')
  process.exit(1)
}

const { module: content } = await runnerImport<{ allSeries: readonly Series[] }>(
  './src/content/index.ts',
)
const { module: speech } = await runnerImport<typeof SpeechText>('./src/engine/speechText.ts')

async function tts(text: string, voice: string, language: string): Promise<Buffer> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice_id: voice, language }),
      signal: AbortSignal.timeout(60_000),
    })
    const type = res.headers.get('content-type') ?? ''
    if (res.ok && !type.includes('json')) return Buffer.from(await res.arrayBuffer())
    const body = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      continue
    }
    throw new Error(`xAI respondió ${res.status}: ${body.slice(0, 300)}`)
  }
}

const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`
let totalChars = 0
let failures = 0

for (const series of content.allSeries) {
  const casting = series.voices
  if (!casting) {
    console.log(`· ${series.id}: sin reparto de voces, se omite`)
    continue
  }
  const dir = join('public', 'voces', series.id)
  const manifestPath = join(dir, 'manifest.json')
  mkdirSync(dir, { recursive: true })
  const manifest: SpeechText.VoiceManifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, 'utf8'))
    : {}

  const only = args.solo?.split(',').map((s) => s.trim())
  let lines = speech.narrationLines(series, only)
  if (args.muestra) {
    const seen = new Set<string>()
    lines = lines.filter((l) => !seen.has(l.speaker) && seen.add(l.speaker))
  }

  const voiceFor = (speaker: string) => casting.bySpeaker[speaker] ?? casting.fallback
  const todo = lines.filter((l) => {
    const prev = manifest[l.key]
    return (
      args.force || !prev || prev.voice !== voiceFor(l.speaker) || !existsSync(join(dir, prev.file))
    )
  })
  const chars = todo.reduce((a, l) => a + speech.toSpeech(l.text).length, 0)
  totalChars += chars
  console.log(
    `\n${series.title}: ${lines.length} líneas, ${todo.length} por generar (${chars} caracteres ≈ US$${((chars / 1e6) * USD_PER_MILLION_CHARS).toFixed(3)})`,
  )

  for (const [i, line] of todo.entries()) {
    const voice = voiceFor(line.speaker)
    const said = speech.toSpeech(line.text)
    const tag = `[${i + 1}/${todo.length}] ${line.where} (${line.speaker} → ${voice})`
    if (args.dry) {
      console.log(`  ${tag}: ${said}`)
      continue
    }
    try {
      const audio = await tts(said, voice, casting.language)
      const file = `${line.key}.mp3`
      writeFileSync(join(dir, file), audio)
      manifest[line.key] = { file, voice, text: line.text }
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
      console.log(`  ✓ ${tag} ${kb(audio.length)}`)
    } catch (e) {
      failures++
      console.error(`  ✗ ${tag}: ${(e as Error).message}`)
      if (failures === 1 && /fetch failed|certificate/i.test(String((e as Error).cause ?? e)))
        console.error(
          '    ¿La red bloquea HTTPS? Probá desde otra red (por ejemplo, el hotspot del teléfono).',
        )
    }
  }

  // Con la serie completa seleccionada, borrar audios de textos que ya no existen.
  if (!only && !args.muestra && !args.dry) {
    const live = new Set(lines.map((l) => l.key))
    for (const key of Object.keys(manifest)) {
      if (live.has(key)) continue
      rmSync(join(dir, manifest[key]!.file), { force: true })
      delete manifest[key]
    }
    for (const f of readdirSync(dir))
      if (f.endsWith('.mp3') && !Object.values(manifest).some((m) => m.file === f))
        rmSync(join(dir, f))
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  }

  const size = readdirSync(dir).reduce((a, f) => a + statSync(join(dir, f)).size, 0)
  console.log(`  Audios en ${dir}: ${Object.keys(manifest).length} archivos, ${kb(size)}`)
}

console.log(
  `\nTotal enviado: ${totalChars} caracteres ≈ US$${((totalChars / 1e6) * USD_PER_MILLION_CHARS).toFixed(3)}${failures ? ` · ${failures} con error` : ''}`,
)
process.exit(failures ? 1 : 0)
