
/// <reference types="vite/client" />

declare module 'vite' {
  interface Plugin {
    name: string;
    configureServer?: (server: any) => void;
  }
}
