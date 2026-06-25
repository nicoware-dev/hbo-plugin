import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'install',
    'how-it-works',
    'objectives',
    'architecture',
    {
      type: 'category',
      label: 'Plugin',
      collapsed: false,
      items: ['plugin', 'dashboard', 'profiles', 'skills'],
    },
    {
      type: 'category',
      label: 'Integrations',
      collapsed: false,
      items: [
        'integrations',
        'composio-cli',
        'nvidia-nemoclaw',
        'stripe-link',
      ],
    },
    'development',
  ],
};

export default sidebars;
