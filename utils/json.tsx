export function safeJsonParse(jsonString: string | any, fallback: any = null) {
  if (typeof jsonString === "string") {
    try {
      return JSON.parse(jsonString);
    } catch {
      return fallback;
    }
  }
  return jsonString || fallback;
}
