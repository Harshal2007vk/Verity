import React, { useState } from "react";
import { runBiasCheck } from "@/lib/hiringAnalyst";
import { Button } from "@/components/ui/button";
import { Sparkles, Scale, Check, AlertTriangle } from "lucide-react";

export default function BiasCheckPanel({ rankings, candidates, job }) {
  const [check, setCheck] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const result = await runBiasCheck(rankings, candidates, job);
      setCheck(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border p-5 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          Auditing ranking for bias...
        </div>
      </div>
    );
  }

  if (!check) {
    return (
      <div className="bg-card rounded-xl border p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Scale className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Fairness Check</h3>
            <p className="text-xs text-muted-foreground">Audit ranking for bias, consistency, and evidence weighting</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={generate} className="gap-2">
          <Sparkles className="w-3.5 h-3.5" /> Run Fairness Check
        </Button>
      </div>
    );
  }

  const isPass = check.fairness_status === "PASS";

  return (
    <div className="bg-card rounded-xl border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fairness Check</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            isPass ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            {isPass ? "✓ PASS" : "⚠ REVIEW"}
          </span>
          <Button size="sm" variant="ghost" onClick={generate} className="text-xs gap-1 h-7">
            <Sparkles className="w-3 h-3" /> Re-run
          </Button>
        </div>
      </div>

      {/* Individual checks */}
      <div className="space-y-2">
        {(check.checks || []).map((c, i) => {
          const pass = c.status === "PASS";
          return (
            <div key={i} className={`rounded-lg border p-3 ${pass ? "bg-emerald-50/30 border-emerald-100" : "bg-amber-50/30 border-amber-100"}`}>
              <div className="flex items-start gap-2">
                {pass ? (
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-semibold text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{c.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      {check.notes && check.notes.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Notes</p>
          <ul className="space-y-1">
            {check.notes.map((n, i) => (
              <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                <span className="text-amber-500 mt-0.5">›</span> {n}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}