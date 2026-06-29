import React, { useState, useEffect } from "react";
import { Check, X, Loader2, Activity, Server, Database, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { API_BASE } from "@/api/base44Client";

export default function SystemDiagnostics({ onClose }) {
  const [results, setResults] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setChecking(true);
    const diag = {
      frontend_url: window.location.href,
      api_base: API_BASE || "Not Set (Relative)",
      backend_reachable: false,
      database_connected: false,
      cors_frontend_url: null,
      error: null
    };

    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        diag.backend_reachable = true;
        const data = await res.json();
        diag.database_connected = data.database === 'connected';
        diag.cors_frontend_url = data.cors_frontend_url;
      } else {
        diag.error = `Backend returned ${res.status}`;
      }
    } catch (err) {
      diag.error = err.message;
    }

    setResults(diag);
    setChecking(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-xl border shadow-xl overflow-hidden">
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-foreground">System Diagnostics</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>

        <div className="p-6 space-y-6">
          {checking ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Running checks on Vercel, Render, and Supabase...</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Frontend (Vercel) Check */}
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${true ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Frontend (Vercel/Local)</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{results.frontend_url}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">API_BASE: {results.api_base}</p>
                </div>
              </div>

              {/* Backend (Render) Check */}
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${results.backend_reachable ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                  {results.backend_reachable ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">Backend (Render/Local)</p>
                  {results.backend_reachable ? (
                    <>
                      <p className="text-xs text-emerald-600 mt-1">Successfully connected to backend.</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">CORS Allowed Origin: {results.cors_frontend_url}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-red-500 mt-1">Failed to connect to backend.</p>
                      <p className="text-xs text-muted-foreground mt-1">Error: {results.error}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">Verify VITE_API_BASE_URL on Vercel is set to your Render URL.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Database (Supabase) Check */}
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${results.database_connected ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                  {results.database_connected ? <Database className="w-3.5 h-3.5" /> : <X className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">Database (Supabase)</p>
                  {results.database_connected ? (
                    <p className="text-xs text-emerald-600 mt-1">Successfully connected to Supabase.</p>
                  ) : (
                    <>
                      <p className="text-xs text-red-500 mt-1">Failed to connect to Supabase.</p>
                      {results.backend_reachable && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono">Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Render.</p>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
        
        {!checking && (
          <div className="p-4 border-t bg-muted/10 flex justify-end">
             <Button onClick={runDiagnostics} variant="outline" size="sm" className="gap-2">
                <Activity className="w-3.5 h-3.5" /> Rerun Checks
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}
