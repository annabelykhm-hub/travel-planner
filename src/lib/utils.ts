import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(start: string, end: string) {
  const startDate = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
  const fmt = (d: Date, withYear: boolean) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: withYear ? "numeric" : undefined });
  if (sameMonth) {
    return `${startDate.toLocaleDateString("en-US", { month: "short" })} ${startDate.getDate()}–${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  return `${fmt(startDate, false)} – ${fmt(endDate, true)}`;
}

export function tripDays(start: string, end: string) {
  const ms = new Date(end + "T00:00:00").getTime() - new Date(start + "T00:00:00").getTime();
  const days = Math.round(ms / 86400000) + 1;
  return `${days} ${days === 1 ? "day" : "days"}`;
}

const COUNTRY_FLAGS: Record<string, string> = {
  "afghanistan": "🇦🇫", "albania": "🇦🇱", "algeria": "🇩🇿", "andorra": "🇦🇩", "angola": "🇦🇴",
  "argentina": "🇦🇷", "armenia": "🇦🇲", "australia": "🇦🇺", "austria": "🇦🇹", "azerbaijan": "🇦🇿",
  "bahrain": "🇧🇭", "bangladesh": "🇧🇩", "belarus": "🇧🇾", "belgium": "🇧🇪", "bolivia": "🇧🇴",
  "bosnia": "🇧🇦", "brazil": "🇧🇷", "bulgaria": "🇧🇬", "cambodia": "🇰🇭", "canada": "🇨🇦",
  "chile": "🇨🇱", "china": "🇨🇳", "colombia": "🇨🇴", "croatia": "🇭🇷", "cuba": "🇨🇺",
  "cyprus": "🇨🇾", "czech republic": "🇨🇿", "czechia": "🇨🇿", "denmark": "🇩🇰", "ecuador": "🇪🇨",
  "egypt": "🇪🇬", "estonia": "🇪🇪", "ethiopia": "🇪🇹", "finland": "🇫🇮", "france": "🇫🇷",
  "georgia": "🇬🇪", "germany": "🇩🇪", "ghana": "🇬🇭", "greece": "🇬🇷", "hungary": "🇭🇺",
  "iceland": "🇮🇸", "india": "🇮🇳", "indonesia": "🇮🇩", "iran": "🇮🇷", "iraq": "🇮🇶",
  "ireland": "🇮🇪", "israel": "🇮🇱", "italy": "🇮🇹", "japan": "🇯🇵", "jordan": "🇯🇴",
  "kazakhstan": "🇰🇿", "kenya": "🇰🇪", "kuwait": "🇰🇼", "kyrgyzstan": "🇰🇬", "latvia": "🇱🇻",
  "lebanon": "🇱🇧", "libya": "🇱🇾", "lithuania": "🇱🇹", "luxembourg": "🇱🇺", "malaysia": "🇲🇾",
  "maldives": "🇲🇻", "malta": "🇲🇹", "mexico": "🇲🇽", "moldova": "🇲🇩", "monaco": "🇲🇨",
  "mongolia": "🇲🇳", "montenegro": "🇲🇪", "morocco": "🇲🇦", "myanmar": "🇲🇲", "nepal": "🇳🇵",
  "netherlands": "🇳🇱", "new zealand": "🇳🇿", "nigeria": "🇳🇬", "north korea": "🇰🇵", "norway": "🇳🇴",
  "oman": "🇴🇲", "pakistan": "🇵🇰", "palestine": "🇵🇸", "panama": "🇵🇦", "peru": "🇵🇪",
  "philippines": "🇵🇭", "poland": "🇵🇱", "portugal": "🇵🇹", "qatar": "🇶🇦", "romania": "🇷🇴",
  "russia": "🇷🇺", "saudi arabia": "🇸🇦", "serbia": "🇷🇸", "singapore": "🇸🇬", "slovakia": "🇸🇰",
  "slovenia": "🇸🇮", "south africa": "🇿🇦", "south korea": "🇰🇷", "spain": "🇪🇸", "sri lanka": "🇱🇰",
  "sweden": "🇸🇪", "switzerland": "🇨🇭", "syria": "🇸🇾", "taiwan": "🇹🇼", "tajikistan": "🇹🇯",
  "tanzania": "🇹🇿", "thailand": "🇹🇭", "tunisia": "🇹🇳", "turkey": "🇹🇷", "turkmenistan": "🇹🇲",
  "ukraine": "🇺🇦", "united arab emirates": "🇦🇪", "uae": "🇦🇪", "united kingdom": "🇬🇧",
  "uk": "🇬🇧", "united states": "🇺🇸", "united states of america": "🇺🇸", "usa": "🇺🇸", "us": "🇺🇸", "america": "🇺🇸", "uzbekistan": "🇺🇿",
  "venezuela": "🇻🇪", "vietnam": "🇻🇳", "yemen": "🇾🇪",
};

export function countryFlag(country: string | null | undefined): string {
  if (!country) return "";
  return COUNTRY_FLAGS[country.trim().toLowerCase()] ?? "";
}

export function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
