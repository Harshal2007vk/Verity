import React from "react";
import { GitCompare, X } from "lucide-react";
import RiskBadge from "../shared/RiskBadge";

export default function CandidateCompare({ rankings, candidates, onClose }) {
  const subKeys = ["semantic_fit", "skill_proof", "experience_match", "project_quality", "career_growth", "behavioral_signal"];
  const subLabels = {
    semantic_fit: "Semantic Fit", skill_proof: "Skill Depth", experience_match: "Experience Quality",
    project_quality: "Project Impact", career_growth: "Career Growth", behavioral_signal: "Behavioral Signal",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl border shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b bg-slate-50/50">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <GitCompare className="w-5 h-5 text-indigo-600" /> Deep Candidate Comparison
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-0 overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="text-left py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-48 border-b border-r border-slate-200">Metrics</th>
                {rankings.map((r) => {
                  const c = candidates[r.candidate_id];
                  return (
                    <th key={r.id} className="text-center py-4 px-5 min-w-[180px] border-b border-r border-slate-200 bg-white">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center font-bold mb-2 text-xs">#{r.rank_position}</div>
                      <div className="font-bold text-slate-900">{c?.full_name || "Unknown"}</div>
                      <div className="text-[11px] text-slate-500 font-medium mt-1">{c?.current_title}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-5 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50">Overall AI Score</td>
                {rankings.map((r) => (
                  <td key={r.id} className="text-center py-4 px-5 border-r border-slate-200">
                    <span className="text-2xl font-black text-indigo-600 score-mono">{r.overall_score}</span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-5 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50">Trust Score</td>
                {rankings.map((r) => (
                  <td key={r.id} className="text-center py-4 px-5 border-r border-slate-200">
                    <span className="text-lg font-bold text-slate-700 score-mono">{r.trust_score || 0}</span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-5 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50">Risk Level</td>
                {rankings.map((r) => (
                  <td key={r.id} className="text-center py-4 px-5 border-r border-slate-200">
                    <RiskBadge level={r.risk_level} />
                  </td>
                ))}
              </tr>
              {subKeys.map((k) => (
                <tr key={k} className="hover:bg-slate-50/50">
                  <td className="py-3 px-5 text-slate-600 border-r border-slate-200 bg-slate-50">{subLabels[k]}</td>
                  {rankings.map((r) => {
                    const v = r.sub_scores?.[k] || 0;
                    const color = v >= 75 ? "text-emerald-600" : v >= 50 ? "text-amber-600" : "text-red-500";
                    return (
                      <td key={r.id} className={`text-center py-3 px-5 border-r border-slate-200 score-mono ${color} font-bold`}>
                        {Math.round(v)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-5 font-semibold text-slate-700 align-top border-r border-slate-200 bg-slate-50">AI Reasoning</td>
                {rankings.map((r) => (
                  <td key={r.id} className="text-left align-top py-4 px-5 border-r border-slate-200 bg-indigo-50/30">
                    <p className="text-xs text-indigo-900/80 leading-relaxed font-medium">
                      {r.explanation}
                    </p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
