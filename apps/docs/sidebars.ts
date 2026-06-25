import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'install',
    'how-it-works',
    'objectives',
    'architecture',
    'plugin',
    'dashboard',
    'profiles',
    'skills',
    'composio-cli',
    {
      type: 'category',
      label: 'Sponsor Integrations',
      collapsed: false,
      items: [
        'sponsor-integrations',
        'sponsor-nvidia-nemoclaw',
        'sponsor-stripe-link',
      ],
    },
    'development',
  ],
};

export default sidebars;
