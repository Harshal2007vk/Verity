import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { RotateCcw, Sliders, Zap, ArrowRight } from "lucide-react";
import {
  WEIGHT_KEYS, WEIGHT_LABELS,
  getWeights, setWeights, resetWeights,
  getRiskPenaltyStrength, setRiskPenaltyStrength, resetRiskPenaltyStrength,
  DEFAULT_WEIGHTS_REF, DEFAULT_RISK_PENALTY_REF,
} from "@/lib/rankingConfig";
import { runFullRanking } from "@/lib/rankingEngine";
import RankingProgress from "@/components/shared/RankingProgress";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [weights, setLocalWeights] = useState(getWeights());
  const [riskStrength, setLocalRiskStrength] = useState(getRiskPenaltyStrength());
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [isReranking, setIsReranking] = useState(false);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const allJobs = await base44.entities.Job.list("-created_date");
      setJobs(allJobs);
    } catch (e) {
      console.error(e);
    }
  };

  const totalWeight = WEIGHT_KEYS.reduce((sum, k) => sum + (weights[k] || 0), 0);

  const handleWeightChange = (key, value) => {
    const newWeights = { ...weights, [key]: value[0] };
    setLocalWeights(newWeights);
    setWeights(newWeights);
  };

  const handleRiskChange = (value) => {
    setLocalRiskStrength(value[0]);
    setRiskPenaltyStrength(value[0]);
  };

  const handleReset = () => {
    resetWeights();
    resetRiskPenaltyStrength();
    setLocalWeights({ ...DEFAULT_WEIGHTS_REF });
    setLocalRiskStrength(DEFAULT_RISK_PENALTY_REF);
    toast({ title: "Reset to defaults", description: "Scoring weights restored to baseline." });
  };

  const handleRerank = async () => {
    if (!selectedJobId) {
      toast({ title: "Select a job", description: "Choose a job to re-rank with new weights.", variant: "destructive" });
      return;
    }
    const job = jobs.find((j) => j.id === selectedJobId);
    if (!job) return;

    let allCandidates = candidates;
    if (allCandidates.length === 0) {
      try {
        allCandidates = await base44.entities.Candidate.list();
        setCandidates(allCandidates);
      } catch (e) {
        console.error(e);
        return;
      }
    }

    setIsReranking(true);
    setProgress({ step: "verifying", current: 0, total: allCandidates.length, label: "Starting..." });

    try {
      const finalRankings = await runFullRanking(job, allCandidates, setProgress);

      const existing = await base44.entities.RankingResult.filter({ job_id: job.id });
      if (existing.length > 0) {
        await base44.entities.RankingResult.deleteMany({ job_id: job.id });
      }

      await base44.entities.RankingResult.bulkCreate(finalRankings);

      toast({ title: "Re-ranked successfully", description: `${finalRankings.length} candidates scored with new weights.` });
      navigate(`/jobs/${job.id}/rankings`);
    } catch (e) {
      console.error(e);
      toast({ title: "Re-rank failed", variant: "destructive" });
    } finally {
      setIsReranking(false);
      setProgress(null);
    }
  };

  if (progress) {
    return <RankingProgress progress={progress} />;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-amber-500" /> Scoring Configuration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tune the ranking engine weights and risk penalties. This is not a black box — adjust and re-rank to see the impact.
        </p>
      </div>

      {/* Weight sliders */}
      <div className="bg-card rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sub-Score Weights</h2>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${totalWeight === 100 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              Total: {totalWeight}
            </span>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-xs">
              <RotateCcw className="w-3 h-3" /> Reset
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          {WEIGHT_KEYS.map((key) => {
            const val = weights[key] || 0;
            const defaultVal = DEFAULT_WEIGHTS_REF[key];
            const isModified = val !== defaultVal;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{WEIGHT_LABELS[key]}</span>
                    {isModified && (
                      <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">modified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">default: {defaultVal}</span>
                    <span className="score-mono text-sm font-bold w-10 text-right">{val}</span>
                  </div>
                </div>
                <Slider
                  value={[val]}
                  onValueChange={(v) => handleWeightChange(key, v)}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground mt-4">
          Weights are normalized internally — the total doesn't need to be exactly 100. Higher weight = more influence on the overall score.
        </p>
      </div>

      {/* Risk penalty slider */}
      <div className="bg-card rounded-xl border p-6 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Risk Penalty Strength</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Penalty multiplier</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono">default: {DEFAULT_RISK_PENALTY_REF}</span>
            <span className={`score-mono text-sm font-bold w-10 text-right ${riskStrength !== DEFAULT_RISK_PENALTY_REF ? "text-amber-600" : ""}`}>{riskStrength}</span>
          </div>
        </div>
        <Slider
          value={[riskStrength]}
          onValueChange={handleRiskChange}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
          <span>0 = no penalty</span>
          <span>50 = standard</span>
          <span>100 = maximum</span>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground space-y-0.5">
          <p>At strength <span className="font-mono font-bold">{riskStrength}</span>:</p>
          <p>· Medium risk: <span className="font-mono">{(5 * (riskStrength / 50)).toFixed(1)}% score penalty</span></p>
          <p>· High risk: <span className="font-mono">{(15 * (riskStrength / 50)).toFixed(1)}% score penalty</span></p>
        </div>
      </div>

      {/* Re-rank section */}
      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Re-Rank with New Weights</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select a job and re-run the ranking engine. The new weights will be applied to compute fresh scores.
        </p>
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No jobs available. Create a job first.</p>
        ) : (
          <div className="flex items-center gap-3">
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a job to re-rank..." />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((j) => (
                  <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleRerank}
              disabled={isReranking || !selectedJobId}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold"
            >
              {isReranking ? (
                <>
                  <div className="w-4 h-4 border-2 border-[hsl(222,47%,11%)]/30 border-t-[hsl(222,47%,11%)] rounded-full animate-spin" />
                  Re-ranking...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Re-rank <ArrowRight className="w-3 h-3" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}