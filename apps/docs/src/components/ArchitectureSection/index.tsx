import type {ReactNode} from 'react';
import {useCallback, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const TABS = [
  {
    id: 'package',
    label: 'Package view',
    alt: 'HBO Plugin package architecture diagram',
    caption:
      'Plugin core, dashboard extension, profile distributions, local workspace state, and optional Composio bridge in one installable Hermes package.',
  },
  {
    id: 'runtime',
    label: 'Runtime flow',
    alt: 'HBO Plugin runtime data flow diagram',
    caption:
      'How operators, Hermes sessions, local JSON state, dashboard API routes, and external apps connect during daily operations.',
  },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ArchitectureSection(): ReactNode {
  const packageUrl = useBaseUrl('/img/hbo-plugin-architecture.png');
  const runtimeUrl = useBaseUrl('/img/hbo-plugin-architecture-2.png');
  const [active, setActive] = useState<TabId>('package');
  const [zoomed, setZoomed] = useState(false);

  const imageUrl = active === 'package' ? packageUrl : runtimeUrl;
  const activeTab = TABS.find((t) => t.id === active) ?? TABS[0];

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
              One installable Hermes package with two useful views: what ships in
              the repo and how data moves at runtime.
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
            <Link className="button button--outline button--primary" to="/docs/architecture">
              Architecture docs
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
