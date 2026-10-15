import { letter } from '../data/letter';
import { useReveal } from '../hooks/useReveal';

export default function Signature({ on }: { on: boolean }) {
  const [ref, shown] = useReveal<HTMLElement>(on, 0.5);
  return (
    <section ref={ref} id="closing" className={`closing${shown ? ' in' : ''}`}>
      <p className="sig-yours">{letter.signoff}</p>
      <p className="sig-name">{letter.signature}</p>
      <svg className="sig-flourish" viewBox="0 0 300 28" aria-hidden="true">
        <path pathLength={1} d="M4 20C40 6 88 26 140 14S232 6 296 18" />
      </svg>
      <svg className="sig-heart" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </section>
  );
}
