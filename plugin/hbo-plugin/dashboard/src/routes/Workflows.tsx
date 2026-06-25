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

export function WorkflowsPage() {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent, Button } = components;
  const { data, loading, refetch } = useFetch<{ workflows: Workflow[] }>("/workflows");
  const [running, setRunning] = React.useState<string | null>(null);
  const [lastResult, setLastResult] = React.useState<string | null>(null);

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
        setLastResult(formatOutputs(result.outputs));
        refetch();
      } else {
        setLastResult(result.error ?? "Workflow failed");
      }
    } catch (err) {
      setLastResult(err instanceof Error ? err.message : "Workflow failed");
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
        "p",
        { className: "text-sm text-muted-foreground border rounded p-2" },
        "Last run: ",
        lastResult
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
          React.createElement(
            "p",
            { className: "text-xs mt-2" },
            formatOutputs(wf.lastOutputs as Record<string, unknown> | undefined)
          ),
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
