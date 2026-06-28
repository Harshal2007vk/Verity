import React from "react";

const riskConfig = {
  low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "LOW RISK" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "MEDIUM RISK" },
  high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "HIGH RISK" },
};

export default function RiskBadge({ level }) {
  const config = riskConfig[level] || riskConfig.medium;
  return (
    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
}