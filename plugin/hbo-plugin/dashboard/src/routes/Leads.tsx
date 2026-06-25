import { getSDK } from "../api/client";
import { postJSON, putJSON, useFetch } from "../api/hooks";

const DEFAULT_SHEET_ID = "1fXOFKrbU7w9b8TbXfhZsNYnyxg0jOKlaMQ-g3z5OA1g";

type Lead = Record<string, string | number>;
type ApiResult = { success?: boolean; error?: string; auditEvent?: { summary?: string } };

export function LeadsPage() {
  const { React, components } = getSDK();
  const { Card, CardContent, Button } = components;
  const { data, loading, refetch } = useFetch<{ leads: Lead[] }>("/leads");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    name: "",
    source: "dashboard",
    segment: "commerce",
    score: "50",
    priority: "medium",
    status: "new",
    ownerAgentId: "sales-ops-agent",
    recommendedAction: "Review new lead",
  });

  function openEdit(lead: Lead) {
    setEditId(String(lead.id));
    setForm({
      name: String(lead.name ?? ""),
      source: String(lead.source ?? ""),
      segment: String(lead.segment ?? ""),
      score: String(lead.score ?? "50"),
      priority: String(lead.priority ?? "medium"),
      status: String(lead.status ?? "new"),
      ownerAgentId: String(lead.ownerAgentId ?? "sales-ops-agent"),
      recommendedAction: String(lead.recommendedAction ?? ""),
    });
    setShowForm(true);
  }

  async function saveLead() {
    setBusy("save");
    setMessage(null);
    const payload = { ...form, score: Number(form.score) };
    try {
      const result = (editId
        ? await putJSON(`/leads/${editId}`, payload)
        : await postJSON("/leads", payload)) as ApiResult;
      if (result.success) {
        setMessage(editId ? "Lead updated." : "Lead created.");
        setShowForm(false);
        setEditId(null);
        refetch();
      } else {
        setMessage(result.error ?? "Save failed");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  async function importFromSheets() {
    setBusy("import");
    setMessage(null);
    try {
      const result = (await postJSON("/leads/import/sheets", {
        spreadsheetId: DEFAULT_SHEET_ID,
        sheet: "Hoja 1",
      })) as { success?: boolean; error?: string; imported?: number; total_leads?: number };
      if (result.success) {
        setMessage(`Imported ${result.imported ?? 0} leads (${result.total_leads ?? 0} total).`);
        refetch();
      } else {
        setMessage(result.error ?? "Import failed");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(null);
    }
  }

  if (loading) return React.createElement("p", null, "Loading leads…");

  const leads = data?.leads ?? [];

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Leads"),
    React.createElement(
      "div",
      { className: "flex flex-wrap gap-2" },
      React.createElement(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => {
            setEditId(null);
            setShowForm((v) => !v);
          },
        },
        showForm && !editId ? "Cancel" : "New lead"
      ),
      React.createElement(
        Button,
        { variant: "outline", size: "sm", disabled: busy === "import", onClick: importFromSheets },
        busy === "import" ? "Importing…" : "Import from Sheets"
      )
    ),
    showForm &&
      React.createElement(
        "div",
        { className: "border rounded p-3 grid gap-2 text-sm md:grid-cols-2" },
        ...["name", "source", "segment", "score", "recommendedAction"].map((field) =>
          React.createElement("input", {
            key: field,
            className: "border rounded p-2",
            placeholder: field,
            value: (form as Record<string, string>)[field],
            onChange: (e: { target: { value: string } }) => setForm({ ...form, [field]: e.target.value }),
          })
        ),
        React.createElement(
          "select",
          {
            className: "border rounded p-2",
            value: form.priority,
            onChange: (e: { target: { value: string } }) => setForm({ ...form, priority: e.target.value }),
          },
          React.createElement("option", { value: "low" }, "Low"),
          React.createElement("option", { value: "medium" }, "Medium"),
          React.createElement("option", { value: "high" }, "High")
        ),
        React.createElement(
          "select",
          {
            className: "border rounded p-2",
            value: form.status,
            onChange: (e: { target: { value: string } }) => setForm({ ...form, status: e.target.value }),
          },
          React.createElement("option", { value: "new" }, "New"),
          React.createElement("option", { value: "needs_followup" }, "Needs follow-up"),
          React.createElement("option", { value: "hot" }, "Hot")
        ),
        React.createElement(
          Button,
          { className: "md:col-span-2", disabled: busy === "save" || !form.name.trim(), onClick: saveLead },
          busy === "save" ? "Saving…" : editId ? "Update lead" : "Create lead"
        )
      ),
    message &&
      React.createElement("p", { className: "text-sm border rounded p-2 text-muted-foreground" }, message),
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
            ...["Name", "Source", "Segment", "Score", "Priority", "Status", "Owner", "Action", ""].map((h) =>
              React.createElement("th", { key: h, className: "text-left p-2" }, h)
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          ...leads.map((lead) =>
            React.createElement(
              "tr",
              { key: String(lead.id), className: "border-t" },
              ...["name", "source", "segment", "score", "priority", "status", "ownerAgentId", "recommendedAction"].map(
                (k) => React.createElement("td", { key: k, className: "p-2" }, String(lead[k] ?? ""))
              ),
              React.createElement(
                "td",
                { className: "p-2" },
                React.createElement(Button, { variant: "outline", size: "sm", onClick: () => openEdit(lead) }, "Edit")
              )
            )
          )
        )
      )
    ),
    React.createElement(Card, null, React.createElement(CardContent, { className: "text-xs text-muted-foreground p-4" }, `${leads.length} leads loaded`))
  );
}
