# Cachitos · El puesto de Lupita

MVP de hackathon, track EdTech "Aprender y enseñar en Guatemala". El jurado evalúa que la
herramienta ayude a una persona concreta con una dificultad específica, y que en el demo alguien
practique una habilidad en vivo. Rechazan el "tutor con IA genérico". Por eso el proyecto es
**deliberadamente angosto**: un tema (fracciones), un tipo de usuario, una serie.

## Para quién

Estudiante de 1.º básico (12 a 14 años) que llegó de primaria sin entender fracciones. Usa el
Android de gama baja de su familia, con datos prepago limitados. Nadie le dice a tiempo qué está
mal ni por qué, y proporciones y álgebra se construyen encima de ese vacío.

## Qué es

PWA con formato de serie de TikTok: episodios verticales de 30 a 60 s, a pantalla completa, con
historia continua y gancho al final. Cada episodio termina en un reto que se resuelve tocando la
pantalla. **El episodio siguiente depende de cómo falló**: cada respuesta incorrecta está ligada
a un error conceptual y lleva a un refuerzo que ataca ese error. Después del refuerzo viene un
reto **nuevo** sobre la misma idea (no el mismo repetido) y luego se retoma la historia. Los
episodios no son video: son escenas SVG animadas, definidas como datos.

### La serie

Lupita, de 13 años, atiende sola un sábado el puesto de su mamá en el mercado.

1. Comparar fracciones unitarias (1/4 vs 1/8 de queso). Error: "denominador más grande = fracción más grande" → **R1** (partir una tortilla en más pedazos y ver que se achican).
2. Equivalencia (2/4 lb = 1/2 lb). Error: "números distintos = cantidades distintas" → **R2** (barras superpuestas).
3. Suma con distinto denominador (1/2 + 1/4 lb). Error: "se suman arriba y abajo" (2/6) → **R3** (solo se suman pedazos del mismo tamaño).
4. Fracción de una cantidad (3/4 de Q20).
5. Final que combina todo.

Al menos dos retos deben ser manipulativos (partir tortilla, llenar barra), no opción múltiple.
Cada respuesta correcta se verifica aritméticamente en los tests.

### Pantallas

- **Reproductor:** avanza solo, barra segmentada arriba, tocar al centro pausa, tocar los lados retrocede o avanza.
- **Reto:** bloquea el avance hasta responder.
- **Respuesta:** nunca se muestra "incorrecto" con la respuesta. Se enlaza con el refuerzo desde la historia ("Lupita duda, veámoslo con la tortilla").
- **Cierre:** "lo que te costaba" y "lo que ya dominás", según los errores reales, y un botón de WhatsApp con un mensaje corto para la familia y una actividad de 5 minutos sobre el error más frecuente.

## Restricciones

- Vite + React + TypeScript + Tailwind, vite-plugin-pwa. Sin backend, sin login, **sin llamadas de red después de la primera carga**. Progreso en localStorage.
- Diseño primero para 360x640. En escritorio, marco de teléfono centrado (se proyecta ante el jurado).
- El texto en pantalla es la fuente de verdad. La narración es opcional y el botón se oculta si no hay voz.
- El contenido vive en `src/content/` como datos tipados. **Agregar otra serie no debe requerir tocar componentes.**
- Animaciones solo con transform y opacity, sin librerías pesadas.
- Idioma: español de Guatemala, tono cercano entre pares, **con voseo** (partí, mirá, vos). El equipo revisa los textos: tienen que ser fáciles de encontrar y editar.

## Fuera de alcance (preguntar antes de agregar)

Chat, IA en tiempo de ejecución, cuentas, panel docente, otras materias, video real, backend.
La voz generada con OpenAI está permitida porque corre **al construir**, no en el teléfono.

## Criterio de terminado

- Recorrer la serie acertando todo toma menos de 6 minutos (lo revisa un test).
- Fallar el reto 1 eligiendo 1/8 lleva a R1, luego a un reto distinto sobre la misma idea y luego al Ep. 2 (lo revisa un test).
- Con la app cargada una vez, todo funciona en modo avión.
- Un test recorre el grafo: toda opción incorrecta apunta a un episodio existente y no hay callejones sin salida.
- El build pasa y el bundle inicial es pequeño (reportar el tamaño).

## Modo demo

- `?reset` borra el progreso.
- `/grabar/:id` reproduce un episodio en 9:16 sin controles ni reto, para grabar y subir a TikTok. Es lo último en prioridad.

## Estado y orden de trabajo

1. ✅ Motor + Ep. 1 + R1 (+ `r1-repaso`) de punta a punta.
2. ⏳ El usuario revisa el tono y el motor **antes** de escribir el resto del contenido.
3. Ep. 2 a 5, R2 y R3 (hoy `ep2` es un esqueleto en `src/content/lupita/index.ts`).
4. Cierre completo con WhatsApp (hoy `src/engine/Closing.tsx` es provisional).
5. PWA y modo avión. Los audios de `public/voces/` **no** van en la precarga: se cachean solo si se activa la narración.
6. `/grabar/:id`.

## Arquitectura

- `src/engine/types.ts`: modelo de contenido (Series, Episode, Scene, Challenge, Transition, Misconception).
- `src/engine/state.ts`: reducer puro de navegación más persistencia. `outcomeFor` traduce la respuesta a acierto o error conceptual, y `transitionFor` decide a dónde ir.
- `src/engine/validate.ts`: validador del grafo y de la aritmética. Cada reto declara `solution` como expresión (`{op:'div', args:[[1,4],2]}`) y el test la compara con las respuestas.
- `src/engine/Player.tsx`: el reloj de la escena es la animación CSS de la barra de progreso (`onAnimationEnd`). Con narración activa, también espera a que termine la voz.
- `src/engine/challenges/`: `choice`, `split` (partir el círculo) y `fill` (llenar la barra).
- `src/visuals/`: componentes SVG elegidos por `visual.kind`. Para agregar uno: el tipo en `visuals/types.ts` y el caso en `VisualView.tsx`.
- `src/content/lupita/`: un archivo por episodio, más `errores.ts`, `personajes.ts` y `voces.ts`. En los textos, `*así*` resalta y `n/d` se formatea como fracción.
- Decisión: si falla también el reto de un refuerzo, va a un "repaso" corto que muestra la respuesta y sigue la historia. El grafo es acíclico a propósito.

## Comandos

```bash
pnpm dev | pnpm test | pnpm run build | pnpm run lint | pnpm run format
pnpm run voces --dry | --muestra | --solo ep1,r1 | --force
```

- Usar **pnpm**, no npm. Node vía nvm (`.nvmrc`).
- Correr `pnpm run lint` antes de cada commit.

## Narración (OpenAI)

- `scripts/voces.ts` llama a `POST https://api.openai.com/v1/audio/speech` (`model` gpt-4o-mini-tts, `voice`, `input`, `instructions`), que devuelve MP3. Escribe `public/voces/<serie>/<hash>.mp3` y `manifest.json`.
- La clave va en `.env.local` (`OPENAI_API_KEY`, ignorado por git). Nunca la incluyas en la app ni en commits.
- El hash sale de quién habla más el texto (`src/engine/speechText.ts`). Si se edita un texto, la app vuelve a speechSynthesis hasta regenerar.
- Las voces son nombres de OpenAI (coral, sage, ash…) más `styles` opcionales por personaje en `src/content/lupita/voces.ts`. Aún no se han escuchado.

## Trampas conocidas

- La red de la hackathon intercepta TLS (Fortinet): npm falla con `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. Las dependencias se instalaron con `pnpm add --offline` desde la caché local, con versiones fijas (Vite 7.2, TS 5.9, Tailwind vía `@tailwindcss/postcss`). `vite-plugin-pwa` **no** está en la caché: hace falta otra red o escribir el service worker a mano. Falta comprobar si `api.openai.com` pasa. No desactivar `strict-ssl`.
- En SVG, una animación CSS con `transform` pisa el atributo `transform`: anidá un `<g>` para posicionar y otro para animar.
- Para verificar la interfaz no hay Playwright. Se usó Chrome headless por CDP (script en el scratchpad de la sesión).
