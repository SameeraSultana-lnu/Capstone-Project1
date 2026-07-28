import {
  Stethoscope, Lock, Info, ShieldCheck, CheckCircle2, X, LogOut, UserCircle2,
  LayoutDashboard, MessageSquare, FileText, UserCog, ClipboardList
} from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "../constants/appMeta";

export default function AppHeader({
  currentUser, currentRole, session, aboutOpen, setAboutOpen,
  accessOpen, setAccessOpen, accessItems, onLogout
}) {
  return (
    <>
      <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center shrink-0">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <span className="font-brand font-bold text-lg text-teal-900">{APP_NAME}</span>
          <span className="hidden sm:inline text-xs font-data text-slate-400 border-l border-slate-200 pl-3 ml-1">{APP_TAGLINE}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setAboutOpen(v => !v)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg px-3 py-2 hover:border-teal-600 hover:text-teal-700 transition">
            <Info className="w-3.5 h-3.5" /> How this works
          </button>

          <div className="relative">
            <button onClick={() => setAccessOpen(v => !v)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg px-3 py-2 hover:border-teal-600 hover:text-teal-700 transition">
              <ShieldCheck className="w-3.5 h-3.5" /> My access
            </button>
            {accessOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3.5 z-20 anim-rise">
                <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-2">{currentRole.label} permissions</p>
                <ul className="flex flex-col gap-1.5">
                  {accessItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      {item.on ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                      <span className={item.on ? "text-slate-700" : "text-slate-400"}>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border border-slate-200 rounded-lg pl-3 pr-1.5 py-1.5 max-w-full">
            <UserCircle2 className="w-4 h-4 text-teal-700" />
            <div className="leading-tight">
              <div className="text-xs font-semibold text-slate-700">{currentUser.name}</div>
              <div className="font-data text-[9.5px] text-slate-400">{session.email}</div>
            </div>
            <button onClick={onLogout} title="Sign out" className="ml-2 flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600 rounded-md px-2 py-1.5 hover:bg-rose-50 transition">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-teal-800 text-teal-50 px-3 sm:px-6 py-1.5 flex items-center gap-2 text-xs font-data">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Signed in as <strong>{currentUser.name}</strong> · {currentRole.label} · {currentRole.blurb}</span>
      </div>

      {aboutOpen && (
        <div className="bg-teal-50 border-b border-teal-100 px-6 py-5 anim-rise">
          <div className="grid sm:grid-cols-3 gap-5 max-w-4xl">
            <div>
              <p className="font-data text-[10px] uppercase tracking-wide text-teal-700 mb-1">01 — Scoped retrieval</p>
              <p className="text-xs text-slate-600 leading-relaxed">Every question is answered only against the currently selected patient's indexed documents — never across the whole practice.</p>
            </div>
            <div>
              <p className="font-data text-[10px] uppercase tracking-wide text-teal-700 mb-1">02 — Role-based access</p>
              <p className="text-xs text-slate-600 leading-relaxed">Clinical query access (physicians, nurses) and document management (administrators) are kept separate, so PHI access matches clinical need-to-know.</p>
            </div>
            <div>
              <p className="font-data text-[10px] uppercase tracking-wide text-teal-700 mb-1">03 — Everything logged</p>
              <p className="text-xs text-slate-600 leading-relaxed">Every query and every document ingested is timestamped with the acting user for compliance review. OCR text extraction is simulated in this prototype.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function TabNav({ tabs, activeTab, setActiveTab }) {
  return (
    <nav className="bg-white border-b border-slate-200 px-3 sm:px-6 flex gap-1 overflow-x-auto">
      {tabs.map(t => {
        const Icon = t.icon;
        const active = activeTab === t.key;
        return (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition ${active ? "border-teal-700 text-teal-800" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
            <Icon className="w-4 h-4" />
            {t.label}
            {!t.permitted && <Lock className="w-3 h-3 ml-0.5 text-slate-300" />}
          </button>
        );
      })}
    </nav>
  );
}

export const TAB_ICONS = {
  dashboard: LayoutDashboard,
  chat: MessageSquare,
  documents: FileText,
  team: UserCog,
  audit: ClipboardList
};
