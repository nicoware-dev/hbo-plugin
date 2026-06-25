import { getSDK } from "../api/client";
import { postAction } from "../api/hooks";

const WORKFLOWS = [
  { id: "inbound_sales", name: "Inbound Sales", owner: "Sales Ops Agent" },
  { id: "outbound_growth", name: "Outbound Growth", owner: "Growth Agent" },
  { id: "daily_ops_briefing", name: "Daily Ops Briefing", owner: "Ops Lead Agent" },
];

export function WorkflowsPage() {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Workflows"),
    ...WORKFLOWS.map((wf) =>
      React.createElement(
        Card,
        { key: wf.id },
        React.createElement(CardHeader, null, React.createElement(CardTitle, null, wf.name)),
        React.createElement(
          CardContent,
          null,
          React.createElement("p", { className: "text-sm" }, `Owner: ${wf.owner}`),
          React.createElement(
            Button,
            {
              className: "mt-2",
              onClick: () => postAction(`/workflows/${wf.id}/run`),
            },
            "Run workflow"
          )
        )
      )
    )
  );
}
