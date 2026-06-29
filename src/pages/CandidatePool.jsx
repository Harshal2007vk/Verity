import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Trash2, Edit, Eye, Upload, X, ExternalLink, Github, Award, BookOpen, Globe } from "lucide-react";

const evidenceIcons = { github: Github, certificate: Award, publication: BookOpen, portfolio: Globe };

export default function CandidatePool() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(getEmptyForm());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadCandidates(); }, []);

  const loadCandidates = async () => {
    try {
      const data = await base44.entities.Candidate.list("-created_date");
      setCandidates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  function getEmptyForm() {
    return {
      full_name: "", current_title: "", current_company: "", total_experience_years: "",
      location: "", resume_text: "", skills_claimed: "",
      work_history: [{ company: "", title: "", start_date: "", end_date: "", description: "" }],
      education: [{ degree: "", institution: "", year: "" }],
      evidence_links: [],
      behavioral_signals: { profile_completeness_score: 0, response_rate: 0, endorsement_count: 0 },
    };
  }

  const openEdit = (c) => {
    setEditId(c.id);
    setForm({
      full_name: c.full_name || "",
      current_title: c.current_title || "",
      current_company: c.current_company || "",
      total_experience_years: c.total_experience_years || "",
      location: c.location || "",
      resume_text: c.resume_text || "",
      skills_claimed: (c.skills_claimed || []).join(", "),
      work_history: c.work_history?.length ? c.work_history : [{ company: "", title: "", start_date: "", end_date: "", description: "" }],
      education: c.education?.length ? c.education : [{ degree: "", institution: "", year: "" }],
      evidence_links: c.evidence_links || [],
      behavioral_signals: c.behavioral_signals || { profile_completeness_score: 0, response_rate: 0, endorsement_count: 0 },
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const data = {
        full_name: form.full_name,
        current_title: form.current_title,
        current_company: form.current_company,
        total_experience_years: parseFloat(form.total_experience_years) || 0,
        location: form.location,
        resume_text: form.resume_text,
        skills_claimed: form.skills_claimed.split(",").map(s => s.trim()).filter(Boolean),
        work_history: form.work_history.filter(w => w.company || w.title),
        education: form.education.filter(e => e.degree || e.institution),
        evidence_links: form.evidence_links,
        behavioral_signals: form.behavioral_signals,
      };
      if (editId) {
        await base44.entities.Candidate.update(editId, data);
        toast({ title: "Candidate updated" });
      } else {
        await base44.entities.Candidate.create(data);
        toast({ title: "Candidate added" });
      }
      setShowForm(false);
      setEditId(null);
      setForm(getEmptyForm());
      loadCandidates();
    } catch (e) {
      console.error(e);
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('resume', file);
    
    setUploading(true);
    toast({ title: "Analyzing resume..." });
    
    try {
      const { API_BASE } = await import('@/api/base44Client');
      const res = await fetch(`${API_BASE}/candidates/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Failed to parse resume');
      
      const parsedData = await res.json();
      setForm(prev => ({
        ...prev,
        ...parsedData,
        skills_claimed: (parsedData.skills_claimed || []).join(", ")
      }));
      
      toast({ title: "Resume parsed successfully" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error parsing resume", variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = null; // reset input
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this candidate?")) return;
    try {
      await base44.entities.Candidate.delete(id);
      toast({ title: "Candidate deleted" });
      loadCandidates();
    } catch (e) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const addEvidence = () => {
    setForm(prev => ({
      ...prev,
      evidence_links: [...prev.evidence_links, { type: "github", url: "", description: "" }]
    }));
  };

  const updateEvidence = (idx, field, value) => {
    setForm(prev => ({
      ...prev,
      evidence_links: prev.evidence_links.map((e, i) => i === idx ? { ...e, [field]: value } : e)
    }));
  };

  const removeEvidence = (idx) => {
    setForm(prev => ({
      ...prev,
      evidence_links: prev.evidence_links.filter((_, i) => i !== idx)
    }));
  };

  const filtered = candidates.filter(c =>
    !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.current_title?.toLowerCase().includes(search.toLowerCase()) ||
    c.current_company?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidate Pool</h1>
          <p className="text-sm text-muted-foreground mt-1">{candidates.length} candidates tracked</p>
        </div>
        <Button size="sm" className="gap-2 bg-[hsl(222,47%,15%)] hover:bg-[hsl(222,47%,20%)]" onClick={() => { setEditId(null); setForm(getEmptyForm()); setShowForm(true); }}>
          <Plus className="w-4 h-4" /> Add Candidate
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, title, or company..." className="pl-10" />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center">
          <p className="text-sm text-muted-foreground">No candidates found. Add your first candidate to get started.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">Name</th>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">Title</th>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">Company</th>
                <th className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">Exp (yrs)</th>
                <th className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">Evidence</th>
                <th className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">Skills</th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-sm">{c.full_name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.current_title || "—"}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.current_company || "—"}</td>
                  <td className="px-5 py-3.5 text-center score-mono text-sm">{c.total_experience_years || "—"}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`score-mono text-sm font-medium ${(c.evidence_links || []).length > 0 ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {(c.evidence_links || []).length}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center score-mono text-sm">{(c.skills_claimed || []).length}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/candidates/${c.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(v) => { if (!v) { setShowForm(false); setEditId(null); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{editId ? "Edit Candidate" : "Add Candidate"}</DialogTitle>
              {!editId && (
                <div className="flex items-center gap-2 mr-6">
                  <input type="file" id="resume-upload" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => document.getElementById('resume-upload').click()} disabled={uploading}>
                    <Upload className="w-4 h-4" />
                    {uploading ? "Parsing..." : "Upload Resume PDF"}
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name *</label>
                <Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Current Title</label>
                <Input value={form.current_title} onChange={e => setForm(p => ({ ...p, current_title: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Current Company</label>
                <Input value={form.current_company} onChange={e => setForm(p => ({ ...p, current_company: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Experience (years)</label>
                <Input type="number" value={form.total_experience_years} onChange={e => setForm(p => ({ ...p, total_experience_years: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Skills (comma-separated)</label>
                <Input value={form.skills_claimed} onChange={e => setForm(p => ({ ...p, skills_claimed: e.target.value }))} placeholder="Python, ML, React" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Resume Text</label>
              <textarea
                value={form.resume_text}
                onChange={e => setForm(p => ({ ...p, resume_text: e.target.value }))}
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder="Paste full resume text here..."
              />
            </div>

            {/* Evidence Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Evidence Links
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">PROOF LAYER</span>
                </label>
                <Button variant="outline" size="sm" onClick={addEvidence} className="gap-1 text-xs">
                  <Plus className="w-3 h-3" /> Add Evidence
                </Button>
              </div>
              {form.evidence_links.map((ev, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-start">
                  <select
                    value={ev.type}
                    onChange={e => updateEvidence(idx, "type", e.target.value)}
                    className="rounded-md border border-input bg-background px-2 py-2 text-sm w-32"
                  >
                    <option value="github">GitHub</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="certificate">Certificate</option>
                    <option value="publication">Publication</option>
                  </select>
                  <Input value={ev.url} onChange={e => updateEvidence(idx, "url", e.target.value)} placeholder="URL" className="flex-1" />
                  <Input value={ev.description} onChange={e => updateEvidence(idx, "description", e.target.value)} placeholder="Description" className="flex-1" />
                  <Button variant="ghost" size="sm" onClick={() => removeEvidence(idx)}><X className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-[hsl(222,47%,15%)] hover:bg-[hsl(222,47%,20%)]">
                {saving ? "Saving..." : editId ? "Update" : "Add Candidate"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}