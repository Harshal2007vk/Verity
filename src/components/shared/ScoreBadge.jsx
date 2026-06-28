import React from "react";

const getScoreColor = (score) => {
  if (score >= 80) return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
  if (score >= 60) return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
  if (score >= 40) return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" };
  return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
};

export default function ScoreBadge({ score, label, size = "md" }) {
  const colors = getScoreColor(score);
  const sizeClasses = size === "lg" ? "text-2xl px-4 py-2" : size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`score-mono font-bold rounded-md border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses}`}>
        {Math.round(score)}
      </span>
      {label && <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>}
    </div>
  );
}