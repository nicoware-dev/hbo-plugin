import { getSDK } from "../api/client";
import { postAction } from "../api/hooks";

const STEPS = [
  "Install HBO Plugin into ~/.hermes/plugins/",
  "Enable hbo-plugin in ~/.hermes/config.yaml",
  "Install Sales Ops, Growth, and Ops Lead profiles",
  "Load demo data via hbo_load_demo_data or Reset below",
  "Open this Business Ops tab",
  "Run Daily Ops Briefing workflow",
  "Approve one pending action",
  "Optional: enable composio skill (hbo-plugin:composio) for external app bridge",
  "Set bridge mode to composio or hybrid in Tool Bridges to execute emails on approve",
  "Re-link expired Composio connections: composio link whatsapp && composio link googlemeet",
];

export function SetupPage() {
  const { React, components } = getSDK();
  const { Card, CardContent, Button } = components;
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  async function resetDemo() {
    if (!window.confirm("Reset all demo data to bundled defaults? This cannot be undone.")) return;
    setBusy(true);
    setMessage(null);
    try {
      const result = (await postAction("/demo/reset")) as { success?: boolean; message?: string; error?: string };
      if (result.success) {
        setMessage(result.message ?? "Demo data reset.");
      } else {
        setMessage(result.error ?? "Reset failed");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Setup"),
    React.createElement(
      Card,
      null,
      React.createElement(
        CardContent,
        { className: "p-4 space-y-4" },
        React.createElement(
          "ol",
          { className: "list-decimal list-inside space-y-2 text-sm" },
          ...STEPS.map((step, i) => React.createElement("li", { key: i }, step))
        ),
        React.createElement(
          Button,
          { variant: "outline", disabled: busy, onClick: resetDemo },
          busy ? "Resetting…" : "Reset demo data"
        ),
        message && React.createElement("p", { className: "text-sm text-muted-foreground" }, message)
      )
    )
  );
}
