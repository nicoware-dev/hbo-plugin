import { getSDK } from "../api/client";
import { useFetch } from "../api/hooks";

export function LeadsPage() {
  const { React, components } = getSDK();
  const { Card, CardContent } = components;
  const { data, loading } = useFetch<{ leads: Array<Record<string, string | number>> }>("/leads");

  if (loading) return React.createElement("p", null, "Loading leads…");

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Leads"),
    React.createElement(
      "div",
      { className: "overflow-x-auto" },
      React.createElement(
        "table",
        { className: "w-full text-sm" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            ...["Name", "Source", "Score", "Priority", "Status", "Owner"].map((h) =>
              React.createElement("th", { key: h, className: "text-left p-2" }, h)
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          ...(data?.leads ?? []).map((lead) =>
            React.createElement(
              "tr",
              { key: String(lead.id), className: "border-t" },
              ...["name", "source", "score", "priority", "status", "ownerAgentId"].map((k) =>
                React.createElement("td", { key: k, className: "p-2" }, String(lead[k] ?? ""))
              )
            )
          )
        )
      )
    ),
    React.createElement(Card, null, React.createElement(CardContent, { className: "text-xs text-muted-foreground p-4" }, `${data?.leads?.length ?? 0} demo leads loaded`))
  );
}
