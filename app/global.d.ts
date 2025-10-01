// global.d.ts
export {};

declare global {
  interface Window {
    umami?: (eventName: string, eventProps?: Record<string, any>) => void;
  }
}
