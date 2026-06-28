import React, { useState, useEffect } from "react";
import { generateHiringDecision } from "@/lib/hiringAnalyst";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Gavel, Sparkles, Check, AlertTriangle, Target, TrendingUp } from "lucide-react";

const RECOMMENDATION_STYLES = {
  "Strong Hire": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: Check },
  Consider: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: TrendingUp },
  "Needs Verification": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: AlertTriangle },
  Reject: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: AlertTriangle },
};

export default function HiringDecisionPanel({ candidate, job, rankingResult }) {
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadExisting();
  }, [candidate?.id, job?.id]);

  const loadExisting = async () => {
    try {
      const existing = await base44.entities.HiringDecision.filter({
        candidate_id: candidate.id,
        job_id: job.id,
      });
      if (existing.length > 0) {
        setDecision(existing[0]);
        setSaved(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generate = async () => {
    setLoading(true);
    try {
      const result = await generateHiringDecision(candidate, job, rankingResult);
      setDecision(result);
      setSaved(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveDecision = async () => {
    try {
      if (saved) {
        await base44.entities.HiringDecision.deleteMany({
          candidate_id: candidate.id,
          job_id: job.id,
        });
        await base44.entities.HiringDecision.create({
          ...decision,
          candidate_id: candidate.id,
          job_id: job.id,
        });
      } else {
        await base44.entities.HiringDecision.create({
          ...decision,
          candidate_id: candidate.id,
          job_id: job.id,
        });
        setSaved(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!decision && !loading) {
    return (
      <div className="rounded-lg border p-4 mt-3 border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Gavel className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Hiring Decision</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Generate an AI hiring confidence assessment with recommendation, strengths, risks, and interview focus.</p>
        <Button size="sm" onClick={generate} className="gap-2 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Generate Hiring Decision
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg border p-4 mt-3 border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Gavel className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Hiring Decision</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
          <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          Assessing hiring confidence...
        </div>
      </div>
    );
  }

  const recStyle = RECOMMENDATION_STYLES[decision.recommendation] || RECOMMENDATION_STYLES.Consider;
  const RecIcon = recStyle.icon;
  const scoreColor = decision.confidence_score >= 70 ? "text-emerald-600" : decision.confidence_score >= 45 ? "text-amber-600" : "text-red-500";

  return (
    <div className="rounded-lg border p-4 mt-3 border-t pt-4">
      <div className="flex items-center gap-2 mb-3">
        <Gavel className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Hiring Decision</span>
        {saved && <span className="text-[10px] text-emerald-600 font-medium ml-auto">✓ Saved</span>}
      </div>

      {/* Recommendation + Score */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${recStyle.bg} ${recStyle.border}`}>
          <RecIcon className={`w-4 h-4 ${recStyle.text}`} />
          <span className={`text-sm font-bold ${recStyle.text}`}>{decision.recommendation}</span>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Confidence</p>
          <p className={`score-mono text-2xl font-bold ${scoreColor}`}>{decision.confidence_score}</p>
        </div>
      </div>

      {/* Rationale */}
      {decision.rationale && (
        <div className="ai-inference rounded-lg p-3 mb-3">
          <p className="text-sm text-foreground leading-relaxed">{decision.rationale}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Strengths */}
        {decision.strengths && decision.strengths.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1.5 flex items-center gap-1">
              <Check className="w-3 h-3" /> Strengths
            </p>
            <ul className="space-y-1">
              {decision.strengths.map((s, i) => (
                <li key={i} className="text-[11px] text-foreground flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {decision.risks && decision.risks.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Risks
            </p>
            <ul className="space-y-1">
              {decision.risks.map((r, i) => (
                <li key={i} className="text-[11px] text-foreground flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">!</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Interview Focus */}
        {decision.interview_focus && decision.interview_focus.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1.5 flex items-center gap-1">
              <Target className="w-3 h-3" /> Interview Focus
            </p>
            <ul className="space-y-1">
              {decision.interview_focus.map((f, i) => (
                <li key={i} className="text-[11px] text-foreground flex items-start gap-1.5">
                  <span className="text-blue-500 mt-0.5">›</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
        <Button size="sm" variant="outline" onClick={generate} disabled={loading} className="text-xs gap-1.5">
          <Sparkles className="w-3 h-3" /> Regenerate
        </Button>
        <Button size="sm" variant="outline" onClick={saveDecision} className="text-xs gap-1.5">
          {saved ? "Update Saved Decision" : "Save Decision"}
        </Button>
      </div>
    </div>
  );
}