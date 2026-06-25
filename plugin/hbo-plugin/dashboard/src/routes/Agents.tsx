import { getSDK } from "../api/client";
import { useFetch } from "../api/hooks";

export function AgentsPage() {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent } = components;
  const { data, loading } = useFetch<{ agents: Array<Record<string, string>> }>("/agents");

  if (loading) return React.createElement("p", null, "Loading agents…");

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Agents"),
    ...(data?.agents ?? []).map((agent) =>
      React.createElement(
        Card,
        { key: agent.id },
        React.createElement(CardHeader, null, React.createElement(CardTitle, null, agent.name)),
        React.createElement(
          CardContent,
          null,
          React.createElement("p", { className: "text-sm text-muted-foreground" }, agent.description),
          React.createElement("p", { className: "text-xs mt-2" }, `Status: ${agent.status}`)
        )
      )
    )
  );
}
