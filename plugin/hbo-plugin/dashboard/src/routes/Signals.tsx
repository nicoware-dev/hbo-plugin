import { getSDK } from "../api/client";
import { postAction, postJSON, useFetch } from "../api/hooks";

type Signal = {
  id: string;
  type: string;
  summary: string;
  ownerAgentId: string;
  status?: string;
  leadId?: string;
  conversationId?: string;
};

type ApiResult = {
  success?: boolean;
  error?: string;
  signal?: { summary?: string };
  auditEvent?: { summary?: string };
};

export function SignalsPage() {
  const { React, components } = getSDK();
  const { Card, CardContent, Button } = components;
  const { data, loading, refetch } = useFetch<{ signals: Signal[] }>("/signals");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({
    type: "custom",
    summary: "",
    ownerAgentId: "sales-ops-agent",
    leadId: "",
    conversationId: "",
  });

  async function resolveSignal(signalId: string) {
    setBusy(signalId);
    setMessage(null);
    try {
      const result = (await postAction(`/signals/${signalId}/resolve`)) as ApiResult;
      if (result.success) {
        const audit = result.auditEvent?.summary ? ` — ${result.auditEvent.summary}` : "";
        setMessage(`Resolved: ${result.signal?.summary ?? signalId}${audit}`);
        refetch();
      } else {
        setMessage(result.error ?? "Resolve failed");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Resolve failed");
    } finally {
      setBusy(null);
    }
  }

  async function createSignal() {
    setBusy("create");
    setMessage(null);
    try {
      const payload = {
        type: form.type,
        summary: form.summary,
        ownerAgentId: form.ownerAgentId,
        ...(form.leadId ? { leadId: form.leadId } : {}),
        ...(form.conversationId ? { conversationId: form.conversationId } : {}),
      };
      const result = (await postJSON("/signals", payload)) as ApiResult;
      if (result.success) {
        setMessage(`Created signal${result.auditEvent?.summary ? ` — ${result.auditEvent.summary}` : ""}`);
        setForm({ type: "custom", summary: "", ownerAgentId: "sales-ops-agent", leadId: "", conversationId: "" });
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

  if (loading) return React.createElement("p", null, "Loading signals…");

  const signals = data?.signals ?? [];

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Signals"),
    React.createElement(
      Button,
      { variant: "outline", size: "sm", onClick: () => setShowForm((v) => !v) },
      showForm ? "Cancel" : "New signal"
    ),
    showForm &&
      React.createElement(
        "div",
        { className: "border rounded p-3 space-y-2 text-sm" },
        React.createElement(
          "select",
          {
            className: "border rounded p-2",
            value: form.type,
            onChange: (e: { target: { value: string } }) => setForm({ ...form, type: e.target.value }),
          },
          React.createElement("option", { value: "missed_followup" }, "Missed follow-up"),
          React.createElement("option", { value: "bot_qa" }, "Bot QA"),
          React.createElement("option", { value: "custom" }, "Custom")
        ),
        React.createElement("textarea", {
          className: "w-full border rounded p-2",
          placeholder: "Summary",
          rows: 2,
          value: form.summary,
          onChange: (e: { target: { value: string } }) => setForm({ ...form, summary: e.target.value }),
        }),
        React.createElement("input", {
          className: "w-full border rounded p-2",
          placeholder: "Lead ID (optional)",
          value: form.leadId,
          onChange: (e: { target: { value: string } }) => setForm({ ...form, leadId: e.target.value }),
        }),
        React.createElement(
          Button,
          { disabled: busy === "create" || !form.summary.trim(), onClick: createSignal },
          busy === "create" ? "Saving…" : "Create signal"
        )
      ),
    message &&
      React.createElement("p", { className: "text-sm border rounded p-2 text-muted-foreground" }, message),
    signals.length === 0 &&
      React.createElement("p", { className: "text-sm text-muted-foreground" }, "No open signals."),
    ...signals.map((signal) =>
      React.createElement(
        Card,
        { key: signal.id },
        React.createElement(
          CardContent,
          { className: "p-4 space-y-2" },
          React.createElement("p", { className: "font-medium" }, signal.summary),
          React.createElement(
            "p",
            { className: "text-xs text-muted-foreground" },
            `Type: ${signal.type} · Owner: ${signal.ownerAgentId}`,
            signal.leadId ? ` · Lead: ${signal.leadId}` : ""
          ),
          React.createElement(
            Button,
            { size: "sm", disabled: busy === signal.id, onClick: () => resolveSignal(signal.id) },
            busy === signal.id ? "…" : "Resolve"
          )
        )
      )
    )
  );
}
