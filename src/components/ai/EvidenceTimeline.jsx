import React from "react";
import { CheckCircle2, Shield, Calendar, Award } from "lucide-react";

export default function EvidenceTimeline({ candidate }) {
  const history = candidate?.work_history || [];
  
  if (!history.length) return null;

  return (
    <div className="mt-4 border-l-2 border-slate-200 ml-3 pl-4 space-y-4">
      <div className="flex items-center gap-2 mb-2 -ml-8">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm">
          <Award className="w-4 h-4 text-slate-500" />
        </div>
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Experience Timeline</h4>
      </div>
      
      {history.map((item, idx) => (
        <div key={idx} className="relative">
          <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-white" />
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-sm font-semibold text-slate-900">{item.title}</h5>
                <p className="text-xs text-slate-500">{item.company}</p>
              </div>
              <span className="text-[10px] flex items-center gap-1 font-mono bg-slate-200/50 text-slate-600 px-2 py-0.5 rounded">
                <Calendar className="w-3 h-3" /> {item.start_date || 'Past'} - {item.end_date || 'Present'}
              </span>
            </div>
            {item.description && (
              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
