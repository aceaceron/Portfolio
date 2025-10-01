// lib/iconMapper.ts
import { FaHtml5, FaCss3, FaJs, FaPhp } from "react-icons/fa";
import { SiMysql, SiNextdotjs, SiTailwindcss, SiSupabase } from "react-icons/si";

export const iconMap: Record<string, any> = {
  FaHtml5,
  FaCss3,
  FaJs,
  FaPhp,
  SiMysql,
  SiNextdotjs,
  SiTailwindcss,
  SiSupabase,
};

export function getIconByName(name: string) {
  return iconMap[name] || FaHtml5; // fallback
}
