import { getSDK } from "../api/client";
import { postAction, useFetch } from "../api/hooks";

type Workflow = {
  id: string;
  name: string;
  ownerAgentId: string;
  lastRunAt?: string;
  status: string;
  lastOutputs?: Record<string, unknown>;
};

function formatOutputs(outputs: Record<string, unknown> | undefined): string {
  if (!outputs) return "No outputs yet — run the workflow.";
  const parts: string[] = [];
  if (Array.isArray(outputs.signals)) parts.push(`${outputs.signals.length} signals`);
  if (Array.isArray(outputs.actionProposals)) parts.push(`${outputs.actionProposals.length} actions`);
  if (outputs.outreachBatch) parts.push("outreach batch ready");
  if (outputs.briefing) parts.push("briefing generated");
  if (Array.isArray(outputs.botQaFlags)) parts.push(`${outputs.botQaFlags.length} bot QA flags`);
  return parts.length ? parts.join(" · ") : JSON.stringify(outputs).slice(0, 120);
}

function OutreachPreviewPanel({ outputs }: { outputs: Record<string, unknown> | undefined }) {
  const { React } = getSDK();
  const batch = outputs?.outreachBatch as { draftMessages?: Array<{ name?: string; preview?: string }> } | undefined;
  const drafts = batch?.draftMessages ?? [];
  if (!drafts.length) return null;
  return React.createElement(
    "div",
    { className: "mt-2 space-y-2" },
    React.createElement("p", { className: "text-xs font-medium text-primary" }, "Outreach previews"),
    ...drafts.map((d, i) =>
      React.createElement(
        "details",
        { key: i, className: "text-xs border rounded p-2" },
        React.createElement("summary", { className: "cursor-pointer font-medium" }, d.name ?? "Lead"),
        React.createElement("pre", { className: "mt-2 whitespace-pre-wrap text-muted-foreground" }, d.preview ?? "")
      )
    )
  );
}

function OutputPanel({ outputs }: { outputs: Record<string, unknown> | undefined }) {
  const { React } = getSDK();
  if (!outputs) return null;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(OutreachPreviewPanel, { outputs }),
    React.createElement(
      "details",
      { className: "mt-2 text-xs" },
      React.createElement("summary", { className: "cursor-pointer text-muted-foreground" }, "View structured outputs"),
      React.createElement(
        "pre",
        { className: "mt-1 p-2 border rounded overflow-x-auto whitespace-pre-wrap" },
        JSON.stringify(outputs, null, 2)
      )
    )
  );
}

export function WorkflowsPage() {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;
  const { data, loading, refetch } = useFetch<{ workflows: Workflow[] }>("/workflows");
  const [running, setRunning] = React.useState<string | null>(null);
  const [lastResult, setLastResult] = React.useState<{ summary: string; outputs?: Record<string, unknown> } | null>(
    null
  );

  async function runWorkflow(id: string) {
    setRunning(id);
    setLastResult(null);
    try {
      const result = (await postAction(`/workflows/${id}/run`)) as {
        success?: boolean;
        outputs?: Record<string, unknown>;
        error?: string;
      };
      if (result.success) {
        setLastResult({ summary: formatOutputs(result.outputs), outputs: result.outputs });
        refetch();
      } else {
        setLastResult({ summary: result.error ?? "Workflow failed" });
      }
    } catch (err) {
      setLastResult({ summary: err instanceof Error ? err.message : "Workflow failed" });
    } finally {
      setRunning(null);
    }
  }

  if (loading) return React.createElement("p", null, "Loading workflows…");

  return React.createElement(
    "div",
    { className: "space-y-4 p-4" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Workflows"),
    lastResult &&
      React.createElement(
        "div",
        { className: "text-sm text-muted-foreground border rounded p-2 space-y-1" },
        React.createElement("p", null, "Last run: ", lastResult.summary),
        React.createElement(OutputPanel, { outputs: lastResult.outputs })
      ),
    ...(data?.workflows ?? []).map((wf) =>
      React.createElement(
        Card,
        { key: wf.id },
        React.createElement(CardHeader, null, React.createElement(CardTitle, null, wf.name)),
        React.createElement(
          CardContent,
          null,
          React.createElement("p", { className: "text-sm" }, `Owner: ${wf.ownerAgentId}`),
          React.createElement(
            "p",
            { className: "text-xs text-muted-foreground mt-1" },
            `Status: ${wf.status}`,
            wf.lastRunAt ? ` · Last run: ${wf.lastRunAt}` : ""
          ),
          React.createElement("p", { className: "text-xs mt-2" }, formatOutputs(wf.lastOutputs)),
          React.createElement(OutputPanel, { outputs: wf.lastOutputs as Record<string, unknown> | undefined }),
          React.createElement(
            Button,
            {
              className: "mt-2",
              disabled: running === wf.id,
              onClick: () => runWorkflow(wf.id),
            },
            running === wf.id ? "Running…" : "Run workflow"
          )
        )
      )
    )
  );
}
