import { useEffect, useRef } from 'react';
import { scene } from '../lib/scene';

type Particle = {
  x: number; y: number; s: number; vy: number; dr: number;
  ph: number; r: number; vr: number; c: string; petal: boolean;
};

const COLORS = ['#D98FA0', '#E4A4B2', '#C98F78', '#EBB7C0'];
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let ps: Particle[] = [];

    const make = (petal: boolean, init: boolean): Particle => ({
      x: rnd(0, w),
      y: init ? rnd(0, h) : petal ? rnd(-40, -10) : h + 10,
      s: petal ? rnd(6, 11) : rnd(0.7, 1.8),
      vy: petal ? rnd(16, 30) : -rnd(6, 14),
      dr: rnd(8, 22),
      ph: rnd(0, 6.3),
      r: rnd(0, 6.3),
      vr: rnd(-1, 1),
      c: petal ? COLORS[Math.floor(Math.random() * COLORS.length)] : '#E8B96A',
      petal,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nw = window.innerWidth;
      h = window.innerHeight;
      cv.width = nw * dpr;
      cv.height = h * dpr;
      cv.style.width = `${nw}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nw !== w) {
        w = nw;
        const k = w < 640 ? 1 : 2;
        ps = [
          ...Array.from({ length: 9 * k }, () => make(true, true)),
          ...Array.from({ length: 18 * k }, () => make(false, true)),
        ];
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (document.hidden) return;
      const reading = scene.open * (1 - scene.close);
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.ph += dt;
        p.y += p.vy * dt;
        p.x += Math.sin(p.ph * 0.8) * p.dr * dt;
        p.r += p.vr * dt;
        if (p.petal ? p.y > h + 20 : p.y < -10) Object.assign(p, make(p.petal, false));
        const a = p.petal
          ? scene.open * (1 - 0.6 * scene.close) * 0.7
          : (0.95 - 0.6 * reading) * (0.5 + 0.5 * Math.sin(p.ph * 2));
        if (a < 0.02) continue;
        ctx.globalAlpha = a;
        ctx.fillStyle = p.c;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.beginPath();
        if (p.petal) {
          const s = p.s;
          ctx.rotate(p.r);
          ctx.scale(Math.abs(Math.cos(p.ph * 1.3)) * 0.7 + 0.3, 1);
          ctx.moveTo(0, -s);
          ctx.bezierCurveTo(s, -s * 0.6, s * 0.8, s * 0.6, 0, s);
          ctx.bezierCurveTo(-s * 0.8, s * 0.6, -s, -s * 0.6, 0, -s);
        } else {
          ctx.arc(0, 0, p.s, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();
      }
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="petals" aria-hidden="true" />;
}
