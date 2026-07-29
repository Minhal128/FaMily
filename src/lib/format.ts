const pad = (n: number) => String(n).padStart(2, '0');

/** YYYY-MM-DD for today. */
export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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

/** Returns a positive number, or null when the input isn't usable. */
export const parseAmount = (input: string) => {
  const value = Number(input.replace(/[^0-9.]/g, ''));
  return Number.isFinite(value) && value > 0 ? value : null;
};

/** Accepts YYYY-MM-DD, optionally followed by HH:mm. */
export const isValidDate = (input: string) => /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?$/.test(input.trim());
