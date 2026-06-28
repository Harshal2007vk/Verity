import React, { useState } from "react";
import { generateInterviewPlan } from "@/lib/hiringAnalyst";
import { Button } from "@/components/ui/button";
import { ClipboardList, Code2, Users, ShieldQuestion, X, Sparkles } from "lucide-react";

export default function InterviewPlanGenerator({ open, onClose, candidate, job, rankingResult }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const result = await generateInterviewPlan(candidate, job, rankingResult);
      setPlan(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-xl border shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-card z-10">
          <h2 className="font-semibold flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-amber-500" /> Interview Plan
            <span className="text-sm text-muted-foreground font-normal">· {candidate?.full_name}</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {!plan && !loading && (
            <div className="text-center py-8">
              <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Generate a targeted interview plan with technical, behavioral, and verification questions based on this candidate's evidence and trust audit.
              </p>
              <Button onClick={generate} className="gap-2 bg-amber-500 hover:bg-amber-600 text-[hsl(222,47%,11%)] font-semibold">
                <Sparkles className="w-4 h-4" /> Generate Interview Plan
              </Button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Analyzing claims and generating targeted questions...</p>
            </div>
          )}

          {plan && !loading && (
            <div className="space-y-5">
              {/* Technical */}
              <QuestionSection
                icon={Code2}
                title="Technical Questions"
                accent="text-blue-600 bg-blue-50 border-blue-200"
                questions={plan.technical_questions}
                renderItem={(q) => (
                  <>
                    <p className="text-sm font-medium text-foreground">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">Look for: {q.focus}</p>
                  </>
                )}
              />

              {/* Behavioral */}
              <QuestionSection
                icon={Users}
                title="Behavioral Questions"
                accent="text-purple-600 bg-purple-50 border-purple-200"
                questions={plan.behavioral_questions}
                renderItem={(q) => (
                  <>
                    <p className="text-sm font-medium text-foreground">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">Look for: {q.focus}</p>
                  </>
                )}
              />

              {/* Verification */}
              <QuestionSection
                icon={ShieldQuestion}
                title="Verification Questions"
                accent="text-amber-700 bg-amber-50 border-amber-200"
                questions={plan.verification_questions}
                renderItem={(q) => (
                  <>
                    <p className="text-sm font-medium text-foreground">{q.question}</p>
                    <p className="text-xs text-amber-700 mt-1">Verifying: {q.verifying}</p>
                    <p className="text-xs text-red-500 mt-0.5">Red flag: {q.red_flag}</p>
                  </>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionSection({ icon: Icon, title, accent, questions, renderItem }) {
  if (!questions || questions.length === 0) return null;
  return (
    <div>
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${accent} mb-2`}>
        <Icon className="w-3.5 h-3.5" /> {title}
      </div>
      <div className="space-y-2">
        {questions.map((q, i) => (
          <div key={i} className="bg-muted/30 rounded-lg border p-3">
            {renderItem(q)}
          </div>
        ))}
      </div>
    </div>
  );
}