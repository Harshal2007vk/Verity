import React from "react";
import { Sparkles } from "lucide-react";

export default function AiInferenceCard({ title, children, className = "" }) {
  return (
    <div className={`ai-inference rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h4 className="text-sm font-semibold text-amber-700 uppercase tracking-wider">{title}</h4>
        <span className="text-[10px] font-mono bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">AI INFERRED</span>
      </div>
      {children}
    </div>
  );
}