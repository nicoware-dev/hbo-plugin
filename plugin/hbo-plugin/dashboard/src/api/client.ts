/** Hermes Plugin SDK globals — provided at runtime by the dashboard. */
declare global {
  interface Window {
    __HERMES_PLUGIN_SDK__: HermesPluginSDK;
    __HERMES_PLUGINS__: {
      register: (name: string, component: React.ComponentType) => void;
      registerSlot: (name: string, slot: string, component: React.ComponentType) => void;
    };
  }
}

export interface HermesPluginSDK {
  React: typeof import("react");
  hooks: {
    useState: typeof import("react").useState;
    useEffect: typeof import("react").useEffect;
    useCallback: typeof import("react").useCallback;
    useMemo: typeof import("react").useMemo;
  };
  components: Record<string, React.ComponentType<Record<string, unknown>>>;
  fetchJSON: (path: string, init?: RequestInit) => Promise<unknown>;
  utils: { cn: (...args: string[]) => string };
}

export function getSDK(): HermesPluginSDK {
  return window.__HERMES_PLUGIN_SDK__;
}

export const API_BASE = "/api/plugins/hbo-plugin";
