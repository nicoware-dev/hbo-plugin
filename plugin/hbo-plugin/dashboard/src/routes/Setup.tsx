import { getSDK } from "../api/client";
import { postAction, useFetch } from "../api/hooks";

const STEPS = [
  "Install HBO Plugin into ~/.hermes/plugins/",
  "Enable hbo-plugin in ~/.hermes/config.yaml",
  "Install Sales Ops, Growth, and Ops Lead profiles",
  "Load demo data via hbo_load_demo_data or Reset below",
  "Open this Business Ops tab",
  "Fill Business context (Business tab)",
  "Run Daily Ops Briefing workflow",
  "Approve one pending action",
  "Optional: enable composio skill (hbo-plugin:composio) for external app bridge",
  "Set bridge mode to composio or hybrid in Tool Bridges to enable explicit Execute on approved actions",
  "Enable recommended crons below after reviewing each blueprint",
];

type Automation = {
  id: string;
  name: string;
  agentId: string;
  schedule: string;
  purpose: string;
  skills: string[];
  bridge: string;
  silent: boolean;
  cronFile: string;
  enableCommand?: string;
};

export function SetupPage() {
  const { React, components } = getSDK();
  const { Card, CardContent, CardHeader, CardTitle, Button } = components;
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const { data: autoData } = useFetch<{ automations: Automation[]; safetyNote: string }>("/automations");

  function copyEnableCommand(a: Automation) {
    if (!a.enableCommand) return;
    navigator.clipboard.writeText(a.enableCommand).then(() => {
      setCopiedId(a.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

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
    ),
    React.createElement(
      Card,
      null,
      React.createElement(CardHeader, null, React.createElement(CardTitle, null, "Recommended Automations")),
      React.createElement(
        CardContent,
        { className: "p-4 space-y-4" },
        React.createElement(
          "p",
          { className: "text-sm text-muted-foreground" },
          autoData?.safetyNote ?? "Crons are recommended — enable manually after review."
        ),
        React.createElement(
          "ul",
          { className: "space-y-3" },
          ...(autoData?.automations ?? []).map((a) =>
            React.createElement(
              "li",
              { key: a.id, className: "rounded border p-3 text-sm space-y-1" },
              React.createElement("div", { className: "font-medium" }, `${a.name} — ${a.schedule}`),
              React.createElement("p", { className: "text-muted-foreground" }, a.purpose),
              React.createElement(
                "p",
                { className: "text-xs text-muted-foreground" },
                `Agent: ${a.agentId} · Bridge: ${a.bridge} · Skills: ${a.skills.join(", ")}`
              ),
              React.createElement("code", { className: "text-xs block mt-1" }, a.cronFile),
              a.enableCommand &&
                React.createElement(
                  "div",
                  { className: "mt-2 flex flex-wrap gap-2 items-center" },
                  React.createElement(
                    Button,
                    { variant: "outline", size: "sm", onClick: () => copyEnableCommand(a) },
                    copiedId === a.id ? "Copied!" : "Copy enable command"
                  ),
                  React.createElement(
                    "code",
                    { className: "text-xs block w-full break-all text-muted-foreground" },
                    a.enableCommand
                  )
                )
            )
          )
        )
      )
    )
  );
}
