export const scene = { open: 0, close: 0 };

export function setScene(key: 'open' | 'close', value: number): void {
  scene[key] = value;
  document.documentElement.style.setProperty(`--${key}`, String(value));
}
