export const NAMED_EVENT_COLORS: Record<string, { hex: string; label: string }> = {
  indigo: { hex: "#6366f1", label: "Indigo" },
  rose: { hex: "#f43f5e", label: "Rose" },
  emerald: { hex: "#10b981", label: "Emerald" },
  amber: { hex: "#f59e0b", label: "Amber" },
  cyan: { hex: "#06b6d4", label: "Cyan" },
  violet: { hex: "#8b5cf6", label: "Violet" },
};

export function resolveEventColor(color?: string | null) {
  if (!color) return NAMED_EVENT_COLORS.indigo.hex;
  const c = color.trim().toLowerCase();
  if (c.startsWith("#")) return c;
  return NAMED_EVENT_COLORS[c]?.hex ?? NAMED_EVENT_COLORS.indigo.hex;
}

export function resolveEventColorKey(color?: string | null) {
  if (!color) return "indigo";
  const c = color.trim().toLowerCase();
  if (c.startsWith("#")) return "custom";
  return NAMED_EVENT_COLORS[c] ? c : "indigo";
}