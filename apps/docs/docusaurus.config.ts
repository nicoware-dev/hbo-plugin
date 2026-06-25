import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'HBO Plugin',
  tagline: 'Hermes Business Operations Plugin',
  favicon: 'img/favicon.ico',
  future: { v4: true },
  url: 'https://nicoware-dev.github.io',
  baseUrl: '/hbo-plugin/',
  organizationName: 'nicoware-dev',
  projectName: 'hbo-plugin',
  onBrokenLinks: 'throw',
  headTags: [
    { tagName: 'link', attributes: { rel: 'apple-touch-icon', href: '/hbo-plugin/img/apple-touch-icon.png' } },
  ],
  i18n: { defaultLocale: 'en', locales: ['en'] },
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      {
        docs: { sidebarPath: './sidebars.ts' },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'HBO Plugin',
      logo: {
        alt: 'HBO Plugin',
        src: 'img/hbo-logo.svg',
      },
      items: [
        { type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs' },
        {
          to: '/docs/install',
          label: 'Get started',
          position: 'right',
          className: 'button button--primary navbar__cta',
        },
        { href: 'https://github.com/nicoware-dev/hbo-plugin', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Install', to: '/docs/install' },
            { label: 'How it works', to: '/docs/how-it-works' },
            { label: 'Architecture', to: '/docs/architecture' },
          ],
        },
        {
          title: 'Plugin',
          items: [
            { label: 'Plugin tools', to: '/docs/plugin' },
            { label: 'Dashboard', to: '/docs/dashboard' },
            { label: 'Profiles', to: '/docs/profiles' },
            { label: 'Skills', to: '/docs/skills' },
          ],
        },
        {
          title: 'Integrations',
          items: [
            { label: 'Overview', to: '/docs/integrations' },
            { label: 'Composio', to: '/docs/composio-cli' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'GitHub', href: 'https://github.com/nicoware-dev/hbo-plugin' },
            { label: 'Development', to: '/docs/development' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} HBO Plugin contributors.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
