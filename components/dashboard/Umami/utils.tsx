export const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const countryFlags: Record<string, string> = {
  PH: "🇵🇭", US: "🇺🇸", BE: "🇧🇪", TH: "🇹🇭", GB: "🇬🇧",
  CA: "🇨🇦", AU: "🇦🇺", DE: "🇩🇪", FR: "🇫🇷", JP: "🇯🇵",
  KR: "🇰🇷", CN: "🇨🇳", IN: "🇮🇳", SG: "🇸🇬", MY: "🇲🇾",
  ID: "🇮🇩", VN: "🇻🇳", BR: "🇧🇷", MX: "🇲🇽", ES: "🇪🇸",
  IT: "🇮🇹", NL: "🇳🇱", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰",
  FI: "🇫🇮", PL: "🇵🇱", RU: "🇷🇺", TR: "🇹🇷", SA: "🇸🇦",
  AE: "🇦🇪", IL: "🇮🇱", EG: "🇪🇬", ZA: "🇿🇦", NG: "🇳🇬",
  KE: "🇰🇪", AR: "🇦🇷", CL: "🇨🇱", CO: "🇨🇴", PE: "🇵🇪",
  NZ: "🇳🇿", PT: "🇵🇹", CH: "🇨🇭", AT: "🇦🇹", IE: "🇮🇪",
  CZ: "🇨🇿", HU: "🇭🇺", RO: "🇷🇴",
};

export const countryNames: Record<string, string> = {
  PH: "Philippines", US: "United States", BE: "Belgium", TH: "Thailand", GB: "United Kingdom",
  CA: "Canada", AU: "Australia", DE: "Germany", FR: "France", JP: "Japan",
  KR: "South Korea", CN: "China", IN: "India", SG: "Singapore", MY: "Malaysia",
  ID: "Indonesia", VN: "Vietnam", BR: "Brazil", MX: "Mexico", ES: "Spain",
  IT: "Italy", NL: "Netherlands", SE: "Sweden", NO: "Norway", DK: "Denmark",
  FI: "Finland", PL: "Poland", RU: "Russia", TR: "Turkey", SA: "Saudi Arabia",
  AE: "United Arab Emirates", IL: "Israel", EG: "Egypt", ZA: "South Africa", NG: "Nigeria",
  KE: "Kenya", AR: "Argentina", CL: "Chile", CO: "Colombia", PE: "Peru",
  NZ: "New Zealand", PT: "Portugal", CH: "Switzerland", AT: "Austria", IE: "Ireland",
  CZ: "Czech Republic", HU: "Hungary", RO: "Romania",
};

export function getCountryFlag(code: string) {
  return countryFlags[code.toUpperCase()] || "🌍";
}

export function getCountryName(code: string) {
  return countryNames[code.toUpperCase()] || code;
}

export function formatDuration(seconds: number) {
  if (seconds === 0) return "0s";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);
  return parts.join(", ");
}
