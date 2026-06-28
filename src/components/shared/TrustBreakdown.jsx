import React, { useState } from "react";
import { Shield, ChevronDown, ChevronUp, CheckCircle2, HelpCircle, XCircle, AlertTriangle } from "lucide-react";
import RiskBadge from "@/components/shared/RiskBadge";

const statusConfig = {
  supported: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  plausible: { icon: HelpCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  unsupported: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
};

const getTrustColor = (score) => {
  if (score >= 75) return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
  if (score >= 50) return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
  return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
};

export default function TrustBreakdown({ trustBreakdown, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!trustBreakdown) return null;

  const score = trustBreakdown.trust_score || 0;
  const colors = getTrustColor(score);
  const claims = trustBreakdown.claims || [];
  const supportedCount = claims.filter(c => c.status === "supported").length;
  const plausibleCount = claims.filter(c => c.status === "plausible").length;
  const unsupportedCount = claims.filter(c => c.status === "unsupported").length;

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className={`w-11 h-11 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center shrink-0`}>
          <Shield className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Trust Breakdown</h3>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Credibility Audit</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
            <span className="text-emerald-600">{supportedCount} supported</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-amber-600">{plausibleCount} plausible</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-red-500">{unsupportedCount} unsupported</span>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end">
            <span className={`score-mono text-2xl font-bold ${colors.text}`}>{Math.round(score)}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Trust Score</span>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t px-4 py-4 space-y-4">
          {/* Risk Level + Rationale */}
          <div className="flex items-start gap-3">
            <RiskBadge level={trustBreakdown.risk_level} />
            <p className="text-sm text-muted-foreground flex-1 leading-relaxed">{trustBreakdown.risk_rationale}</p>
          </div>

          {/* Claims List */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Claim Verification</p>
            {claims.map((claim, idx) => {
              const config = statusConfig[claim.status] || statusConfig.plausible;
              const Icon = config.icon;
              return (
                <div key={idx} className={`flex items-start gap-3 p-2.5 rounded-lg ${config.bg} border ${config.border}`}>
                  <Icon className={`w-4 h-4 ${config.color} shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{claim.claim}</p>
                    {claim.reasoning && <p className="text-xs text-muted-foreground mt-0.5">{claim.reasoning}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Suspicious Patterns */}
          {trustBreakdown.suspicious_patterns && trustBreakdown.suspicious_patterns.length > 0 && (
            <div className="rounded-lg bg-red-50/50 border border-red-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">Suspicious Patterns</span>
              </div>
              <ul className="space-y-1.5">
                {trustBreakdown.suspicious_patterns.map((p, idx) => (
                  <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-400 mt-2 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary */}
          {trustBreakdown.summary && (
            <div className="ai-inference rounded-lg p-3">
              <p className="text-sm text-foreground leading-relaxed">{trustBreakdown.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}