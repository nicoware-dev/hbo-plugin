import { getSDK } from "../api/client";

/** Blue-forward palette aligned with Hermes dashboard primary */
const BAR_PALETTE = [
  "hsl(221 83% 53%)",
  "hsl(221 70% 45%)",
  "hsl(217 91% 60%)",
  "hsl(213 94% 68%)",
  "hsl(199 89% 48%)",
  "hsl(262 83% 58%)",
];

const FUNNEL_COLORS: Record<string, string> = {
  new: "hsl(221 83% 53%)",
  needs_followup: "hsl(38 92% 50%)",
  hot: "hsl(0 72% 51%)",
  converted: "hsl(142 71% 45%)",
};

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

function formatLabel(label: string): string {
  return label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function BarChart({ title, data, colors }: BarChartProps) {
  const { React, components } = getSDK();
  const { Card, CardHeader, CardTitle, CardContent } = components;
  const filtered = filterNonZero(data);
  const entries = Object.entries(filtered);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return React.createElement(
    Card,
    null,
    React.createElement(
      CardHeader,
      { className: "pb-2" },
      React.createElement(CardTitle, { className: "text-sm font-medium" }, title)
    ),
    React.createElement(
      CardContent,
      { className: "pt-0" },
      entries.length === 0
        ? React.createElement("p", { className: "text-sm text-muted-foreground" }, "No data yet — reset demo or import leads.")
        : React.createElement(
            "div",
            { className: "hbo-chart-bars text-primary" },
            ...entries.map(([label, value], i) => {
              const fillColor = colors?.[label] ?? BAR_PALETTE[i % BAR_PALETTE.length];
              return React.createElement(
                "div",
                { key: label },
                React.createElement(
                  "div",
                  { className: "hbo-chart-row-label text-muted-foreground" },
                  React.createElement("span", null, formatLabel(label)),
                  React.createElement("span", { className: "font-semibold text-foreground" }, String(value))
                ),
                React.createElement(
                  "div",
                  { className: "hbo-chart-track" },
                  React.createElement("div", {
                    className: "hbo-chart-fill",
                    style: {
                      width: `${Math.max((value / max) * 100, 8)}%`,
                      backgroundColor: fillColor,
                    },
                  })
                )
              );
            })
          )
    )
  );
}

export { FUNNEL_COLORS };
