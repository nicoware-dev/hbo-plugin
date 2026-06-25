import { getSDK } from "../api/client";
import { useFetch } from "../api/hooks";

export function AuditPage() {
  const { React } = getSDK();
  const { data, loading } = useFetch<{ events: Array<Record<string, string>> }>("/audit");

  if (loading) return React.createElement("p", null, "Loading audit log…");

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Audit"),
    React.createElement(
      "ul",
      { className: "space-y-2 text-sm" },
      ...(data?.events ?? []).map((ev) =>
        React.createElement(
          "li",
          { key: ev.id, className: "border-b pb-2" },
          React.createElement("span", { className: "text-muted-foreground" }, ev.timestamp),
          " — ",
          ev.summary
        )
      )
    )
  );
}
