// lib/umami.ts

// No global augmentation needed
export const trackUmamiEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).umami) {
    // Cast window to 'any' locally to avoid type conflicts
    (window as any).umami.track(eventName, data);
  } else {
    console.warn(`[Umami Track] Not available to send event: ${eventName}`);
  }
};
