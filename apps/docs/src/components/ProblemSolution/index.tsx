import type {ReactNode} from 'react';
import {AlertIcon, CheckIcon} from '@site/src/components/icons';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const problems = [
  'Leads, conversations, and tasks scattered across Sheets, CRM, WhatsApp, and bots',
  'No single view of what needs attention today',
  'Agents can suggest actions but teams lack approval gates and audit trails',
  'Integrations require custom glue code before Hermes can act on real data',
];

const solutions = [
  'A Hermes-native Business Ops layer, not another standalone SaaS app',
  'Specialized agent profiles (Sales Ops, Growth, Ops Lead) with bundled skills',
  'Signals from business data, Hermes proposes actions, humans approve or reject',
  'Optional Composio CLI bridge to connect Gmail, Slack, CRM, and more',
];

export default function ProblemSolution(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.panelProblem}>
            <div className={styles.panelLabel}>
              <AlertIcon className={styles.panelIcon} />
              <span>The problem</span>
            </div>
            <Heading as="h2" className={styles.heading}>
              Operations run across too many tools
            </Heading>
            <p className={styles.intro}>
              SMB commerce teams run operations across many tools. Hermes can reason
              and act, but it needs business context, workflows, and guardrails.
            </p>
            <ul className={styles.list}>
              {problems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.panelSolution}>
            <div className={styles.panelLabel}>
              <CheckIcon className={styles.panelIcon} />
              <span>What HBO Plugin solves</span>
            </div>
            <Heading as="h2" className={styles.heading}>
              One Hermes-native workspace
            </Heading>
            <p className={styles.intro}>
              HBO Plugin packages everything Hermes needs to operate a commerce
              workspace: tools, dashboard, profiles, and bridge skills.
            </p>
            <ul className={styles.listSolutions}>
              {solutions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
