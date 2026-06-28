import React, { useState } from "react";
import { generateHiringBrief } from "@/lib/hiringAnalyst";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Check, AlertTriangle, TrendingUp } from "lucide-react";

export default function HiringBrief({ rankings, candidates, job }) {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const result = await generateHiringBrief(rankings, candidates, job);
      setBrief(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">AI Hiring Brief</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          Analyzing candidate pool...
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="bg-card rounded-xl border p-5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI Hiring Brief</h3>
            <p className="text-xs text-muted-foreground">Executive summary of your top candidates with evidence-based recommendations</p>
          </div>
        </div>
        <Button size="sm" onClick={generate} className="gap-2 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Generate Brief
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-5 mb-4 ai-inference">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">AI Hiring Brief</span>
        <Button size="sm" variant="ghost" onClick={generate} className="ml-auto text-xs gap-1 h-7">
          <Sparkles className="w-3 h-3" /> Regenerate
        </Button>
      </div>

      {/* Top candidate */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-[hsl(222,47%,15%)] flex items-center justify-center text-white text-lg font-bold shrink-0">
          {brief.top_candidate?.charAt(0) || "?"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-foreground">{brief.top_candidate}</h3>
            <span className="score-mono text-lg font-bold text-amber-600">{brief.top_candidate_score}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Top Candidate</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{brief.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        {brief.key_strengths && brief.key_strengths.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1.5 flex items-center gap-1">
              <Check className="w-3 h-3" /> Key Strengths
            </p>
            <ul className="space-y-1">
              {brief.key_strengths.map((s, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {brief.key_risks && brief.key_risks.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Key Risks
            </p>
            <ul className="space-y-1">
              {brief.key_risks.map((r, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">!</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Runner up + recommendation */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t">
        {brief.runner_up && (
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs text-muted-foreground">Runner-up:</span>
            <span className="text-xs font-medium text-foreground">{brief.runner_up}</span>
          </div>
        )}
        {brief.recommendation && (
          <div className="ml-auto text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{brief.recommendation}</span>
          </div>
        )}
      </div>
    </div>
  );
}