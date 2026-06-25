import type {ReactNode} from 'react';
import {useCallback, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const TABS = [
  {
    id: 'architecture',
    label: 'Architecture',
    src: '/img/hbo-architecture.jpg',
    alt: 'HBO Plugin system architecture — Hermes-native business operations workspace',
    caption:
      'Operator, Hermes platform, plugin core, dashboard, profiles, local state, and Composio bridge in one installable package.',
    docsTo: '/docs/architecture',
    docsLabel: 'Architecture docs',
  },
  {
    id: 'workflow',
    label: 'How it works',
    src: '/img/hbo-how-it-works.jpg',
    alt: 'HBO Plugin workflow — signal to proposal to approval inside Hermes',
    caption:
      'Signals from workspace data and external apps become workflows, action proposals, operator approvals, and optional bridge execution.',
    docsTo: '/docs/how-it-works',
    docsLabel: 'Workflow guide',
  },
  {
    id: 'agents',
    label: 'Agents',
    src: '/img/hbo-agents.jpg',
    alt: 'Three specialist HBO agent profiles — Sales Ops, Growth, and Ops Lead',
    caption:
      'Purpose-built Hermes profiles that share tools, business context, and audit history inside one workspace.',
    docsTo: '/docs/profiles',
    docsLabel: 'Profile docs',
  },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ArchitectureSection(): ReactNode {
  const [active, setActive] = useState<TabId>('architecture');
  const [zoomed, setZoomed] = useState(false);

  const activeTab = TABS.find((t) => t.id === active) ?? TABS[0];
  const imageUrl = useBaseUrl(activeTab.src);

  const onTab = useCallback((id: TabId) => {
    setActive(id);
    setZoomed(false);
  }, []);

  const onToggleZoom = useCallback(() => {
    setZoomed((z) => !z);
  }, []);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.copy}>
            <Heading as="h2" className={styles.title}>
              System architecture
            </Heading>
            <p className={styles.lead}>
              One Hermes workspace with three views: what ships in the package,
              how the operating loop runs, and how specialist agents share state.
            </p>
            <div className={styles.tabs} role="tablist" aria-label="Architecture views">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active === tab.id}
                  className={clsx(styles.tab, active === tab.id && styles.tabActive)}
                  onClick={() => onTab(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>
            <p className={styles.caption}>{activeTab.caption}</p>
            <Link className="button button--outline button--primary" to={activeTab.docsTo}>
              {activeTab.docsLabel}
            </Link>
          </div>
          <figure className={styles.figure}>
            <button
              type="button"
              className={clsx(styles.imageButton, zoomed && styles.imageZoomed)}
              onClick={onToggleZoom}
              aria-label={zoomed ? 'Close diagram zoom' : 'Zoom architecture diagram'}>
              <img
                key={active}
                src={imageUrl}
                alt={activeTab.alt}
                className={styles.image}
              />
            </button>
            <figcaption className={styles.figcaption}>
              Click to {zoomed ? 'shrink' : 'expand'} on mobile-friendly screens
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
