import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
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

type DocCard = {
  title: string;
  description: string;
  to: string;
  icon: ReactNode;
};

const CARDS: DocCard[] = [
  {
    title: 'Install',
    description: 'Plugin, profiles, and dashboard verification.',
    to: '/docs/install',
    icon: <ToolsIcon className={styles.iconSvg} />,
  },
  {
    title: 'How it works',
    description: 'Signals, workflows, approvals, and the operating loop.',
    to: '/docs/how-it-works',
    icon: <SignalIcon className={styles.iconSvg} />,
  },
  {
    title: 'Architecture',
    description: 'Package layout, components, and runtime data flow.',
    to: '/docs/architecture',
    icon: <DashboardIcon className={styles.iconSvg} />,
  },
  {
    title: 'Plugin tools',
    description: 'All hbo_* tools, state model, and business rules.',
    to: '/docs/plugin',
    icon: <ToolsIcon className={styles.iconSvg} />,
  },
  {
    title: 'Dashboard',
    description: 'Business Ops tab pages and approve/reject flows.',
    to: '/docs/dashboard',
    icon: <DashboardIcon className={styles.iconSvg} />,
  },
  {
    title: 'Profiles',
    description: 'Sales Ops, Growth, and Ops Lead agent distributions.',
    to: '/docs/profiles',
    icon: <AgentsIcon className={styles.iconSvg} />,
  },
  {
    title: 'Skills',
    description: 'Bundled workflow guidance and bridge skills.',
    to: '/docs/skills',
    icon: <ShieldIcon className={styles.iconSvg} />,
  },
  {
    title: 'Composio CLI',
    description: 'Optional bridge to Gmail, Slack, CRM, and 1000+ apps.',
    to: '/docs/composio-cli',
    icon: <BridgeIcon className={styles.iconSvg} />,
  },
];

export default function DocsIndexCards(): ReactNode {
  return (
    <section className={styles.section}>
      <Heading as="h2" className={styles.title}>
        Documentation
      </Heading>
      <p className={styles.lead}>
        Pick a topic to go deeper. Start with Install or paste the install prompt into
        Hermes for the fastest path.
      </p>
      <div className={styles.grid}>
        {CARDS.map((card) => (
          <Link key={card.to} className={styles.card} to={card.to}>
            <div className={styles.iconWrap}>{card.icon}</div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardBody}>{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
