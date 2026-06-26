import { getSDK } from "../api/client";
import { useApiHealth } from "../api/hooks";

export function ApiUnavailableBanner() {
  const { React, components } = getSDK();
  const { Card, CardContent, Button } = components;
  const { loading, apiMounted, error } = useApiHealth();

  if (loading || apiMounted) return null;

  return React.createElement(
    Card,
    { className: "border-destructive/50 bg-destructive/5 mx-4 mt-4" },
    React.createElement(
      CardContent,
      { className: "p-4 space-y-3 text-sm" },
      React.createElement("p", { className: "font-medium text-destructive" }, "Dashboard API not mounted"),
      React.createElement(
        "p",
        { className: "text-muted-foreground" },
        "Hermes 0.17+ blocks plugin_api.py for user plugins. Create the bundled symlink and restart the dashboard."
      ),
      React.createElement(
        "pre",
        { className: "rounded bg-muted p-2 text-xs overflow-x-auto" },
        "./scripts/install-hbo.sh\n# or: ./scripts/sync-plugin.sh\nhermes dashboard --stop && hermes dashboard --no-open"
      ),
      error &&
        React.createElement("p", { className: "text-xs text-muted-foreground" }, error),
      React.createElement(
        Button,
        { variant: "outline", size: "sm", onClick: () => window.location.reload() },
        "Retry after restart"
      )
    )
  );
}
