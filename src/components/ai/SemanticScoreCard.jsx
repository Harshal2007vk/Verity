import React from "react";
import { GitCompare } from "lucide-react";

export default function SemanticScoreCard({ score }) {
  const v = score || 0;
  const barColor = v >= 75 ? "bg-emerald-500" : v >= 50 ? "bg-amber-500" : "bg-red-500";
  const textColor = v >= 75 ? "text-emerald-700" : v >= 50 ? "text-amber-700" : "text-red-700";
  const bgColor = v >= 75 ? "bg-emerald-50" : v >= 50 ? "bg-amber-50" : "bg-red-50";

  return (
    <div className={`p-3 rounded-lg border ${bgColor} border-opacity-50`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <GitCompare className="w-3.5 h-3.5" /> Semantic Fit
        </span>
        <span className={`score-mono text-lg font-bold ${textColor}`}>{Math.round(v)}%</span>
      </div>
      <div className="h-2.5 bg-background/50 rounded-full overflow-hidden shadow-inner border border-black/5">
        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
