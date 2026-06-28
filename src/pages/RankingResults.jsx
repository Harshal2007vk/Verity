import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  ArrowLeft, Shield, ChevronDown, ChevronUp, Check, GitCompare,
  Download, FileText, X, Sparkles, Filter, MessageSquare, ClipboardList, Gavel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ScoreBadge from "@/components/shared/ScoreBadge";
import RiskBadge from "@/components/shared/RiskBadge";
import TrustBreakdown from "@/components/shared/TrustBreakdown";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";
import HiringBrief from "@/components/ai/HiringBrief";
import BiasCheckPanel from "@/components/ai/BiasCheckPanel";
import CandidateDecisionAssistant from "@/components/ai/CandidateDecisionAssistant";
import InterviewPlanGenerator from "@/components/ai/InterviewPlanGenerator";
import HiringDecisionPanel from "@/components/ai/HiringDecisionPanel";
import AIReasoningPanel from "@/components/ai/AIReasoningPanel";
import SemanticScoreCard from "@/components/ai/SemanticScoreCard";
import EvidenceTimeline from "@/components/ai/EvidenceTimeline";
import CandidateCompare from "@/components/ai/CandidateCompare";
const STRONG_THRESHOLD = 70;
const SUB_SCORE_LABELS = {
  semantic_fit: "Strong semantic fit",
  skill_proof: "Evidence-backed skills",
  experience_match: "Solid experience match",
  project_quality: "Quality project portfolio",
  career_growth: "Upward career growth",
  behavioral_signal: "Strong behavioral signals",
};

export default function RankingResults() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [exportN, setExportN] = useState(10);

  // Filters
  const [minOverall, setMinOverall] = useState(0);
  const [minTrust, setMinTrust] = useState(0);
  const [skillFilter, setSkillFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [activePanel, setActivePanel] = useState(null);
  const [interviewCandidate, setInterviewCandidate] = useState(null);

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      const [j, allRankings, allCandidates] = await Promise.all([
        base44.entities.Job.get(jobId),
        base44.entities.RankingResult.filter({ job_id: jobId }),
        base44.entities.Candidate.list(),
      ]);
      setJob(j);
      setRankings(allRankings.sort((a, b) => a.rank_position - b.rank_position));
      const candidateMap = {};
      allCandidates.forEach((c) => { candidateMap[c.id] = c; });
      setCandidates(candidateMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredRankings = useMemo(() => {
    return rankings.filter((r) => {
      const c = candidates[r.candidate_id];
      if (!c) return false;
      if (r.overall_score < minOverall) return false;
      if ((r.trust_score || 0) < minTrust) return false;
      if (riskFilter !== "all" && r.risk_level !== riskFilter) return false;
      if (skillFilter) {
        const skills = (c.skills_claimed || []).join(" ").toLowerCase();
        const transferable = (c.candidate_intelligence?.transferable_skills || []).join(" ").toLowerCase();
        if (!skills.includes(skillFilter.toLowerCase()) && !transferable.includes(skillFilter.toLowerCase())) return false;
      }
      if (locationFilter && !(c.location || "").toLowerCase().includes(locationFilter.toLowerCase())) return false;
      return true;
    });
  }, [rankings, candidates, minOverall, minTrust, skillFilter, riskFilter, locationFilter]);

  const toggleCompare = (id) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((x) => x !== id));
    } else if (compareIds.length < 4) {
      setCompareIds([...compareIds, id]);
    }
  };

  const compareRankings = compareIds
    .map((id) => rankings.find((r) => r.id === id))
    .filter(Boolean)
    .sort((a, b) => a.rank_position - b.rank_position);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) return <div className="text-center py-12 text-muted-foreground">Job not found.</div>;

  return (
    <div className="max-w-5xl">
      <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Intelligence Ranking Results · {filteredRankings.length} of {rankings.length} candidates shown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground font-mono">Top</span>
            <Input
              type="number"
              value={exportN}
              onChange={(e) => setExportN(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 h-8 text-center text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportToCSV(filteredRankings, candidates, job.title)}>
            <Download className="w-3.5 h-3.5" /> CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportToPDF(filteredRankings, candidates, job.title, exportN)}>
            <FileText className="w-3.5 h-3.5" /> PDF
          </Button>
        </div>
      </div>

      {/* AI Hiring Brief */}
      {filteredRankings.length > 0 && (
        <HiringBrief rankings={filteredRankings} candidates={candidates} job={job} />
      )}

      {/* Bias Check */}
      {filteredRankings.length > 0 && (
        <BiasCheckPanel rankings={filteredRankings} candidates={candidates} job={job} />
      )}

      {/* Filters */}
      <div className="bg-card rounded-xl border p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filters</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Min Overall Score</label>
            <Input
              type="number"
              value={minOverall || ""}
              onChange={(e) => setMinOverall(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Min Trust Score</label>
            <Input
              type="number"
              value={minTrust || ""}
              onChange={(e) => setMinTrust(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Skill</label>
            <Input
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="e.g. Python"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Risk Level</label>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Location</label>
            <Input
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="e.g. San Francisco"
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Compare bar */}
      {compareIds.length > 0 && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
          <span className="text-sm text-amber-800">
            {compareIds.length} candidate{compareIds.length > 1 ? "s" : ""} selected for comparison
            {compareIds.length < 2 && " (select at least 2)"}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCompareIds([])} className="text-xs gap-1">
              <X className="w-3 h-3" /> Clear
            </Button>
            <Button
              size="sm"
              disabled={compareIds.length < 2}
              onClick={() => setShowCompare(true)}
              className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold"
            >
              <GitCompare className="w-3.5 h-3.5" /> Compare
            </Button>
          </div>
        </div>
      )}

      {/* Compare modal */}
      {showCompare && compareRankings.length >= 2 && (
        <CandidateCompare
          rankings={compareRankings}
          candidates={candidates}
          onClose={() => setShowCompare(false)}
        />
      )}

      {/* Ranked list */}
      {filteredRankings.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center text-muted-foreground text-sm">
          {rankings.length === 0
            ? "No ranking results yet. Run Intelligence Ranking from the Dashboard."
            : "No candidates match the current filters."}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRankings.map((r) => {
            const c = candidates[r.candidate_id];
            const isExpanded = expandedId === r.id;
            const isSelected = compareIds.includes(r.id);
            const sub = r.sub_scores || {};
            const strongFactors = Object.keys(SUB_SCORE_LABELS).filter(
              (k) => (sub[k] || 0) >= STRONG_THRESHOLD
            );

            return (
              <div
                key={r.id}
                className={`bg-card rounded-xl border overflow-hidden transition-all ${
                  isSelected ? "ring-2 ring-amber-400" : "hover:shadow-md"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Compare checkbox */}
                    <div className="pt-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleCompare(r.id)}
                        disabled={!isSelected && compareIds.length >= 4}
                      />
                    </div>

                    {/* Rank */}
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <span className="score-mono text-lg font-bold text-foreground">#{r.rank_position}</span>
                    </div>

                    {/* Score badge */}
                    <div className="shrink-0 pt-1">
                      <ScoreBadge score={r.overall_score} label="Overall" size="lg" />
                    </div>

                    {/* Candidate info + why */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold truncate">{c?.full_name || "Unknown"}</h3>
                        <span className="text-sm text-muted-foreground truncate">
                          {c?.current_title}{c?.current_company && ` · ${c.current_company}`}
                        </span>
                      </div>

                      {/* Transferable skill chip */}
                      {r.top_transferable_skill && (
                        <div className="inline-flex items-center gap-1 mb-1.5">
                          <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider">Transferable:</span>
                          <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300 font-medium">
                            <Sparkles className="w-3 h-3" />
                            {r.top_transferable_skill}
                          </span>
                        </div>
                      )}

                      {/* Why explanation */}
                      {r.explanation && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-1.5">
                          {r.explanation}
                        </p>
                      )}

                      {/* Strong factor checkmarks */}
                      {strongFactors.length > 0 && (
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                          {strongFactors.map((k) => (
                            <span key={k} className="flex items-center gap-1 text-[11px] text-emerald-600">
                              <Check className="w-3 h-3" /> {SUB_SCORE_LABELS[k]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Trust + Risk badges */}
                    <div className="flex items-center gap-3 shrink-0">
                      <ScoreBadge score={r.trust_score || 0} label="Trust" size="sm" />
                      <RiskBadge level={r.risk_level} />
                    </div>

                    {/* Expand */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
                      className="shrink-0 p-1 rounded hover:bg-muted"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t bg-slate-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Score Breakdown</h4>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <SemanticScoreCard score={sub.semantic_fit} />
                          <SubScoreBar label="Skill Proof" value={sub.skill_proof} />
                          <SubScoreBar label="Experience Match" value={sub.experience_match} />
                          <SubScoreBar label="Project Quality" value={sub.project_quality} />
                        </div>
                        {c?.trust_breakdown && (
                          <div className="mt-4">
                            <TrustBreakdown trustBreakdown={c.trust_breakdown} />
                          </div>
                        )}
                        <AIReasoningPanel explanation={r.explanation} />
                      </div>
                      <div>
                        <EvidenceTimeline candidate={c} />
                      </div>
                    </div>

                    {c && (
                      <div className="mt-3 flex justify-end">
                        <Link to={`/candidates/${c.id}`} className="text-xs text-amber-600 hover:text-amber-800 font-medium">
                          View Full Intelligence Report →
                        </Link>
                      </div>
                    )}

                    {/* AI Copilot Actions */}
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                      <Button
                        size="sm"
                        variant={activePanel?.id === r.id && activePanel?.type === "assistant" ? "default" : "outline"}
                        onClick={() => setActivePanel(activePanel?.id === r.id && activePanel?.type === "assistant" ? null : { id: r.id, type: "assistant" })}
                        className="gap-1.5 text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Ask AI
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setInterviewCandidate(r.candidate_id)}
                        className="gap-1.5 text-xs"
                      >
                        <ClipboardList className="w-3.5 h-3.5" /> Interview Plan
                      </Button>
                      <Button
                        size="sm"
                        variant={activePanel?.id === r.id && activePanel?.type === "decision" ? "default" : "outline"}
                        onClick={() => setActivePanel(activePanel?.id === r.id && activePanel?.type === "decision" ? null : { id: r.id, type: "decision" })}
                        className="gap-1.5 text-xs"
                      >
                        <Gavel className="w-3.5 h-3.5" /> Hiring Decision
                      </Button>
                    </div>

                    {/* AI Panels */}
                    {activePanel?.id === r.id && activePanel?.type === "assistant" && c && (
                      <CandidateDecisionAssistant
                        candidate={c}
                        job={job}
                        rankingResult={r}
                        allRankings={rankings}
                        allCandidates={candidates}
                      />
                    )}
                    {activePanel?.id === r.id && activePanel?.type === "decision" && c && (
                      <HiringDecisionPanel
                        candidate={c}
                        job={job}
                        rankingResult={r}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Interview Plan Modal */}
      {interviewCandidate && (() => {
        const r = rankings.find((rr) => rr.candidate_id === interviewCandidate);
        const c = candidates[interviewCandidate];
        return (
          <InterviewPlanGenerator
            open={true}
            onClose={() => setInterviewCandidate(null)}
            candidate={c}
            job={job}
            rankingResult={r}
          />
        );
      })()}
    </div>
  );
}function SubScoreBar({ label, value }) {
  const v = value || 0;
  const barColor = v >= 75 ? "bg-emerald-500" : v >= 50 ? "bg-amber-500" : "bg-red-500";
  const textColor = v >= 75 ? "text-emerald-700" : v >= 50 ? "text-amber-700" : "text-red-700";
  return (
    <div className="p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <span className={`score-mono text-sm font-bold ${textColor}`}>{Math.round(v)}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}