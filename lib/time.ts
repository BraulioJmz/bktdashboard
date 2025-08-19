// lib/time.ts
export function toMX(tsIsoUtc: string) {
  const d = new Date(tsIsoUtc);
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'America/Mexico_City'
  };
  // 17/08/2025, 01:23:45 -> lo normalizamos a "2025-08-17 01:23:45"
  const parts = new Intl.DateTimeFormat('es-MX', opts).format(d)
    .replace(',', '');
  const [dd, mm, yyyy, hhmmss] = parts.split(/[/ ]+/);
  return `${yyyy}-${mm}-${dd} ${hhmmss}`;
}
