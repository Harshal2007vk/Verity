import React, { useState } from "react";
import { askAboutCandidate } from "@/lib/hiringAnalyst";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Sparkles, ShieldAlert, Brain } from "lucide-react";

export default function CandidateDecisionAssistant({ candidate, job, rankingResult, allRankings, allCandidates }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    `Why is this candidate ranked #${rankingResult?.rank_position}?`,
    "What are the biggest risks?",
    "What should I verify in interview?",
    "Is this candidate actually senior level?",
    "How does this candidate compare to others?",
  ];

  const ask = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const result = await askAboutCandidate(q, candidate, job, rankingResult, allRankings, allCandidates);
      setAnswer(result);
    } catch (e) {
      console.error(e);
      setAnswer({ answer: "Unable to generate analysis at this time. Please try again.", evidence_references: [], confidence: "low" });
    } finally {
      setLoading(false);
    }
  };

  const confidenceStyles = {
    high: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="ai-inference rounded-lg p-4 mt-3 border-t pt-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">AI Decision Assistant</span>
      </div>

      {/* Suggested questions */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => ask(q)}
            disabled={loading}
            className="text-[11px] px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Custom question input */}
      <div className="flex gap-2 mb-3">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask(question)}
          placeholder="Ask a specific question about this candidate..."
          disabled={loading}
          className="h-8 text-sm"
        />
        <Button
          size="sm"
          onClick={() => ask(question)}
          disabled={loading || !question.trim()}
          className="gap-1 shrink-0"
        >
          <Send className="w-3.5 h-3.5" /> Ask
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
          <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          Analyzing evidence...
        </div>
      )}

      {/* Answer */}
      {answer && !loading && (
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">AI Analysis</span>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${confidenceStyles[answer.confidence] || confidenceStyles.low}`}>
              {answer.confidence} confidence
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-3">{answer.answer}</p>
          {answer.evidence_references && answer.evidence_references.length > 0 && (
            <div className="border-t pt-2 mt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Evidence Referenced
              </p>
              <ul className="space-y-0.5">
                {answer.evidence_references.map((ref, i) => (
                  <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">›</span> {ref}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}