import { useRef } from 'react';
import gsap from 'gsap';
import { letter } from '../data/letter';
import { setScene } from '../lib/scene';

interface Props {
  ready: boolean;
  reduced: boolean;
  onOpening: () => void;
  onReveal: () => void;
  onDone: () => void;
}

export default function Envelope({ ready, reduced, onOpening, onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  const open = () => {
    if (fired.current) return;
    fired.current = true;
    onOpening();

    if (reduced) {
      setScene('open', 1);
      gsap.to(root.current, { opacity: 0, duration: 0.6, onStart: onReveal, onComplete: onDone });
      return;
    }

    const q = gsap.utils.selector(root);
    const o = { v: 0 };
    gsap
      .timeline({ defaults: { ease: 'power2.out' }, onComplete: onDone })
      .to(q('.hint'), { autoAlpha: 0, duration: 0.3 }, 0)
      .to(q('.seal'), { scale: 1.3, autoAlpha: 0, duration: 0.6, transformOrigin: '50% 50%' }, 0.1)
      .to(o, { v: 1, duration: 2.6, ease: 'power1.inOut', onUpdate: () => setScene('open', o.v) }, 0.2)
      .to(q('.flap'), { scaleY: 0, svgOrigin: '210 0', duration: 0.32, ease: 'power2.in' }, 0.6)
      .set(q('.flap'), { autoAlpha: 0 }, 0.92)
      .fromTo(
        q('.flap-in'),
        { scaleY: 0.001, svgOrigin: '210 0' },
        { scaleY: -1, svgOrigin: '210 0', duration: 0.4 },
        0.92,
      )
      .to(q('.sheet'), { y: -150, duration: 1, ease: 'power3.out' }, 1.25)
      .call(onReveal, [], 2.3)
      .to(root.current, { y: 130, autoAlpha: 0, duration: 0.95, ease: 'power2.in' }, 2.3);
  };

  return (
    <div ref={root} className={`gate${ready ? ' ready' : ''}`}>
      <div className="stage">
        <svg className="env" viewBox="0 0 420 280" role="img" aria-label="A sealed envelope">
          <defs>
            <radialGradient id="sg" cx=".35" cy=".3" r=".85">
              <stop offset="0" stopColor="#B3283E" />
              <stop offset="1" stopColor="#5E0E1E" />
            </radialGradient>
            <radialGradient id="gl">
              <stop offset="0" stopColor="#E8B96A" stopOpacity=".38" />
              <stop offset="1" stopColor="#E8B96A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path className="e-back" d="M0 0H420V280H0Z" />
          <polygon className="flap-in" points="0,0 420,0 210,165" />
          <g className="sheet">
            <rect x="30" y="30" width="360" height="240" rx="3" fill="#F6EFE4" />
            <text x="58" y="84" className="e-salute">{letter.salutation}</text>
            <path className="e-lines" d="M58 112H340M58 136H310M58 160H336M58 184H250" />
          </g>
          <path className="e-front" d="M0 0L210 165L420 0V280H0Z" />
          <text x="210" y="248" textAnchor="middle" className="e-to">For {letter.envelopeName}</text>
          <polygon className="flap" points="0,0 420,0 210,165" />
          <g transform="translate(210 165)">
            <g className="seal">
              <circle className="glow" r="58" fill="url(#gl)" />
              <circle className="seal-disc" r="35" />
              <circle className="seal-ring" r="25" />
              <text className="seal-n" y="10" textAnchor="middle">N</text>
            </g>
          </g>
        </svg>
        <button className="hit" aria-label="Open the letter" onClick={open} />
        <p className="hint">Tap the seal to open</p>
      </div>
    </div>
  );
}
