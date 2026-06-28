import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { BriefcaseBusiness, Users, Zap, Plus, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { runFullRanking } from "@/lib/rankingEngine";
import { seedDemoData } from "@/lib/seedData";
import RankingProgress from "@/components/shared/RankingProgress";
import DemoFlow from "@/components/ai/DemoFlow";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rankingJobId, setRankingJobId] = useState(null);
  const [rankingProgress, setRankingProgress] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [j, c, r] = await Promise.all([
        base44.entities.Job.list("-created_date"),
        base44.entities.Candidate.list("-created_date"),
        base44.entities.RankingResult.list("-created_date"),
      ]);
      setJobs(j);
      setCandidates(c);
      setRankings(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runRanking = async (job) => {
    if (candidates.length === 0) {
      toast({ title: "No candidates", description: "Add candidates before running intelligence ranking.", variant: "destructive" });
      return;
    }
    setRankingJobId(job.id);
    setRankingProgress({ step: "verifying", current: 0, total: candidates.length, label: "Starting..." });
    try {
      const finalRankings = await runFullRanking(job, candidates, setRankingProgress);

      if (rankings.some((r) => r.job_id === job.id)) {
        await base44.entities.RankingResult.deleteMany({ job_id: job.id });
      }

      await base44.entities.RankingResult.bulkCreate(finalRankings);

      toast({ title: "Ranking Complete", description: `${finalRankings.length} candidates ranked · trust verified` });
      loadData();
    } catch (e) {
      console.error(e);
      toast({ title: "Ranking Failed", description: "Could not complete AI ranking. Try again.", variant: "destructive" });
    } finally {
      setRankingJobId(null);
      setRankingProgress(null);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const result = await seedDemoData();
      if (result.skipped) {
        toast({ title: "Demo data exists", description: result.message });
      } else {
        toast({ title: "Demo data loaded", description: `${result.jobs} jobs and ${result.candidates} candidates added.` });
      }
      loadData();
    } catch (e) {
      console.error(e);
      toast({ title: "Seeding failed", description: "Could not load demo data.", variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  const isEmpty = jobs.length === 0 && candidates.length === 0;

  return (
    <div>
      {rankingProgress && <RankingProgress progress={rankingProgress} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Intelligence Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Evidence-based candidate ranking at a glance</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDemo(true)}
            className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <Zap className="w-4 h-4" /> Run Verity Demo
          </Button>
          <Link to="/candidates">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="w-4 h-4" /> Candidates
            </Button>
          </Link>
          <Link to="/jobs/create">
            <Button size="sm" className="gap-2 bg-[hsl(222,47%,15%)] hover:bg-[hsl(222,47%,20%)]">
              <Plus className="w-4 h-4" /> New Job
            </Button>
          </Link>
        </div>
      </div>

      {isEmpty ? (
        <div className="bg-card rounded-xl border p-10">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">Welcome to Verity</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Evidence-based candidate ranking. A resume is a claim — we rank on proof. Here's how to get started:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <OnboardingStep step="1" title="Add a Job" description="Paste a job description and let AI extract structured intelligence." />
            <OnboardingStep step="2" title="Build Candidate Pool" description="Add candidates with resumes, skills, and evidence links." />
            <OnboardingStep step="3" title="Run Intelligence Ranking" description="AI verifies claims and scores candidates on evidence-backed fit." />
            <OnboardingStep step="4" title="Review Trust-Verified Shortlist" description="Compare scores, trust breakdowns, and export your shortlist." />
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowDemo(true)}
                className="gap-2 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold"
              >
                <Zap className="w-4 h-4" /> Run Verity Demo
              </Button>
              <Button
                onClick={handleSeed}
                disabled={seeding}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {seeding ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" /> Just Load Data
                  </>
                )}
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">
              Demo runs the full AI pipeline · or load data to explore manually
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard icon={BriefcaseBusiness} label="Active Jobs" value={jobs.filter((j) => j.status !== "closed").length} />
            <StatCard icon={Users} label="Candidate Pool" value={candidates.length} />
            <StatCard icon={Activity} label="Rankings Run" value={new Set(rankings.map((r) => r.job_id)).size} />
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Jobs</h2>
            {jobs.length === 0 ? (
              <div className="bg-card rounded-xl border p-12 text-center">
                <BriefcaseBusiness className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No jobs yet. Create your first job to start ranking candidates.</p>
                <Link to="/jobs/create">
                  <Button size="sm" className="gap-2 bg-[hsl(222,47%,15%)] hover:bg-[hsl(222,47%,20%)]">
                    <Plus className="w-4 h-4" /> Create Job
                  </Button>
                </Link>
              </div>
            ) : (
              jobs.map((job) => {
                const jobRankings = rankings.filter((r) => r.job_id === job.id);
                const intel = job.job_intelligence || {};
                const isRunning = rankingJobId === job.id;

                return (
                  <div key={job.id} className="bg-card rounded-xl border p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                          <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                            job.status === "active" ? "bg-emerald-50 text-emerald-700" : job.status === "closed" ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-700"
                          }`}>
                            {job.status || "active"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                          {intel.domain && <span className="font-medium">{intel.domain}</span>}
                          {intel.seniority && <span> · {intel.seniority}</span>}
                          {intel.industry && <span> · {intel.industry}</span>}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {candidates.length} candidates
                          </span>
                          {jobRankings.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-amber-500" /> {jobRankings.length} ranked
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => runRanking(job)}
                          disabled={isRunning}
                          className="gap-2 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold"
                        >
                          {isRunning ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-[hsl(222,47%,11%)]/30 border-t-[hsl(222,47%,11%)] rounded-full animate-spin" />
                              Ranking...
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" /> Run Intelligence Ranking
                            </>
                          )}
                        </Button>
                        {jobRankings.length > 0 && (
                          <Link to={`/jobs/${job.id}/rankings`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              View Results <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {showDemo && <DemoFlow onComplete={() => setShowDemo(false)} />}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[hsl(222,47%,15%)]/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[hsl(222,47%,15%)]" />
        </div>
        <div>
          <p className="score-mono text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function OnboardingStep({ step, title, description }) {
  return (
    <div className="bg-muted/30 rounded-xl border p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-amber-500 text-[hsl(222,47%,11%)] flex items-center justify-center text-sm font-bold score-mono">
          {step}
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}