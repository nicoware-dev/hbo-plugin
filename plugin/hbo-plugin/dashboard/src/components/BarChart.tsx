import { getSDK } from "../api/client";

const DEFAULT_BAR = "#2563eb";
const TRACK_BG = "#e5e7eb";
const PALETTE = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2"];

type BarChartProps = {
  title: string;
  data: Record<string, number>;
  colors?: Record<string, string>;
};

function filterNonZero(data: Record<string, number>): Record<string, number> {
  const filtered: Record<string, number> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v > 0) filtered[k] = v;
  }
  return filtered;
}

export function BarChart({ title, data, colors }: BarChartProps) {
  const { React } = getSDK();
  const filtered = filterNonZero(data);
  const entries = Object.entries(filtered);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return React.createElement(
    "div",
    {
      style: {
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#fff",
      },
    },
    React.createElement("h3", { style: { fontSize: "14px", fontWeight: 600, marginBottom: "12px" } }, title),
    entries.length === 0
      ? React.createElement("p", { style: { fontSize: "13px", color: "#6b7280" } }, "No data yet — reset demo or import leads.")
      : React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px" } },
          ...entries.map(([label, value], i) =>
            React.createElement(
              "div",
              { key: label },
              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "4px",
                  },
                },
                React.createElement("span", null, label.replace(/_/g, " ")),
                React.createElement("span", { style: { fontWeight: 600, color: "#111827" } }, String(value))
              ),
              React.createElement(
                "div",
                { style: { height: "10px", borderRadius: "4px", backgroundColor: TRACK_BG, overflow: "hidden" } },
                React.createElement("div", {
                  style: {
                    height: "100%",
                    width: `${Math.max((value / max) * 100, value > 0 ? 8 : 0)}%`,
                    borderRadius: "4px",
                    backgroundColor: colors?.[label] ?? PALETTE[i % PALETTE.length] ?? DEFAULT_BAR,
                    transition: "width 0.3s ease",
                  },
                })
              )
            )
          )
        )
  );
}
