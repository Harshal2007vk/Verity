import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BarChart2, Trophy, AlertTriangle, CheckCircle, XCircle, ArrowRight, Cpu } from "lucide-react";

const ScoreBar = ({ label, a, b, max = 100 }) => {
  const winner = a > b ? "a" : b > a ? "b" : null;
  return (
    <div className="grid grid-cols-[1fr_120px_1fr] gap-3 items-center py-2 border-b border-border/40 last:border-0">
      <div className="flex items-center justify-end gap-2">
        <span className={`text-sm font-mono font-bold ${winner === "a" ? "text-emerald-400" : "text-slate-400"}`}>{a}</span>
        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden flex justify-end">
          <div className={`h-full rounded-full transition-all ${winner === "a" ? "bg-emerald-500" : "bg-slate-500"}`} style={{ width: `${(a / max) * 100}%` }} />
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${winner === "b" ? "bg-emerald-500" : "bg-slate-500"}`} style={{ width: `${(b / max) * 100}%` }} />
        </div>
        <span className={`text-sm font-mono font-bold ${winner === "b" ? "text-emerald-400" : "text-slate-400"}`}>{b}</span>
      </div>
    </div>
  );
};

const RISK_COLORS = { low: "text-emerald-400", medium: "text-amber-400", high: "text-red-400" };
const REC_COLORS = {
  "Strong Hire": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Proceed to Interview": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Needs Verification": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Reject": "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function CandidateComparison() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [pickedA, setPickedA] = useState("");
  const [pickedB, setPickedB] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.Job.list().then(setJobs).catch(console.error);
    base44.entities.Candidate.list().then(setCandidates).catch(console.error);
  }, []);

  const handleCompare = async () => {
    if (!selectedJob || !pickedA || !pickedB) {
      toast({ title: "Select a job and both candidates", variant: "destructive" });
      return;
    }
    if (pickedA === pickedB) {
      toast({ title: "Select two different candidates", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const { API_BASE } = await import('@/api/base44Client');
      const candA = candidates.find(c => c.id === pickedA);
      const candB = candidates.find(c => c.id === pickedB);
      const res = await fetch(`${API_BASE}/rankings/rank-candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJob, candidates: [candA, candB] })
      });
      if (!res.ok) throw new Error("Ranking failed");
      const ranked = await res.json();
      const rA = ranked.find(r => r.candidate_id === pickedA);
      const rB = ranked.find(r => r.candidate_id === pickedB);
      setResults({ candA, candB, rA, rB });
    } catch (e) {
      toast({ title: "Comparison failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const winner = results && (results.rA.overall_score > results.rB.overall_score ? results.candA : results.candB);
  const loser = results && (results.rA.overall_score > results.rB.overall_score ? results.candB : results.candA);
  const winnerResult = results && (results.rA.overall_score > results.rB.overall_score ? results.rA : results.rB);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Candidate Comparison</h1>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          Side-by-side AI analysis — beyond keywords, into evidence
        </p>
      </div>

      {/* Controls */}
      <div className="bg-card border rounded-xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Job Role</label>
            <select
              value={selectedJob}
              onChange={e => setSelectedJob(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
            >
              <option value="">Select a job...</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Candidate A</label>
            <select
              value={pickedA}
              onChange={e => setPickedA(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
            >
              <option value="">Select candidate...</option>
              {candidates.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Candidate B</label>
            <select
              value={pickedB}
              onChange={e => setPickedB(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
            >
              <option value="">Select candidate...</option>
              {candidates.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </div>
        </div>
        <Button
          onClick={handleCompare}
          disabled={loading || !selectedJob || !pickedA || !pickedB}
          className="w-full gap-2 bg-violet-600 hover:bg-violet-700"
        >
          <Cpu className="w-4 h-4" />
          {loading ? "Gemini is analyzing both candidates..." : "Run AI Comparison"}
        </Button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Winner Banner */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-400 font-bold text-lg">AI Recommendation</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold">{winner.full_name}</span>
              <ArrowRight className="w-5 h-5 text-emerald-400" />
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${REC_COLORS[winnerResult.hiring_recommendation] || REC_COLORS["Needs Verification"]}`}>
                {winnerResult.hiring_recommendation}
              </span>
              <span className="text-sm text-muted-foreground ml-1">• {winnerResult.confidence_percent}% confidence</span>
            </div>
            <p className="text-sm text-muted-foreground">{winnerResult.explanation}</p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { cand: results.candA, result: results.rA, label: "Candidate A" },
              { cand: results.candB, result: results.rB, label: "Candidate B" }
            ].map(({ cand, result, label }) => (
              <div key={cand.id} className={`rounded-xl border p-5 ${cand.id === winner.id ? "border-emerald-500/40 bg-emerald-500/5" : "border-border"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</p>
                    <h3 className="font-bold text-lg">{cand.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{cand.current_title}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold font-mono ${cand.id === winner.id ? "text-emerald-400" : "text-slate-400"}`}>
                      {result.overall_score}
                    </div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${RISK_COLORS[result.risk_level] || "text-slate-400"}`}>
                  {result.risk_level?.toUpperCase()} RISK
                </div>

                {/* Strengths */}
                {result.strengths?.length > 0 && (
                  <div className="mb-3">
                    {result.strengths.slice(0, 2).map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300 mb-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                )}

                {/* Gaps */}
                {result.gaps?.length > 0 && (
                  <div>
                    {result.gaps.slice(0, 2).map((g, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-400 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                        {g}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Score Comparison Table */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Score Breakdown</h3>
            <div className="mb-4">
              <ScoreBar label="Overall" a={results.rA.overall_score} b={results.rB.overall_score} />
              <ScoreBar label="Semantic Fit" a={results.rA.sub_scores?.semantic_fit || 50} b={results.rB.sub_scores?.semantic_fit || 50} />
              <ScoreBar label="Skill Proof" a={results.rA.sub_scores?.skill_proof || 50} b={results.rB.sub_scores?.skill_proof || 50} />
              <ScoreBar label="Experience" a={results.rA.sub_scores?.experience_match || 50} b={results.rB.sub_scores?.experience_match || 50} />
              <ScoreBar label="Project Quality" a={results.rA.sub_scores?.project_quality || 50} b={results.rB.sub_scores?.project_quality || 50} />
              <ScoreBar label="Trust" a={results.rA.trust_score || 0} b={results.rB.trust_score || 0} />
            </div>
            <div className="grid grid-cols-[1fr_120px_1fr] gap-3 pt-3 border-t border-border">
              <p className="text-xs text-right text-muted-foreground">{results.candA.full_name}</p>
              <p className="text-xs text-center text-muted-foreground">vs</p>
              <p className="text-xs text-muted-foreground">{results.candB.full_name}</p>
            </div>
          </div>

          {/* Why Winner Won */}
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Why {winner.full_name} wins</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{winnerResult.explanation}</p>
            {winnerResult.top_transferable_skill && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">
                <span className="font-semibold">Top Transferable Skill:</span> {winnerResult.top_transferable_skill}
              </div>
            )}
          </div>
        </div>
      )}

      {!results && !loading && (
        <div className="bg-card border rounded-xl p-16 text-center text-muted-foreground">
          <BarChart2 className="w-10 h-10 mx-auto mb-4 opacity-30" />
          <p className="text-sm">Select a job and two candidates, then run the AI comparison</p>
        </div>
      )}
    </div>
  );
}
