import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const steps = [
  {
    num: '01',
    title: 'Capture signals',
    body: 'Data from external apps or your workspace surfaces as signals: missed follow-ups, bot QA flags, hot leads, and conversation issues.',
  },
  {
    num: '02',
    title: 'Hermes proposes',
    body: 'Agent profiles run workflows. Hermes analyzes state and creates action proposals in the queue.',
  },
  {
    num: '03',
    title: 'Human approves',
    body: 'Operators review pending actions in chat or the Business Ops dashboard. Every decision is written to the audit log.',
  },
  {
    num: '04',
    title: 'Execute via bridge',
    body: 'Approved actions can run through the Composio CLI skill against Gmail, Slack, CRM, and other connected apps.',
  },
];

export default function WorkflowLoop(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <Heading as="h2" className={styles.title}>
            Signals to actions to approvals
          </Heading>
          <p className={styles.lead}>
            Business data becomes signals, Hermes proposes next steps, and your team
            stays in control with real approve/reject gates.
          </p>
        </div>
        <ol className={styles.track}>
          {steps.map((step, index) => (
            <li key={step.num} className={styles.step}>
              <div className={styles.stepMarker}>
                <span className={styles.stepNum}>{step.num}</span>
                {index < steps.length - 1 && <span className={styles.stepLine} aria-hidden="true" />}
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.cta}>
          <Link className="button button--outline button--primary" to="/docs/how-it-works">
            Read the workflow guide
          </Link>
        </div>
      </div>
    </section>
  );
}
