import { getSDK } from "../api/client";
import { useFetch, postJSON } from "../api/hooks";

const FIELDS: { key: string; label: string; rows?: number }[] = [
  { key: "businessName", label: "Business name" },
  { key: "description", label: "Description", rows: 3 },
  { key: "products", label: "Products / services", rows: 2 },
  { key: "targetAudience", label: "Target audience", rows: 2 },
  { key: "toneOfVoice", label: "Tone of voice" },
  { key: "competitors", label: "Competitors", rows: 2 },
  { key: "uniqueSellingPoints", label: "Unique selling points", rows: 2 },
  { key: "customInstructions", label: "Custom instructions for agents", rows: 3 },
];

type Context = Record<string, string>;

export function BusinessPage() {
  const { React, components } = getSDK();
  const { Card, CardContent, Button } = components;
  const { data, loading, refetch } = useFetch<Context>("/business-context");
  const [form, setForm] = React.useState<Context>({});
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      const result = (await postJSON("/business-context", form)) as { success?: boolean };
      if (result.success) {
        setMessage("Business context saved.");
        refetch();
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return React.createElement("p", null, "Loading…");

  return React.createElement(
    "div",
    { className: "space-y-4 p-4 max-w-2xl" },
    React.createElement("h2", { className: "text-lg font-semibold" }, "Business Context"),
    React.createElement(
      "p",
      { className: "text-sm text-muted-foreground" },
      "Agents load this via hbo_get_business_context at session start."
    ),
    React.createElement(
      Card,
      null,
      React.createElement(
        CardContent,
        { className: "p-4 space-y-4" },
        ...FIELDS.map(({ key, label, rows }) =>
          React.createElement(
            "label",
            { key, className: "block space-y-1 text-sm" },
            React.createElement("span", { className: "font-medium" }, label),
            rows
              ? React.createElement("textarea", {
                  className: "w-full rounded border px-3 py-2 text-sm min-h-[4rem]",
                  rows,
                  value: form[key] ?? "",
                  onChange: (e: { target: { value: string } }) =>
                    setForm((f) => ({ ...f, [key]: e.target.value })),
                })
              : React.createElement("input", {
                  className: "w-full rounded border px-3 py-2 text-sm",
                  value: form[key] ?? "",
                  onChange: (e: { target: { value: string } }) =>
                    setForm((f) => ({ ...f, [key]: e.target.value })),
                })
          )
        ),
        React.createElement(
          Button,
          { disabled: busy, onClick: save },
          busy ? "Saving…" : "Save context"
        ),
        message && React.createElement("p", { className: "text-sm text-muted-foreground" }, message)
      )
    )
  );
}
