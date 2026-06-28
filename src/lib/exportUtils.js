import jsPDF from "jspdf";

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(rankings, candidates, jobTitle) {
  const headers = [
    "Rank", "Name", "Title", "Company", "Experience (yrs)", "Location",
    "Overall Score", "Trust Score", "Risk Level",
    "Semantic Fit", "Skill Proof", "Experience Match", "Project Quality", "Career Growth", "Behavioral Signal",
    "Transferable Skill", "Explanation",
  ];

  const rows = rankings.map((r) => {
    const c = candidates[r.candidate_id] || {};
    const s = r.sub_scores || {};
    return [
      r.rank_position || "",
      c.full_name || "",
      c.current_title || "",
      c.current_company || "",
      c.total_experience_years || "",
      c.location || "",
      r.overall_score ?? "",
      r.trust_score ?? "",
      r.risk_level || "",
      s.semantic_fit ?? "",
      s.skill_proof ?? "",
      s.experience_match ?? "",
      s.project_quality ?? "",
      s.career_growth ?? "",
      s.behavioral_signal ?? "",
      r.top_transferable_skill || "",
      (r.explanation || "").replace(/"/g, '""'),
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  downloadFile(csv, `${jobTitle.replace(/\s+/g, "_")}_shortlist.csv`, "text/csv");
}

export function exportToPDF(rankings, candidates, jobTitle, topN = 10) {
  const doc = new jsPDF();
  const topRankings = rankings.slice(0, topN);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("VERITY — Intelligence Shortlist", 14, 20);
  doc.setFontSize(12);
  doc.text(jobTitle, 14, 28);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated ${new Date().toLocaleDateString()} · Top ${topRankings.length} of ${rankings.length} ranked`, 14, 34);

  let y = 44;
  topRankings.forEach((r) => {
    const c = candidates[r.candidate_id] || {};
    const s = r.sub_scores || {};

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setDrawColor(200);
    doc.line(14, y - 4, 196, y - 4);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`#${r.rank_position}  ${c.full_name || "Unknown"}`, 14, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${c.current_title || ""}${c.current_company ? " at " + c.current_company : ""}`, 14, y + 5);
    doc.text(`Overall: ${r.overall_score}   Trust: ${r.trust_score || 0}   Risk: ${(r.risk_level || "medium").toUpperCase()}`, 14, y + 10);

    doc.setFontSize(8);
    doc.text(`SemFit ${s.semantic_fit||0} · SkillProof ${s.skill_proof||0} · Exp ${s.experience_match||0} · Proj ${s.project_quality||0} · Growth ${s.career_growth||0} · Behav ${s.behavioral_signal||0}`, 14, y + 15);

    if (r.top_transferable_skill) {
      doc.setTextColor(180, 120, 0);
      doc.text(`Transferable: ${r.top_transferable_skill}`, 14, y + 20);
      doc.setTextColor(0, 0, 0);
    }

    const explanation = doc.splitTextToSize(r.explanation || "No explanation available.", 180);
    doc.setFontSize(8);
    doc.text(explanation, 14, y + 25);

    y += 25 + explanation.length * 4 + 8;
  });

  doc.save(`${jobTitle.replace(/\s+/g, "_")}_shortlist.pdf`);
}