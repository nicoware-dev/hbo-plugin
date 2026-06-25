import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ArchitectureSection from '@site/src/components/ArchitectureSection';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ProblemSolution from '@site/src/components/ProblemSolution';
import WorkflowLoop from '@site/src/components/WorkflowLoop';
import CopyInstallPrompt from '@site/src/components/CopyInstallPrompt';
import RevealOnScroll from '@site/src/components/RevealOnScroll';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const logoUrl = useBaseUrl('/img/hbo-logo.svg');
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={clsx('container', styles.heroInner)}>
        <div className={styles.heroCopy}>
          <img src={logoUrl} alt="HBO Plugin logo" className={styles.heroLogo} />
          <p className={styles.heroEyebrow}>Hermes Business Operations</p>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroLead}>
            Turn Hermes into a business operations workspace: capture signals from
            your tools, let agents propose actions, and approve with full audit trails.
          </p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs/install">
              Get started
            </Link>
            <Link className="button button--outline button--primary button--lg" to="/docs/how-it-works">
              How it works
            </Link>
          </div>
        </div>
        <div className={styles.heroAside}>
          <div className={styles.packageCard}>
            <p className={styles.packageLabel}>Package contents</p>
            <ul className={styles.packageList}>
              <li><code>plugin/hbo-plugin</code></li>
              <li><code>profiles/sales-ops-agent</code></li>
              <li><code>profiles/growth-agent</code></li>
              <li><code>profiles/ops-lead-agent</code></li>
              <li><code>skills/</code> (workflows + Composio bridge)</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="HBO Plugin"
      description="Hermes Business Operations Plugin: signals, workflows, approvals, dashboard, and agent profiles">
      <HomepageHeader />
      <main>
        <RevealOnScroll>
          <ProblemSolution />
        </RevealOnScroll>
        <RevealOnScroll delayMs={80}>
          <WorkflowLoop />
        </RevealOnScroll>
        <RevealOnScroll delayMs={120}>
          <HomepageFeatures />
        </RevealOnScroll>
        <RevealOnScroll delayMs={160}>
          <CopyInstallPrompt />
        </RevealOnScroll>
        <RevealOnScroll delayMs={200}>
          <ArchitectureSection />
        </RevealOnScroll>
      </main>
    </Layout>
  );
}
