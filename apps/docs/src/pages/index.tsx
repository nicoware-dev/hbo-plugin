import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ProblemSolution from '@site/src/components/ProblemSolution';
import WorkflowLoop from '@site/src/components/WorkflowLoop';
import CopyInstallPrompt from '@site/src/components/CopyInstallPrompt';
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
              <li><code>business-ops-demo</code></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

function ArchitectureSection() {
  const architectureUrl = useBaseUrl('/img/hbo-plugin-architecture.png');
  return (
    <section className={styles.architectureSection}>
      <div className="container">
        <div className={styles.archHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            System architecture
          </Heading>
          <p className={styles.sectionLead}>
            One installable Hermes package: plugin core, dashboard tab, profile
            distributions, local demo state, and an optional external-app bridge.
          </p>
          <Link className="button button--outline button--primary" to="/docs/architecture">
            Architecture docs
          </Link>
        </div>
        <figure className={styles.architectureFigure}>
          <img
            src={architectureUrl}
            alt="HBO Plugin architecture diagram"
            className={styles.architectureImage}
          />
        </figure>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="HBO Plugin"
      description="Hermes Business Operations Plugin: signals, workflows, approvals, dashboard, and agent profiles">
      <HomepageHeader />
      <main>
        <ProblemSolution />
        <WorkflowLoop />
        <HomepageFeatures />
        <CopyInstallPrompt />
        <ArchitectureSection />
      </main>
    </Layout>
  );
}
