const pad = (n: number) => String(n).padStart(2, '0');

const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** YYYY-MM-DD for today. */
export const todayISO = () => isoOf(new Date());

/** "Good morning" / "Good afternoon" / "Good evening" for the given hour. */
export const greeting = (hour = new Date().getHours()) =>
  hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

/** "Today" / "Yesterday" / "Jan 30, 2026". Accepts dates with or without a time. */
export const relativeDate = (value: string, now = new Date()) => {
  const day = value.slice(0, 10);
  if (day === isoOf(now)) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (day === isoOf(yesterday)) return 'Yesterday';

  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/** YYYY-MM-DD HH:mm for right now. */
export const nowStamp = () => {
  const d = new Date();
  return `${todayISO()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** "12 Jul · 14:30" — parsed by hand, Hermes won't parse "YYYY-MM-DD HH:mm". */
export const prettyDate = (value: string) => {
  const [date, time] = value.split(' ');
  const [y, m, d] = date.split('-').map(Number);
  const label = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
  return time ? `${label} · ${time}` : label;
};

/**
 * Typewriter reveal across pre-split lines: returns each line trimmed to however much
 * of `shown` reaches it, counting the space that joins them.
 */
export const revealLines = (lines: string[], shown: number) =>
  lines.map((line, i) => {
    const before = lines.slice(0, i).reduce((count, prev) => count + prev.length + 1, 0);
    return line.slice(0, Math.max(0, shown - before));
  });

/** Returns a positive number, or null when the input isn't usable. */
export const parseAmount = (input: string) => {
  const value = Number(input.replace(/[^0-9.]/g, ''));
  return Number.isFinite(value) && value > 0 ? value : null;
};

/** Accepts YYYY-MM-DD, optionally followed by HH:mm. */
export const isValidDate = (input: string) => /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?$/.test(input.trim());
