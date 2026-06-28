import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, CheckCircle2, Eye, X, Plus, Save } from "lucide-react";
import AiInferenceCard from "@/components/shared/AiInferenceCard";

export default function JobCreate() {
  const [title, setTitle] = useState("");
  const [rawDescription, setRawDescription] = useState("");
  const [teamContext, setTeamContext] = useState("");
  const [intelligence, setIntelligence] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const extractIntelligence = async () => {
    if (!rawDescription.trim()) {
      toast({ title: "Missing description", description: "Paste a job description first.", variant: "destructive" });
      return;
    }
    setExtracting(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Verity's Job Intelligence Engine. Analyze this job description deeply.

IMPORTANT: Go beyond keywords. Identify:
1. The STATED requirements (explicitly mentioned)
2. The HIDDEN requirements (implied but not stated — e.g., a JD asking for "production ML" implicitly requires MLOps/deployment knowledge; asking for "cross-functional collaboration" implies communication skills and stakeholder management)

Job Title: ${title || "Not specified"}
Team Context: ${teamContext || "Not provided"}

JOB DESCRIPTION:
${rawDescription}

Extract structured intelligence:`,
        response_json_schema: {
          type: "object",
          properties: {
            role: { type: "string" },
            seniority: { type: "string" },
            domain: { type: "string" },
            industry: { type: "string" },
            must_have_skills: { type: "array", items: { type: "string" } },
            nice_to_have_skills: { type: "array", items: { type: "string" } },
            hidden_requirements: { type: "array", items: { type: "string" } },
            responsibilities: { type: "array", items: { type: "string" } },
            context_notes: { type: "string" }
          }
        },
        model: "claude_sonnet_4_6"
      });
      setIntelligence(result);
      if (!title && result.role) setTitle(result.role);
    } catch (e) {
      console.error(e);
      toast({ title: "Extraction failed", description: "Could not extract intelligence. Try again.", variant: "destructive" });
    } finally {
      setExtracting(false);
    }
  };

  const removeItem = (field, idx) => {
    setIntelligence(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx)
    }));
  };

  const addItem = (field) => {
    const value = prompt(`Add ${field.replace(/_/g, " ")}:`);
    if (value) {
      setIntelligence(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value]
      }));
    }
  };

  const saveJob = async () => {
    if (!title.trim()) {
      toast({ title: "Missing title", description: "Add a job title.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await base44.entities.Job.create({
        title,
        raw_description: rawDescription,
        team_context: teamContext,
        job_intelligence: intelligence,
        status: "active",
      });
      toast({ title: "Job created", description: `"${title}" has been saved.` });
      navigate("/");
    } catch (e) {
      console.error(e);
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create Job</h1>
        <p className="text-sm text-muted-foreground mt-1">Paste a JD and let AI extract deep intelligence</p>
      </div>

      {/* Input Section */}
      <div className="bg-card rounded-xl border p-6 mb-6 space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Job Title</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior ML Engineer" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Job Description</label>
          <Textarea
            value={rawDescription}
            onChange={e => setRawDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Team Context <span className="text-muted-foreground font-normal">(optional)</span></label>
          <Textarea
            value={teamContext}
            onChange={e => setTeamContext(e.target.value)}
            placeholder="What does the team do? Who will this person work with?"
            className="min-h-[80px]"
          />
        </div>
        <Button
          onClick={extractIntelligence}
          disabled={extracting || !rawDescription.trim()}
          className="gap-2 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold"
        >
          {extracting ? (
            <>
              <div className="w-4 h-4 border-2 border-[hsl(222,47%,11%)]/30 border-t-[hsl(222,47%,11%)] rounded-full animate-spin" />
              Extracting Intelligence...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Extract Job Intelligence
            </>
          )}
        </Button>
      </div>

      {/* Intelligence Results */}
      {intelligence && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Eye className="w-4 h-4" /> Extracted Intelligence
          </h2>

          {/* Overview */}
          <div className="bg-card rounded-xl border p-5">
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Role" value={intelligence.role} />
              <InfoField label="Seniority" value={intelligence.seniority} />
              <InfoField label="Domain" value={intelligence.domain} />
              <InfoField label="Industry" value={intelligence.industry} />
            </div>
            {intelligence.context_notes && (
              <div className="mt-4 pt-4 border-t">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Context Notes</label>
                <p className="text-sm text-foreground mt-1">{intelligence.context_notes}</p>
              </div>
            )}
          </div>

          {/* Must Have Skills */}
          <TagCard
            title="Must-Have Skills"
            subtitle="STATED"
            items={intelligence.must_have_skills || []}
            onRemove={(idx) => removeItem("must_have_skills", idx)}
            onAdd={() => addItem("must_have_skills")}
            tagStyle="bg-[hsl(222,47%,15%)]/10 text-[hsl(222,47%,15%)]"
          />

          {/* Nice to Have */}
          <TagCard
            title="Nice-to-Have Skills"
            subtitle="STATED"
            items={intelligence.nice_to_have_skills || []}
            onRemove={(idx) => removeItem("nice_to_have_skills", idx)}
            onAdd={() => addItem("nice_to_have_skills")}
            tagStyle="bg-slate-100 text-slate-700"
          />

          {/* Hidden Requirements — KEY DIFFERENTIATOR */}
          <AiInferenceCard title="Hidden Requirements" className="rounded-xl">
            <p className="text-xs text-amber-600/80 mb-3">These requirements are implied by the job description but not explicitly stated. Verity's AI identified them as critical for true job fit.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {(intelligence.hidden_requirements || []).map((req, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 text-sm bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200">
                  <Sparkles className="w-3 h-3" />
                  {req}
                  <button onClick={() => removeItem("hidden_requirements", idx)} className="ml-1 hover:text-amber-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <button onClick={() => addItem("hidden_requirements")} className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add hidden requirement
            </button>
          </AiInferenceCard>

          {/* Responsibilities */}
          <div className="bg-card rounded-xl border p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Responsibilities
            </h3>
            <ul className="space-y-2">
              {(intelligence.responsibilities || []).map((r, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={saveJob} disabled={saving} className="gap-2 bg-[hsl(222,47%,15%)] hover:bg-[hsl(222,47%,20%)]">
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Job
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <p className="text-sm font-medium text-foreground mt-0.5">{value || "—"}</p>
    </div>
  );
}

function TagCard({ title, subtitle, items, onRemove, onAdd, tagStyle }) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">{title}</h3>
      {subtitle && <span className="text-[10px] font-mono text-muted-foreground mb-3 block">{subtitle}</span>}
      <div className="flex flex-wrap gap-2 mb-3">
        {items.map((item, idx) => (
          <span key={idx} className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg ${tagStyle}`}>
            {item}
            <button onClick={() => onRemove(idx)} className="ml-1 opacity-50 hover:opacity-100">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <button onClick={onAdd} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
        <Plus className="w-3 h-3" /> Add
      </button>
    </div>
  );
}