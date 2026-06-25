import { getSDK } from "../api/client";
import { useFetch } from "../api/hooks";

export function AuditPage() {
  const { React, components } = getSDK();
  const { Button } = components;
  const { data, loading, refetch } = useFetch<{ events: Array<Record<string, string>> }>("/audit");

  if (loading) return React.createElement("p", null, "Loading audit log…");

  const events = [...(data?.events ?? [])].reverse();

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement(
      "div",
      { className: "flex items-center justify-between" },
      React.createElement("h2", { className: "text-lg font-semibold" }, "Audit"),
      React.createElement(Button, { variant: "outline", size: "sm", onClick: refetch }, "Refresh")
    ),
    React.createElement(
      "ul",
      { className: "space-y-2 text-sm" },
      ...events.map((ev) =>
        React.createElement(
          "li",
          { key: ev.id, className: "border-b pb-2" },
          React.createElement("span", { className: "text-muted-foreground" }, ev.timestamp),
          " · ",
          React.createElement("span", { className: "font-medium" }, ev.eventType),
          " — ",
          ev.summary
        )
      )
    )
  );
}
