import { getSDK } from "../api/client";

const STEPS = [
  "Install HBO Plugin into ~/.hermes/plugins/",
  "Enable hbo-plugin in ~/.hermes/config.yaml",
  "Install Sales Ops, Growth, and Ops Lead profiles",
  "Load demo data via hbo_load_demo_data",
  "Open this Business Ops tab",
  "Run Daily Ops Briefing workflow",
  "Approve one pending action",
  "Optional: enable composio-cli bridge skill",
];

export function SetupPage() {
  const { React, components } = getSDK();
  const { Card, CardContent } = components;

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Setup"),
    React.createElement(
      Card,
      null,
      React.createElement(
        CardContent,
        { className: "p-4" },
        React.createElement("ol", { className: "list-decimal list-inside space-y-2 text-sm" },
          ...STEPS.map((step, i) => React.createElement("li", { key: i }, step))
        )
      )
    )
  );
}
