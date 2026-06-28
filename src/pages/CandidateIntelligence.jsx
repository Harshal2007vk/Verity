import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Sparkles, ExternalLink, Github, Award, BookOpen, Globe, Briefcase, GraduationCap, TrendingUp, User, Shield } from "lucide-react";
import AiInferenceCard from "@/components/shared/AiInferenceCard";
import ScoreBadge from "@/components/shared/ScoreBadge";
import TrustBreakdown from "@/components/shared/TrustBreakdown";
import SkillGraph from "@/components/shared/SkillGraph";
import { verifyCandidateTrust } from "@/lib/trustVerification";

const evidenceIcons = { github: Github, certificate: Award, publication: BookOpen, portfolio: Globe };

export default function CandidateIntelligence() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCandidate();
  }, [id]);

  const loadCandidate = async () => {
    try {
      const c = await base44.entities.Candidate.get(id);
      setCandidate(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateIntelligence = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Verity's Candidate Intelligence Engine. Analyze this candidate deeply.

Philosophy: "A resume is a claim. We look for evidence."

CANDIDATE:
Name: ${candidate.full_name}
Title: ${candidate.current_title || "N/A"}
Company: ${candidate.current_company || "N/A"}
Experience: ${candidate.total_experience_years || 0} years
Location: ${candidate.location || "N/A"}
Skills Claimed: ${(candidate.skills_claimed || []).join(", ")}
Evidence Links: ${JSON.stringify(candidate.evidence_links || [])}
Work History: ${JSON.stringify(candidate.work_history || [])}
Education: ${JSON.stringify(candidate.education || [])}

RESUME TEXT:
${(candidate.resume_text || "").substring(0, 3000)}

Generate a 360° candidate intelligence report:

1. skill_graph: For each skill claimed, assess confidence (0-100) and whether it's "claimed" (resume-only) or "evidenced" (backed by projects/certs/publications). If they have evidence links, skills related to those should be marked as "evidenced" with higher confidence. ORDER the skills from foundational to specialized (e.g., Python first, then Machine Learning, then Deep Learning, then LLM Fine-tuning) — this ordering represents the candidate's skill progression and will be visualized as a connected graph.

2. career_trajectory_summary: A 2-3 sentence analysis of their career path, growth pattern, and current trajectory.

3. transferable_skills: Skills they have that may not be explicitly listed but are implied by their experience.

4. growth_signal: Assessment of their growth trajectory — are they on an upward path, plateauing, or declining?`,
        response_json_schema: {
          type: "object",
          properties: {
            skill_graph: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  skill: { type: "string" },
                  confidence: { type: "number" },
                  source: { type: "string" }
                }
              }
            },
            career_trajectory_summary: { type: "string" },
            transferable_skills: { type: "array", items: { type: "string" } },
            growth_signal: { type: "string" }
          }
        },
        model: "claude_sonnet_4_6"
      });

      await base44.entities.Candidate.update(id, { candidate_intelligence: result });
      setCandidate(prev => ({ ...prev, candidate_intelligence: result }));
      toast({ title: "Intelligence generated", description: "360° profile is ready." });
    } catch (e) {
      console.error(e);
      toast({ title: "Generation failed", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const runTrustVerification = async () => {
    setVerifying(true);
    try {
      const result = await verifyCandidateTrust(candidate);
      await base44.entities.Candidate.update(id, { trust_breakdown: result });
      setCandidate(prev => ({ ...prev, trust_breakdown: result }));
      toast({ title: "Trust audit complete", description: `${result.claims?.length || 0} claims verified.` });
    } catch (e) {
      console.error(e);
      toast({ title: "Verification failed", variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!candidate) {
    return <div className="text-center py-12 text-muted-foreground">Candidate not found.</div>;
  }

  const intel = candidate.candidate_intelligence;

  return (
    <div className="max-w-4xl">
      <Link to="/candidates" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Pool
      </Link>

      {/* Header */}
      <div className="bg-card rounded-xl border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[hsl(222,47%,15%)] flex items-center justify-center text-white text-xl font-bold">
              {candidate.full_name?.charAt(0) || "?"}
            </div>
            <div>
              <h1 className="text-xl font-bold">{candidate.full_name}</h1>
              <p className="text-sm text-muted-foreground">
                {candidate.current_title}{candidate.current_company && ` at ${candidate.current_company}`}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                {candidate.location && <span>{candidate.location}</span>}
                {candidate.total_experience_years > 0 && <span>· {candidate.total_experience_years} yrs exp</span>}
              </div>
            </div>
          </div>
          <Button
            onClick={generateIntelligence}
            disabled={generating}
            className="gap-2 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-[hsl(222,47%,11%)]/30 border-t-[hsl(222,47%,11%)] rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> {intel ? "Regenerate" : "Generate"} Intelligence
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <MiniStat icon={Briefcase} label="Work History" value={`${(candidate.work_history || []).length} roles`} />
        <MiniStat icon={GraduationCap} label="Education" value={`${(candidate.education || []).length} entries`} />
        <MiniStat icon={ExternalLink} label="Evidence Links" value={`${(candidate.evidence_links || []).length} proofs`} />
      </div>

      {/* Evidence Links */}
      {(candidate.evidence_links || []).length > 0 && (
        <div className="bg-card rounded-xl border p-5 mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> Evidence / Proof Layer
          </h3>
          <div className="space-y-2">
            {candidate.evidence_links.map((ev, idx) => {
              const Icon = evidenceIcons[ev.type] || Globe;
              return (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium capitalize">{ev.type}</p>
                    {ev.description && <p className="text-xs text-muted-foreground">{ev.description}</p>}
                  </div>
                  {ev.url && (
                    <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trust Verification */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" /> Trust Verification
          </h2>
          <Button
            onClick={runTrustVerification}
            disabled={verifying}
            size="sm"
            className="gap-2 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold"
          >
            {verifying ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[hsl(222,47%,11%)]/30 border-t-[hsl(222,47%,11%)] rounded-full animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5" /> {candidate.trust_breakdown ? "Re-run" : "Run"} Trust Audit
              </>
            )}
          </Button>
        </div>
        {candidate.trust_breakdown ? (
          <TrustBreakdown trustBreakdown={candidate.trust_breakdown} defaultExpanded={true} />
        ) : (
          <div className="bg-card rounded-xl border p-8 text-center">
            <Shield className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              No trust audit yet. Run verification to extract claims from the resume and cross-reference them against the evidence layer.
            </p>
          </div>
        )}
      </div>

      {/* Skills */}
      {(candidate.skills_claimed || []).length > 0 && (
        <div className="bg-card rounded-xl border p-5 mb-6">
          <h3 className="text-sm font-semibold mb-3">Claimed Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.skills_claimed.map((s, i) => (
              <span key={i} className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* AI Intelligence Section */}
      {intel ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> AI Intelligence Report
          </h2>

          {/* Skill Relationship Graph */}
          {intel.skill_graph && intel.skill_graph.length > 0 && (
            <SkillGraph skillGraph={intel.skill_graph} transferableSkills={intel.transferable_skills || []} />
          )}

          {/* Career Trajectory */}
          {intel.career_trajectory_summary && (
            <AiInferenceCard title="Career Trajectory">
              <p className="text-sm text-foreground leading-relaxed">{intel.career_trajectory_summary}</p>
            </AiInferenceCard>
          )}

          {/* Transferable Skills note */}
          {intel.transferable_skills && intel.transferable_skills.length > 0 && (
            <AiInferenceCard title="Transferable Skills Analysis">
              <p className="text-sm text-muted-foreground">
                {intel.transferable_skills.length} transferable skill{intel.transferable_skills.length > 1 ? "s" : ""} identified — shown above in the skill graph with amber highlighting. These are skills relevant beyond the candidate's explicit job titles.
              </p>
            </AiInferenceCard>
          )}

          {/* Growth Signal */}
          {intel.growth_signal && (
            <AiInferenceCard title="Growth Signal">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-foreground leading-relaxed">{intel.growth_signal}</p>
              </div>
            </AiInferenceCard>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-xl border p-12 text-center">
          <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No intelligence report yet. Generate one to see the full 360° profile.</p>
          <Button onClick={generateIntelligence} disabled={generating} className="gap-2 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold">
            <Sparkles className="w-4 h-4" /> Generate Intelligence Report
          </Button>
        </div>
      )}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-card rounded-xl border p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold score-mono">{value}</p>
      </div>
    </div>
  );
}