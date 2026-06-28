import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BriefcaseBusiness, Users, LogOut, Shield, Sliders } from "lucide-react";
import { base44 } from "@/api/base44Client";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Create Job", path: "/jobs/create", icon: BriefcaseBusiness },
  { label: "Candidate Pool", path: "/candidates", icon: Users },
  { label: "Settings", path: "/settings", icon: Sliders },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[hsl(222,47%,11%)] text-[hsl(210,40%,96%)] flex flex-col z-50">
      {/* Brand */}
      <div className="px-6 pt-6 pb-4 border-b border-[hsl(222,30%,18%)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-amber-500 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-[hsl(222,47%,11%)]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Verity</h1>
          </div>
        </div>
        <p className="text-[11px] text-[hsl(220,9%,55%)] mt-2 font-mono leading-relaxed">
          Resume is a claim.<br />We rank on evidence.
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[hsl(222,47%,16%)] text-white"
                  : "text-[hsl(220,9%,65%)] hover:text-white hover:bg-[hsl(222,47%,14%)]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-amber-500" : ""}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={() => base44.auth.logout("/")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(220,9%,55%)] hover:text-white hover:bg-[hsl(222,47%,14%)] transition-all duration-150 w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}