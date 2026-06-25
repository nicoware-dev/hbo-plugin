import { getSDK } from "../api/client";
import { postAction, useFetch } from "../api/hooks";

export function ActionsPage() {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;
  const { data, loading, refetch } = useFetch<{ actions: Array<Record<string, string>> }>("/actions?status=pending");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  async function decide(actionId: string, decision: "approve" | "reject") {
    setBusy(actionId);
    setMessage(null);
    try {
      const result = (await postAction(`/actions/${actionId}/${decision}`)) as {
        success?: boolean;
        error?: string;
        action?: { title?: string };
      };
      if (result.success) {
        setMessage(`${decision === "approve" ? "Approved" : "Rejected"}: ${result.action?.title ?? actionId}`);
        refetch();
      } else {
        setMessage(result.error ?? "Action failed");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  if (loading) return React.createElement("p", null, "Loading actions…");

  const actions = data?.actions ?? [];

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Actions"),
    message &&
      React.createElement("p", { className: "text-sm border rounded p-2 text-muted-foreground" }, message),
    actions.length === 0 &&
      React.createElement("p", { className: "text-sm text-muted-foreground" }, "No pending actions."),
    ...actions.map((action) =>
      React.createElement(
        Card,
        { key: action.id },
        React.createElement(CardHeader, null, React.createElement(CardTitle, null, action.title)),
        React.createElement(
          CardContent,
          null,
          React.createElement("p", { className: "text-sm" }, action.description),
          React.createElement(
            "p",
            { className: "text-xs text-muted-foreground mt-1" },
            `Agent: ${action.agentId} · Risk: ${action.risk}`
          ),
          React.createElement(
            "div",
            { className: "flex gap-2 mt-3" },
            React.createElement(
              Button,
              {
                disabled: busy === action.id,
                onClick: () => decide(action.id, "approve"),
              },
              busy === action.id ? "…" : "Approve"
            ),
            React.createElement(
              Button,
              {
                variant: "outline",
                disabled: busy === action.id,
                onClick: () => decide(action.id, "reject"),
              },
              "Reject"
            )
          )
        )
      )
    )
  );
}
