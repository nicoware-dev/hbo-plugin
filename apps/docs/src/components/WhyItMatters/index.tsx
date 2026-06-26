import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const bullets = [
  {
    title: 'No missed follow-ups',
    body: 'Signals and workflows surface hot leads, bot QA flags, and stale conversations before they slip through the cracks.',
  },
  {
    title: 'Safer agent execution',
    body: 'Agents propose actions; humans approve or reject first. External execute is a separate, gated step.',
  },
  {
    title: 'Auditable business operations',
    body: 'Every approval, rejection, and workflow run is logged — operators and agents share one workspace state.',
  },
];

export default function WhyItMatters(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.eyebrow}>Why this matters for businesses</p>
        <Heading as="h2" className={styles.heading}>
          An operating layer for Hermes — not another CRM
        </Heading>
        <p className={styles.intro}>
          HBO Plugin does not replace your inbox or CRM. It gives Hermes the context,
          guardrails, and audit trail to run commercial operations safely.
        </p>
        <ul className={styles.list}>
          {bullets.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
