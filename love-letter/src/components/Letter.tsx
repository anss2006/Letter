import { Fragment, type ReactNode } from 'react';
import { letter } from '../data/letter';
import { useReveal } from '../hooks/useReveal';

function Reveal({ on, delay = 0, children }: { on: boolean; delay?: number; children: ReactNode }) {
  const [ref, shown] = useReveal<HTMLDivElement>(on);
  return (
    <div ref={ref} className={`rv${shown ? ' in' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Letter({ on }: { on: boolean }) {
  return (
    <article className="paper">
      <Reveal on={on} delay={500}>
        <h1 className="salute">{letter.salutation}</h1>
      </Reveal>
      {letter.paragraphs.map((text, i) => (
        <Fragment key={i}>
          <Reveal on={on} delay={i === 0 ? 800 : 0}>
            <p className={i === 0 ? 'para drop' : 'para'}>{text}</p>
          </Reveal>
          <Reveal on={on}>
            <i className="orn" />
          </Reveal>
        </Fragment>
      ))}
      <Reveal on={on}>
        <p className="closing-line">{letter.closingLine}</p>
      </Reveal>
    </article>
  );
}
