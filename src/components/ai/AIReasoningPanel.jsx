import React from "react";
import { Sparkles, BrainCircuit } from "lucide-react";

export default function AIReasoningPanel({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="mt-3 p-4 bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <BrainCircuit className="w-5 h-5 text-indigo-600" />
        <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">AI Reasoning</h4>
      </div>
      <p className="text-sm text-indigo-950/80 leading-relaxed font-medium">
        {explanation}
      </p>
    </div>
  );
}
