# Cachitos · El puesto de Lupita

Serie vertical interactiva, al estilo TikTok, para aprender fracciones. Está pensada para
estudiantes de 1.º básico en Guatemala que llegaron de primaria sin entenderlas. Cada episodio
termina en un reto. Si fallás, el episodio que sigue ataca el error exacto que cometiste.

Es una PWA sin backend ni login. Las escenas son SVG animado definido como datos, así que
toda la serie pesa kilobytes.

## Correr

```bash
pnpm install
pnpm dev            # desarrollo
pnpm test           # grafo de contenido, aritmética de cada reto y flujo de navegación
pnpm run build      # producción
pnpm run lint
```

`?reset` en la URL borra el progreso, para repetir el demo.

## Dónde está cada cosa

- `src/content/lupita/`: la historia, un archivo por episodio (texto, visuales, reto y a dónde
  ir según el error). Los textos para la familia están en `errores.ts`.
- `src/content/ui.ts`: textos de botones y ayudas.
- `src/engine/`: el reproductor, los retos, el estado y el validador del grafo.
- `src/visuals/`: componentes SVG (tortilla, queso, barras, puesto, personajes).

En los textos, `*así*` resalta en amarillo y las fracciones como `1/4` se formatean solas.

## Narración

El texto en pantalla es la fuente de verdad. La narración es opcional: usa audios pregenerados
con la API de voz de OpenAI y, para las líneas sin audio, la voz en español del dispositivo.

```bash
cp .env.example .env.local   # pegá OPENAI_API_KEY
pnpm run voces --dry         # qué generaría y cuántos caracteres gasta
pnpm run voces --muestra     # una línea por personaje, para elegir voces
pnpm run voces               # todo lo que falte o haya cambiado
```

El reparto de voces está en `src/content/lupita/voces.ts`.
