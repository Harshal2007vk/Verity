import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { runVerityDemo } from "@/lib/hiringAnalyst";
import { Check, Loader2, Brain, Shield, Sparkles, Zap, FileSearch, ListChecks } from "lucide-react";

const STEPS = [
  { icon: FileSearch, label: "Loading ML Engineer job" },
  { icon: FileSearch, label: "Loading 10 candidates" },
  { icon: Brain, label: "AI analyzing resumes" },
  { icon: Shield, label: "Checking evidence" },
  { icon: Sparkles, label: "Building candidate intelligence" },
  { icon: Zap, label: "Generating shortlist" },
  { icon: ListChecks, label: "Shortlist ready" },
];

export default function DemoFlow({ onComplete }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepLabel, setStepLabel] = useState(STEPS[0].label);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    runDemo();
  }, []);

  const runDemo = async () => {
    try {
      const result = await runVerityDemo(({ step, label }) => {
        setCurrentStep(step);
        setStepLabel(label);
      });
      setDone(true);
      await new Promise((r) => setTimeout(r, 1200));
      onComplete?.();
      navigate(`/jobs/${result.jobId}/rankings`);
    } catch (e) {
      console.error(e);
      setError(e.message || "Demo failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[hsl(222,47%,11%)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mb-3">
            <Brain className="w-6 h-6 text-[hsl(222,47%,11%)]" />
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">Verity Demo</h1>
          <p className="text-slate-400 text-sm mt-1">AI-powered candidate intelligence</p>
        </div>

        {/* Steps */}
        <div className="space-y-1">
          {STEPS.map((step, i) => {
            const isCurrent = i === currentStep && !done;
            const isComplete = i < currentStep || (done && i === STEPS.length - 1);
            const isPending = i > currentStep;
            const Icon = step.icon;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isCurrent ? "bg-slate-800" : isComplete ? "opacity-60" : "opacity-30"
                }`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                  {isComplete ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isCurrent ? "text-amber-400" : isComplete ? "text-slate-300" : "text-slate-500"}`}>
                    {isCurrent ? stepLabel : step.label}
                  </p>
                  {isCurrent && (
                    <div className="h-0.5 bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 text-center">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={onComplete}
              className="text-slate-400 text-xs hover:text-white"
            >
              Close
            </button>
          </div>
        )}

        {/* Progress bar */}
        {!error && (
          <div className="mt-8">
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${((done ? STEPS.length : currentStep) / STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-center text-xs text-slate-500 mt-2 score-mono">
              {Math.round(((done ? STEPS.length : currentStep) / STEPS.length) * 100)}% complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
}