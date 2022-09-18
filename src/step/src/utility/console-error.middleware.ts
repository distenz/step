import type { ComponentPublicInstance } from 'vue'
const consoleSpacing = 'padding: .125rem .25rem;'
const consoleStyle = {
  divider: `
    ${consoleSpacing}
    background-color: green;
    color: yellow;
  `,
  source: `
    ${consoleSpacing}
    background-color: #000;
    color: #fff;
  `,
  type: `
    ${consoleSpacing}
    background-color: #ccc;
    color: #111;
  `,
  error: `
    ${consoleSpacing}
    background-color: red;
    color: yellow;
  `,
}

export function consoleErrorMiddleware(
  error: unknown,
  instance: ComponentPublicInstance | null,
  info: string
): void {
  console.error(
    `%c${instance?.$.type.__name} [${
      instance?.$.type.__file
    }]%c/%c${info}%c/%cE:${(<Error>error).message}`,
    consoleStyle.source,
    consoleStyle.divider,
    consoleStyle.type,
    consoleStyle.divider,
    consoleStyle.error
  )
}
