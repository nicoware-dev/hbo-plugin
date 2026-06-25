import { getSDK } from "../api/client";

const BRIDGES = [
  { name: "Local demo data", status: "active" },
  { name: "Composio CLI", status: "available" },
  { name: "WithOne / One CLI", status: "future" },
  { name: "n8n", status: "future" },
];

export function ToolBridgesPage() {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent } = components;

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Tool Bridges"),
    ...BRIDGES.map((b) =>
      React.createElement(
        Card,
        { key: b.name },
        React.createElement(CardHeader, null, React.createElement(CardTitle, null, b.name)),
        React.createElement(CardContent, null, React.createElement("p", null, `Status: ${b.status}`))
      )
    )
  );
}
