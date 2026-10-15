import { useEffect, useState } from 'react';
import Envelope from './components/Envelope';
import Letter from './components/Letter';
import Petals from './components/Petals';
import Signature from './components/Signature';
import { setScene } from './lib/scene';

type Phase = 'sealed' | 'opening' | 'revealing' | 'reading';

export default function App() {
  const [phase, setPhase] = useState<Phase>('sealed');
  const [ready, setReady] = useState(false);
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const t = window.setTimeout(() => setReady(true), 1800);
    document.fonts.ready.then(() => {
      window.clearTimeout(t);
      setReady(true);
    });
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('locked', phase !== 'reading');
  }, [phase]);

  useEffect(() => {
    if (phase !== 'reading') return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = document.getElementById('closing');
      if (!el) return;
      const vh = window.innerHeight;
      const t = (vh * 0.95 - el.getBoundingClientRect().top) / (vh * 0.8);
      const c = Math.min(1, Math.max(0, t));
      setScene('close', c * c * (3 - 2 * c));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [phase]);

  const on = phase === 'revealing' || phase === 'reading';

  return (
    <>
      <div className="bg" aria-hidden="true">
        <i className="bg-dusk" />
        <i className="bg-close" />
      </div>
      <Petals />
      <main className={`reader ${phase}`}>
        <Letter on={on} />
        <Signature on={on} />
      </main>
      <div className="grain" aria-hidden="true" />
      {phase !== 'reading' && (
        <Envelope
          ready={ready}
          reduced={reduced}
          onOpening={() => setPhase('opening')}
          onReveal={() => setPhase('revealing')}
          onDone={() => setPhase('reading')}
        />
      )}
    </>
  );
}
