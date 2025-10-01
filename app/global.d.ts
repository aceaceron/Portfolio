// global.d.ts
declare global {
  interface Window {
    umami: (eventName: string) => void;
  }
}

export {};
