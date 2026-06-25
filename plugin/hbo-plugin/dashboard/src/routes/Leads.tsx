import { getSDK } from "../api/client";
import { postJSON, putJSON, useFetch } from "../api/hooks";

type Lead = Record<string, string | number>;
type ApiResult = { success?: boolean; error?: string; auditEvent?: { summary?: string } };
type Workspace = {
  demoSources?: { googleSheetsSpreadsheetId?: string; defaultSheetName?: string };
};

const PAGE_SIZE = 10;

export function LeadsPage() {
  const { React, components } = getSDK();
  const { Card, CardContent, Button } = components;
  const { data, loading, refetch } = useFetch<{ leads: Lead[] }>("/leads");
  const { data: workspace } = useFetch<Workspace>("/workspace");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [showImport, setShowImport] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [sheetId, setSheetId] = React.useState("");
  const [sheetName, setSheetName] = React.useState("Hoja 1");
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterPriority, setFilterPriority] = React.useState("");
  const [filterSegment, setFilterSegment] = React.useState("");
  const [filterAgent, setFilterAgent] = React.useState("");
  const [page, setPage] = React.useState(0);
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

  React.useEffect(() => {
    const sources = workspace?.demoSources;
    if (!sources) return;
    if (!sheetId && sources.googleSheetsSpreadsheetId) {
      setSheetId(sources.googleSheetsSpreadsheetId);
    }
    if (sources.defaultSheetName) {
      setSheetName(sources.defaultSheetName);
    }
  }, [workspace, sheetId]);

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
    if (!sheetId.trim()) {
      setMessage("Enter a Google Sheets spreadsheet ID before importing.");
      return;
    }
    setBusy("import");
    setMessage(null);
    try {
      const result = (await postJSON("/leads/import/sheets", {
        spreadsheetId: sheetId.trim(),
        sheet: sheetName.trim() || "Hoja 1",
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

  const allLeads = data?.leads ?? [];

  // Filter
  const searchLower = search.toLowerCase();
  const filtered = allLeads.filter((l) => {
    if (searchLower && !String(l.name ?? "").toLowerCase().includes(searchLower)
        && !String(l.company ?? "").toLowerCase().includes(searchLower)
        && !String(l.email ?? "").toLowerCase().includes(searchLower)) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterPriority && l.priority !== filterPriority) return false;
    if (filterSegment && l.segment !== filterSegment) return false;
    if (filterAgent && l.ownerAgentId !== filterAgent) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  // CSV export
  function exportCSV() {
    const headers = ["name", "email", "company", "phone", "source", "segment", "score", "priority", "status", "ownerAgentId", "recommendedAction"];
    const rows = filtered.map((l) => headers.map((h) => {
      const val = String(l[h] ?? "").replace(/"/g, '""');
      return `"${val}"`;
    }).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hbo-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Unique values for filter dropdowns
  const segments = [...new Set(allLeads.map((l) => String(l.segment).filter(Boolean)))];
  const agents = [...new Set(allLeads.map((l) => String(l.ownerAgentId).filter(Boolean)))];

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
        {
          variant: "outline",
          size: "sm",
          onClick: () => setShowImport((v) => !v),
        },
        showImport ? "Cancel import" : "Import from Sheets"
      ),
      React.createElement(
        Button,
        { variant: "outline", size: "sm", onClick: exportCSV },
        "Export CSV"
      )
    ),
    React.createElement(
      "div",
      { className: "flex flex-wrap gap-2 items-center" },
      React.createElement("input", {
        className: "border rounded p-2 text-sm flex-1 min-w-48",
        placeholder: "Search by name, company, or email…",
        value: search,
        onChange: (e: { target: { value: string } }) => { setSearch(e.target.value); setPage(0); },
      }),
      React.createElement(
        "select",
        { className: "border rounded p-2 text-sm", value: filterStatus,
          onChange: (e: { target: { value: string } }) => { setFilterStatus(e.target.value); setPage(0); } },
        React.createElement("option", { value: "" }, "All statuses"),
        React.createElement("option", { value: "new" }, "New"),
        React.createElement("option", { value: "needs_followup" }, "Needs follow-up"),
        React.createElement("option", { value: "hot" }, "Hot"),
        React.createElement("option", { value: "converted" }, "Converted")
      ),
      React.createElement(
        "select",
        { className: "border rounded p-2 text-sm", value: filterPriority,
          onChange: (e: { target: { value: string } }) => { setFilterPriority(e.target.value); setPage(0); } },
        React.createElement("option", { value: "" }, "All priorities"),
        React.createElement("option", { value: "low" }, "Low"),
        React.createElement("option", { value: "medium" }, "Medium"),
        React.createElement("option", { value: "high" }, "High")
      ),
      filterSegment && segments.length > 1 &&
        React.createElement(
          "select",
          { className: "border rounded p-2 text-sm", value: filterSegment,
            onChange: (e: { target: { value: string } }) => { setFilterSegment(e.target.value); setPage(0); } },
          React.createElement("option", { value: "" }, "All segments"),
          ...segments.map((s) => React.createElement("option", { key: s, value: s }, s))
        ),
      filterAgent && agents.length > 1 &&
        React.createElement(
          "select",
          { className: "border rounded p-2 text-sm", value: filterAgent,
            onChange: (e: { target: { value: string } }) => { setFilterAgent(e.target.value); setPage(0); } },
          React.createElement("option", { value: "" }, "All agents"),
          ...agents.map((a) => React.createElement("option", { key: a, value: a }, a))
        ),
      React.createElement("span", { className: "text-sm text-muted-foreground" },
        `${filtered.length} of ${allLeads.length} leads`)
    ),
    showImport &&
      React.createElement(
        "div",
        { className: "border rounded p-3 grid gap-2 text-sm md:grid-cols-2" },
        React.createElement("input", {
          className: "border rounded p-2 md:col-span-2",
          placeholder: "Google Sheets spreadsheet ID",
          value: sheetId,
          onChange: (e: { target: { value: string } }) => setSheetId(e.target.value),
        }),
        React.createElement("input", {
          className: "border rounded p-2",
          placeholder: "Sheet tab name",
          value: sheetName,
          onChange: (e: { target: { value: string } }) => setSheetName(e.target.value),
        }),
        React.createElement(
          Button,
          { disabled: busy === "import" || !sheetId.trim(), onClick: importFromSheets },
          busy === "import" ? "Importing…" : "Run import"
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
          ...paged.map((lead) =>
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
    totalPages > 1 &&
      React.createElement(
        "div",
        { className: "flex items-center gap-2 justify-center" },
        React.createElement(Button, { variant: "outline", size: "sm", disabled: safePage === 0,
          onClick: () => setPage(safePage - 1) }, "← Prev"),
        React.createElement("span", { className: "text-sm text-muted-foreground" },
          `Page ${safePage + 1} of ${totalPages}`),
        React.createElement(Button, { variant: "outline", size: "sm", disabled: safePage >= totalPages - 1,
          onClick: () => setPage(safePage + 1) }, "Next →")
      ),
    React.createElement(Card, null, React.createElement(CardContent, { className: "text-xs text-muted-foreground p-4" }, `${filtered.length} leads shown (${allLeads.length} total)`))
  );
}
