import type {ReactNode} from 'react';
import {useCallback, useState} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const INSTALL_PROMPT = `Install HBO Plugin from the hbo-plugin repository.

Please:
1. read the README and docs,
2. install the Hermes plugin,
3. install the Sales Ops, Growth, and Ops Lead profile distributions,
4. load the Business Ops Demo data,
5. open the Hermes dashboard,
6. verify the Business Ops tab,
7. run the daily briefing workflow,
8. show the action queue,
9. approve one action,
10. explain how to enable the composio-cli skill.`;

export default function CopyInstallPrompt(): ReactNode {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_PROMPT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.copy}>
            <Heading as="h2" className={styles.title}>
              One prompt to install everything
            </Heading>
            <p className={styles.lead}>
              Copy this into Hermes Agent. It installs the plugin, profiles, demo data,
              and walks through the Business Ops dashboard.
            </p>
            <button type="button" className="button button--primary button--lg" onClick={onCopy}>
              {copied ? 'Copied' : 'Copy install prompt'}
            </button>
          </div>
          <div className={styles.terminal} role="region" aria-label="Install prompt">
            <div className={styles.terminalBar}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.terminalLabel}>hermes-install.prompt</span>
            </div>
            <pre className={styles.promptText}>{INSTALL_PROMPT}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
