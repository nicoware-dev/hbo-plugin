import { getSDK } from "../api/client";
import { postJSON, useFetch } from "../api/hooks";

type Bridge = { name: string; id: string; status: string; platform?: string; user?: string; error?: string };

type BridgeStatus = {
  mode: string;
  bridges: Bridge[];
  expiredConnectionsNote?: string;
};

export function ToolBridgesPage() {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;
  const { data, loading, refetch } = useFetch<BridgeStatus>("/bridge/status");
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  async function setMode(mode: string) {
    setBusy(true);
    setMessage(null);
    try {
      const result = (await postJSON("/bridge/mode", { mode })) as { success?: boolean; error?: string; mode?: string };
      if (result.success) {
        setMessage(`Mode set to ${result.mode ?? mode}.`);
        refetch();
      } else {
        setMessage(result.error ?? "Failed to set mode");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to set mode");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return React.createElement("p", null, "Loading bridges…");

  const modes = ["local-demo", "composio", "hybrid"] as const;

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Tool Bridges"),
    React.createElement(
      "div",
      { className: "flex flex-wrap gap-2" },
      ...modes.map((mode) =>
        React.createElement(
          Button,
          {
            key: mode,
            variant: data?.mode === mode ? "default" : "outline",
            size: "sm",
            disabled: busy,
            onClick: () => setMode(mode),
          },
          mode
        )
      )
    ),
    message && React.createElement("p", { className: "text-sm text-muted-foreground" }, message),
    ...(data?.bridges ?? []).map((b) =>
      React.createElement(
        Card,
        { key: b.id },
        React.createElement(CardHeader, null, React.createElement(CardTitle, null, b.name)),
        React.createElement(
          CardContent,
          { className: "text-sm space-y-1" },
          React.createElement("p", null, `Status: ${b.status}`),
          b.platform && React.createElement("p", { className: "text-xs text-muted-foreground" }, `Platform: ${b.platform}`),
          b.user && React.createElement("p", { className: "text-xs text-muted-foreground" }, `User: ${b.user}`),
          b.error && React.createElement("p", { className: "text-xs text-red-600" }, b.error)
        )
      )
    ),
    data?.expiredConnectionsNote &&
      React.createElement("p", { className: "text-xs text-muted-foreground border rounded p-2" }, data.expiredConnectionsNote)
  );
}
