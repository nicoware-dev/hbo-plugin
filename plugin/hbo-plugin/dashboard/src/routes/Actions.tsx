import { getSDK } from "../api/client";
import { postAction, useFetch } from "../api/hooks";

export function ActionsPage() {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;
  const { data, loading } = useFetch<{ actions: Array<Record<string, string>> }>("/actions?status=pending");

  const refresh = () => window.location.reload();

  if (loading) return React.createElement("p", null, "Loading actions…");

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Actions"),
    ...(data?.actions ?? []).map((action) =>
      React.createElement(
        Card,
        { key: action.id },
        React.createElement(CardHeader, null, React.createElement(CardTitle, null, action.title)),
        React.createElement(
          CardContent,
          null,
          React.createElement("p", { className: "text-sm" }, action.description),
          React.createElement(
            "div",
            { className: "flex gap-2 mt-3" },
            React.createElement(
              Button,
              {
                onClick: async () => {
                  await postAction(`/actions/${action.id}/approve`);
                  refresh();
                },
              },
              "Approve"
            ),
            React.createElement(
              Button,
              {
                variant: "outline",
                onClick: async () => {
                  await postAction(`/actions/${action.id}/reject`);
                  refresh();
                },
              },
              "Reject"
            )
          )
        )
      )
    )
  );
}
