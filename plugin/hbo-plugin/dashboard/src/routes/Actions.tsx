import { getSDK } from "../api/client";
import { deleteJSON, postAction, postJSON, useFetch } from "../api/hooks";

type ApiResult = {
  success?: boolean;
  error?: string;
  action?: { title?: string; status?: string };
  auditEvent?: { summary?: string };
  execution?: { success?: boolean; error?: string; tool?: string };
};

export function ActionsPage() {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;
  const { data, loading, refetch } = useFetch<{ actions: Array<Record<string, string>> }>("/actions?status=pending");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    agentId: "sales-ops-agent",
    risk: "low",
    source: "dashboard",
  });

  async function decide(actionId: string, decision: "approve" | "reject") {
    setBusy(actionId);
    setMessage(null);
    try {
      const result = (await postAction(`/actions/${actionId}/${decision}`)) as ApiResult;
      if (result.success) {
        const audit = result.auditEvent?.summary ? ` — ${result.auditEvent.summary}` : "";
        const exec = result.execution
          ? result.execution.success
            ? ` · Executed via ${result.execution.tool ?? "Composio"}`
            : ` · Execution failed: ${result.execution.error ?? "unknown"}`
          : "";
        const status = result.action?.status ? ` [${result.action.status}]` : "";
        setMessage(
          `${decision === "approve" ? "Approved" : "Rejected"}: ${result.action?.title ?? actionId}${status}${audit}${exec}`
        );
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

  async function createAction() {
    setBusy("create");
    setMessage(null);
    try {
      const result = (await postJSON("/actions", form)) as ApiResult;
      if (result.success) {
        setMessage(`Created: ${result.action?.title ?? "action"}${result.auditEvent?.summary ? ` — ${result.auditEvent.summary}` : ""}`);
        setForm({ title: "", description: "", agentId: "sales-ops-agent", risk: "low", source: "dashboard" });
        setShowForm(false);
        refetch();
      } else {
        setMessage(result.error ?? "Create failed");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(null);
    }
  }

  async function removeAction(actionId: string) {
    if (!window.confirm("Delete this action?")) return;
    setBusy(actionId);
    setMessage(null);
    try {
      const result = (await deleteJSON(`/actions/${actionId}`)) as ApiResult;
      if (result.success) {
        setMessage(`Deleted: ${result.action?.title ?? actionId}`);
        refetch();
      } else {
        setMessage(result.error ?? "Delete failed");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed");
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
    React.createElement(
      Button,
      { variant: "outline", size: "sm", onClick: () => setShowForm((v) => !v) },
      showForm ? "Cancel" : "New action"
    ),
    showForm &&
      React.createElement(
        "div",
        { className: "border rounded p-3 space-y-2 text-sm" },
        React.createElement("input", {
          className: "w-full border rounded p-2",
          placeholder: "Title",
          value: form.title,
          onChange: (e: { target: { value: string } }) => setForm({ ...form, title: e.target.value }),
        }),
        React.createElement("textarea", {
          className: "w-full border rounded p-2",
          placeholder: "Description",
          rows: 2,
          value: form.description,
          onChange: (e: { target: { value: string } }) => setForm({ ...form, description: e.target.value }),
        }),
        React.createElement(
          "select",
          {
            className: "border rounded p-2",
            value: form.agentId,
            onChange: (e: { target: { value: string } }) => setForm({ ...form, agentId: e.target.value }),
          },
          React.createElement("option", { value: "sales-ops-agent" }, "Sales Ops"),
          React.createElement("option", { value: "growth-agent" }, "Growth"),
          React.createElement("option", { value: "ops-lead-agent" }, "Ops Lead")
        ),
        React.createElement(
          "select",
          {
            className: "border rounded p-2 ml-2",
            value: form.risk,
            onChange: (e: { target: { value: string } }) => setForm({ ...form, risk: e.target.value }),
          },
          React.createElement("option", { value: "low" }, "Low risk"),
          React.createElement("option", { value: "medium" }, "Medium risk"),
          React.createElement("option", { value: "high" }, "High risk")
        ),
        React.createElement(
          Button,
          { disabled: busy === "create" || !form.title.trim(), onClick: createAction },
          busy === "create" ? "Saving…" : "Create action"
        )
      ),
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
              { disabled: busy === action.id, onClick: () => decide(action.id, "approve") },
              busy === action.id ? "…" : "Approve"
            ),
            React.createElement(
              Button,
              { variant: "outline", disabled: busy === action.id, onClick: () => decide(action.id, "reject") },
              "Reject"
            ),
            React.createElement(
              Button,
              { variant: "outline", disabled: busy === action.id, onClick: () => removeAction(action.id) },
              "Delete"
            )
          )
        )
      )
    )
  );
}
