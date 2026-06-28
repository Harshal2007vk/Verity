import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function SkillGraph({ skillGraph = [], transferableSkills = [] }) {
  const sorted = [...skillGraph].sort((a, b) => b.confidence - a.confidence);
  const topSkills = sorted.slice(0, 5);
  const remaining = sorted.slice(5);
  const evidencedCount = sorted.filter((s) => s.source === "evidenced").length;
  const claimedCount = sorted.filter((s) => s.source === "claimed").length;

  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Skill Relationship Graph</h3>
        <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          AI-inferred from experience
        </span>
      </div>

      {topSkills.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No skill data available.</p>
      ) : (
        <>
          {/* Main skill chain — horizontal flow with connecting lines */}
          <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
            {topSkills.map((skill, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className="flex items-center px-1 shrink-0">
                    <svg width="28" height="24" className="text-muted-foreground/40 shrink-0">
                      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                      <polygon points="22,7 28,12 22,17" fill="currentColor" />
                    </svg>
                  </div>
                )}
                <SkillNode skill={skill} index={i} />
              </React.Fragment>
            ))}
          </div>

          {/* Remaining skills as compact chips */}
          {remaining.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t">
              {remaining.map((s, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded ${
                    s.source === "evidenced"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {s.skill} · {s.confidence}%
                </span>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Evidenced ({evidencedCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Claimed only ({claimedCount})
            </span>
            <span className="flex items-center gap-1.5 ml-auto text-amber-600">
              <ArrowRight className="w-3 h-3" /> Progression: foundational → specialized
            </span>
          </div>

          {/* Transferable skills — distinctly highlighted */}
          {transferableSkills.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dashed border-amber-300">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">
                  Transferable Skills
                </span>
                <span className="text-[10px] text-muted-foreground">— relevant beyond explicit job titles</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {transferableSkills.map((s, i) => (
                  <span
                    key={i}
                    className="text-sm bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300 font-medium shadow-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SkillNode({ skill, index }) {
  const isEvidenced = skill.source === "evidenced";
  const opacity = Math.max(0.6, 1 - index * 0.08);

  return (
    <div
      className={`shrink-0 rounded-lg border p-3 min-w-[120px] transition-all ${
        isEvidenced
          ? "border-emerald-200 bg-emerald-50/50"
          : "border-slate-200 bg-slate-50"
      }`}
      style={{ opacity }}
    >
      <p className="text-xs font-semibold text-foreground truncate">{skill.skill}</p>
      <div className="flex items-center gap-1.5 mt-1.5">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isEvidenced ? "bg-emerald-500" : "bg-slate-400"
            }`}
            style={{ width: `${skill.confidence}%` }}
          />
        </div>
        <span className="text-[9px] font-mono font-bold text-muted-foreground">{skill.confidence}%</span>
      </div>
      <span
        className={`text-[8px] font-mono uppercase tracking-wider mt-1 inline-block ${
          isEvidenced ? "text-emerald-600" : "text-amber-600"
        }`}
      >
        {isEvidenced ? "● evidenced" : "○ claimed"}
      </span>
    </div>
  );
}