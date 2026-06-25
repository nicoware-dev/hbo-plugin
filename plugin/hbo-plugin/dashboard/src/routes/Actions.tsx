import { getSDK } from "../api/client";
import { deleteJSON, postAction, postJSON, useFetch } from "../api/hooks";

type ApiResult = {
  success?: boolean;
  error?: string;
  action?: { title?: string; status?: string; id?: string };
  auditEvent?: { summary?: string };
  execution?: { success?: boolean; error?: string; tool?: string; mock?: boolean };
};

type ActionRow = Record<string, string | boolean | undefined> & {
  id: string;
  title: string;
  description?: string;
  agentId?: string;
  risk?: string;
  status?: string;
  executable?: boolean;
  composioTool?: string;
  outreachPreview?: string;
};

type PageProps = { onNavigate?: (page: string) => void };

const STATUS_OPTIONS = ["pending", "approved", "rejected", "executed", "failed", "all"] as const;

export function ActionsPage({ onNavigate }: PageProps) {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const query = statusFilter === "all" ? "/actions" : `/actions?status=${statusFilter}`;
  const { data, loading, refetch } = useFetch<{ actions: ActionRow[] }>(query);
  const { data: ws } = useFetch<Record<string, string>>("/workspace");
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

  const bridge = ws?.selectedBridge ?? "local-demo";
  const showBridgeWarning = bridge === "composio" || bridge === "hybrid";

  async function decide(actionId: string, decision: "approve" | "reject" | "execute") {
    setBusy(actionId);
    setMessage(null);
    try {
      const path =
        decision === "execute"
          ? `/actions/${actionId}/execute`
          : `/actions/${actionId}/${decision}`;
      const result = (await postAction(path)) as ApiResult;
      if (result.success) {
        const audit = result.auditEvent?.summary ? ` — ${result.auditEvent.summary}` : "";
        const exec = result.execution
          ? result.execution.success
            ? ` · Executed via ${result.execution.tool ?? "external"}`
            : ` · Execution failed: ${result.execution.error ?? "unknown"}`
          : "";
        const status = result.action?.status ? ` [${result.action.status}]` : "";
        const label =
          decision === "approve" ? "Approved" : decision === "reject" ? "Rejected" : "Executed";
        setMessage(`${label}: ${result.action?.title ?? actionId}${status}${audit}${exec}`);
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
    showBridgeWarning &&
      React.createElement(
        "p",
        { className: "text-sm border border-amber-500/40 rounded p-2 bg-amber-500/10" },
        "Bridge mode is ",
        bridge,
        ". Approving records intent only; ",
        React.createElement("strong", null, "Execute"),
        " on approved actions may trigger real external effects (e.g. Gmail)."
      ),
    React.createElement(
      "div",
      { className: "flex flex-wrap gap-2 items-center" },
      React.createElement(
        "select",
        {
          className: "border rounded p-2 text-sm",
          value: statusFilter,
          onChange: (e: { target: { value: string } }) => setStatusFilter(e.target.value),
        },
        ...STATUS_OPTIONS.map((s) =>
          React.createElement("option", { key: s, value: s }, s === "all" ? "All statuses" : s)
        )
      ),
      React.createElement(
        Button,
        { variant: "outline", size: "sm", onClick: () => setShowForm((v) => !v) },
        showForm ? "Cancel" : "New action"
      )
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
      React.createElement(
        "p",
        { className: "text-sm text-muted-foreground" },
        `No ${statusFilter === "all" ? "" : statusFilter + " "}actions.`
      ),
    ...actions.map((action) => {
      const status = String(action.status ?? "pending");
      const canApprove = status === "pending";
      const canExecute = status === "approved" && Boolean(action.executable);
      const canDelete = status !== "approved" && status !== "executed";

      return React.createElement(
        Card,
        { key: action.id },
        React.createElement(
          CardHeader,
          null,
          React.createElement(
            "div",
            { className: "flex flex-wrap items-center gap-2" },
            React.createElement(CardTitle, null, action.title),
            React.createElement(
              "span",
              { className: "text-xs px-2 py-0.5 rounded border" },
              status
            ),
            action.risk &&
              React.createElement(
                "span",
                { className: "text-xs px-2 py-0.5 rounded border text-muted-foreground" },
                `risk: ${action.risk}`
              ),
            action.executable &&
              React.createElement(
                "span",
                { className: "text-xs px-2 py-0.5 rounded border border-primary text-primary" },
                "executable"
              )
          )
        ),
        React.createElement(
          CardContent,
          null,
          React.createElement("p", { className: "text-sm" }, action.description),
          React.createElement(
            "p",
            { className: "text-xs text-muted-foreground mt-1" },
            `Agent: ${action.agentId ?? "—"}${action.composioTool ? ` · Tool: ${action.composioTool}` : ""}`
          ),
          action.outreachPreview &&
            React.createElement(
              "details",
              { className: "mt-2 text-sm" },
              React.createElement("summary", { className: "cursor-pointer text-primary font-medium" }, "Preview outreach message"),
              React.createElement(
                "pre",
                { className: "mt-2 p-2 border rounded text-xs whitespace-pre-wrap bg-muted/30" },
                String(action.outreachPreview)
              )
            ),
          React.createElement(
            "div",
            { className: "flex flex-wrap gap-2 mt-3" },
            canApprove &&
              React.createElement(
                Button,
                { disabled: busy === action.id, onClick: () => decide(action.id, "approve") },
                busy === action.id ? "…" : "Approve"
              ),
            canApprove &&
              React.createElement(
                Button,
                { variant: "outline", disabled: busy === action.id, onClick: () => decide(action.id, "reject") },
                "Reject"
              ),
            canExecute &&
              React.createElement(
                Button,
                { disabled: busy === action.id, onClick: () => decide(action.id, "execute") },
                busy === action.id ? "…" : "Execute"
              ),
            canDelete &&
              React.createElement(
                Button,
                { variant: "outline", disabled: busy === action.id, onClick: () => removeAction(action.id) },
                "Delete"
              ),
            onNavigate &&
              React.createElement(
                Button,
                { variant: "outline", size: "sm", onClick: () => onNavigate("audit") },
                "View in Audit"
              )
          )
        )
      );
    })
  );
}
