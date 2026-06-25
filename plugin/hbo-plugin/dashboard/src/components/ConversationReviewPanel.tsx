import { getSDK } from "../api/client";
import { postAction, useFetch } from "../api/hooks";

type BotQaFlag = {
  conversationId: string;
  channel?: string;
  issue?: string;
  summary?: string;
};

type Message = { role: string; text: string; at?: string };

type Conversation = {
  id: string;
  channel?: string;
  summary?: string;
  leadId?: string;
  messages?: Message[];
};

type ActionRow = { id: string; title: string; source?: string; status?: string };

export function ConversationReviewPanel({
  flags,
  onDecided,
}: {
  flags: BotQaFlag[];
  onDecided?: () => void;
}) {
  const { React, components } = getSDK();
  const { Button } = components;
  const { data: convData } = useFetch<{ conversations: Conversation[] }>("/conversations");
  const { data: actData, refetch: refetchActions } = useFetch<{ actions: ActionRow[] }>(
    "/actions?status=pending"
  );
  const [busy, setBusy] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  if (!flags.length) return null;

  const conversations = convData?.conversations ?? [];
  const actions = actData?.actions ?? [];

  async function decide(actionId: string, decision: "approve" | "reject") {
    setBusy(actionId);
    setMessage(null);
    try {
      const result = (await postAction(`/actions/${actionId}/${decision}`)) as {
        success?: boolean;
        error?: string;
        auditEvent?: { summary?: string };
      };
      if (result.success) {
        setMessage(result.auditEvent?.summary ?? `${decision}d action`);
        refetchActions();
        onDecided?.();
      } else {
        setMessage(result.error ?? "Action failed");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  return React.createElement(
    "div",
    { className: "mt-2 space-y-3" },
    React.createElement("p", { className: "text-xs font-medium text-primary" }, "Conversation review"),
    message &&
      React.createElement("p", { className: "text-xs text-muted-foreground" }, message),
    ...flags.map((flag) => {
      const conv = conversations.find((c) => c.id === flag.conversationId);
      const action = actions.find((a) => a.source === flag.conversationId);
      return React.createElement(
        "details",
        { key: flag.conversationId, className: "text-xs border rounded p-2", open: true },
        React.createElement(
          "summary",
          { className: "cursor-pointer font-medium" },
          `${flag.channel ?? "channel"} — ${flag.summary ?? conv?.summary ?? flag.conversationId}`
        ),
        conv?.leadId &&
          React.createElement("p", { className: "text-muted-foreground mt-1" }, `Lead: ${conv.leadId}`),
        React.createElement(
          "div",
          { className: "mt-2 space-y-1" },
          ...(conv?.messages ?? []).map((m, i) =>
            React.createElement(
              "div",
              { key: i, className: "rounded bg-muted/40 px-2 py-1" },
              React.createElement("span", { className: "font-medium capitalize" }, `${m.role}: `),
              m.text
            )
          )
        ),
        flag.issue &&
          React.createElement("p", { className: "mt-2 text-amber-600" }, flag.issue),
        action &&
          React.createElement(
            "div",
            { className: "mt-2 flex gap-2" },
            React.createElement(
              Button,
              {
                size: "sm",
                disabled: busy === action.id,
                onClick: () => decide(action.id, "approve"),
              },
              busy === action.id ? "…" : "Approve"
            ),
            React.createElement(
              Button,
              {
                size: "sm",
                variant: "outline",
                disabled: busy === action.id,
                onClick: () => decide(action.id, "reject"),
              },
              "Reject"
            )
          ),
        !action &&
          React.createElement(
            "p",
            { className: "mt-2 text-muted-foreground" },
            "Run inbound_sales workflow to create a review action."
          )
      );
    })
  );
}
