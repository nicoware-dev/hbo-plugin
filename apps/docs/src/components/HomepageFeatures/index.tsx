import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import {
  AgentsIcon,
  BridgeIcon,
  DashboardIcon,
  ShieldIcon,
  SignalIcon,
  ToolsIcon,
} from '@site/src/components/icons';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: ReactNode;
  description: ReactNode;
  size: 'wide' | 'tall' | 'default';
  tint?: 'accent' | 'muted';
};

const FeatureList: FeatureItem[] = [
  {
    title: '12 plugin tools',
    icon: <ToolsIcon className={styles.iconSvg} />,
    size: 'wide',
    tint: 'accent',
    description: (
      <>
        <code>hbo_get_workspace</code>, <code>hbo_run_workflow</code>,{' '}
        <code>hbo_detect_signals</code>, <code>hbo_approve_action</code>, and more.
        Full business ops API for Hermes sessions.
      </>
    ),
  },
  {
    title: 'Business Ops dashboard',
    icon: <DashboardIcon className={styles.iconSvg} />,
    size: 'tall',
    description: (
      <>
        Eight internal pages: Overview, Agents, Workflows, Leads, Actions, Audit,
        Tool Bridges, and Setup, with live approve/reject on the action queue.
      </>
    ),
  },
  {
    title: 'Three agent profiles',
    icon: <AgentsIcon className={styles.iconSvg} />,
    size: 'default',
    description: (
      <>
        Sales Ops, Growth, and Ops Lead, each with SOUL, config, and bundled skills
        for inbound sales, outbound growth, and daily briefings.
      </>
    ),
  },
  {
    title: 'Signals and workflows',
    icon: <SignalIcon className={styles.iconSvg} />,
    size: 'default',
    description: (
      <>
        Workflows scan leads and conversations, emit signals, and propose actions
        for human review.
      </>
    ),
  },
  {
    title: 'Approval gates and audit',
    icon: <ShieldIcon className={styles.iconSvg} />,
    size: 'default',
    description: (
      <>
        Every proposed action stays <code>pending</code> until approved or rejected.
        Decisions land in the audit log.
      </>
    ),
  },
  {
    title: 'Composio CLI bridge',
    icon: <BridgeIcon className={styles.iconSvg} />,
    size: 'wide',
    tint: 'muted',
    description: (
      <>
        Composio <code>composio-cli</code> skill connects Gmail, Slack, CRM, and
        1000+ apps when credentials are configured. Local workspace works without it.
      </>
    ),
  },
];

function Feature({title, icon, description, size, tint}: FeatureItem) {
  return (
    <article
      className={clsx(
        styles.cell,
        size === 'wide' && styles.cellWide,
        size === 'tall' && styles.cellTall,
        tint === 'accent' && styles.cellAccent,
        tint === 'muted' && styles.cellMuted,
      )}>
      <div className={styles.iconWrap}>{icon}</div>
      <Heading as="h3" className={styles.featureTitle}>
        {title}
      </Heading>
      <p className={styles.featureDescription}>{description}</p>
    </article>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.header}>
          <Heading as="h2" className={styles.sectionTitle}>
            What you get
          </Heading>
          <p className={styles.sectionLead}>
            A complete Hermes-native business operations package, not a separate app.
          </p>
        </div>
        <div className={styles.bento}>
          {FeatureList.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
