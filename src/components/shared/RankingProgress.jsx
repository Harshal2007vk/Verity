import React from "react";
import { Shield, Zap } from "lucide-react";

export default function RankingProgress({ progress }) {
  if (!progress) return null;

  const { step, current, total, batchEnd, label } = progress;
  const percent = step === "verifying"
    ? total ? Math.round(((current || 0) / total) * 100) : 0
    : step === "ranking"
    ? total ? Math.round(((batchEnd || current || 0) / total) * 100) : 0
    : 100;

  const stepLabel = step === "verifying" ? "Step 1 of 2 · Trust Verification" : step === "ranking" ? "Step 2 of 2 · AI Ranking" : "Finalizing";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border shadow-xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            {step === "verifying" ? <Shield className="w-5 h-5 text-amber-500" /> : <Zap className="w-5 h-5 text-amber-500" />}
          </div>
          <div>
            <p className="text-sm font-semibold">{stepLabel}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="score-mono font-bold text-foreground">{percent}%</span>
          {step === "ranking" && total && (
            <span className="text-muted-foreground">{batchEnd || current} of {total} candidates</span>
          )}
          {step === "verifying" && total && (
            <span className="text-muted-foreground">{current} of {total} candidates</span>
          )}
        </div>
      </div>
    </div>
  );
}