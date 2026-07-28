import {
  MessageSquare, Target, Users, FileText, Clock, TrendingUp
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell
} from "recharts";
import KpiCard from "../components/KpiCard";
import { CONFIDENCE_COLORS } from "../constants/statusMeta";

export default function DashboardTab({ patients, auditLog, scope }) {
  const queries = auditLog.filter(a => a.action === "Query");
  const totalQueries = queries.length;
  const groundedCount = queries.filter(q => q.confidence === "Grounded in record").length;
  const groundedRate = totalQueries ? Math.round((groundedCount / totalQueries) * 100) : 0;
  const activePatients = new Set(queries.map(q => q.patient)).size;
  const docsIndexedSession = auditLog.filter(a => a.action === "Document indexed").length;
  const totalDocsInCorpus = patients.reduce((sum, p) => sum + p.documents.length, 0);

  const byPatient = patients.map(p => ({
    name: p.name.split(" ")[0] + " " + p.name.split(" ")[1]?.[0] + ".",
    queries: queries.filter(q => q.patient === p.name).length
  }));

  const confidenceBuckets = ["Grounded in record", "Partial match — review source", "Not found in record"]
    .map(label => ({ name: label, value: queries.filter(q => q.confidence === label).length }))
    .filter(b => b.value > 0);

  const recent = [...auditLog].reverse().slice(0, 6);

  return (
    <div className="h-full overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
        <div>
          <h2 className="font-brand text-xl text-slate-800">Practice Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {scope === "all" ? "Practice-wide activity across all users, this session." : "Your activity this session. Administrators see the full practice view."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard icon={MessageSquare} label="Questions asked" value={totalQueries} sub="this session" tint="bg-teal-50 text-teal-700" />
        <KpiCard icon={Target} label="Grounded-answer rate" value={`${groundedRate}%`} sub={`${groundedCount} of ${totalQueries} cited a source`} tint="bg-emerald-50 text-emerald-700" />
        <KpiCard icon={Users} label="Patients queried" value={activePatients} sub={`of ${patients.length} in the practice`} tint="bg-amber-50 text-amber-700" />
        <KpiCard icon={FileText} label="Documents indexed" value={totalDocsInCorpus} sub={`${docsIndexedSession} added this session`} tint="bg-slate-100 text-slate-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-3">Questions per patient</p>
          {totalQueries === 0 ? (
            <p className="text-sm text-slate-400 py-10 text-center">No questions asked yet this session.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byPatient} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="queries" fill="#0f766e" radius={[5, 5, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-3">Answer confidence breakdown</p>
          {confidenceBuckets.length === 0 ? (
            <p className="text-sm text-slate-400 py-10 text-center">No answers to break down yet.</p>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={confidenceBuckets} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={2}>
                    {confidenceBuckets.map((b, i) => <Cell key={i} fill={CONFIDENCE_COLORS[b.name]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex flex-col gap-1.5 mt-1">
            {confidenceBuckets.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CONFIDENCE_COLORS[b.name] }} />
                {b.name} <span className="text-slate-400">({b.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-3">Recent activity</p>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-400 py-6">Nothing logged yet this session.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {recent.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">{a.user}</span>
                    <span className="text-slate-400"> · {a.role} · {a.ts}</span>
                    <div className="text-slate-600">{a.action}{a.patient && a.patient !== "—" ? ` — ${a.patient}` : ""}{a.detail ? `: ${a.detail}` : ""}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-teal-50 border border-teal-100 rounded-xl p-5">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
            <p className="font-data text-[10px] uppercase tracking-wide text-teal-700">Phase 1 success criteria</p>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <li>• ≥92% clinician-verified accuracy</li>
            <li>• 70%+ reduction in lookup time</li>
            <li>• 4.2 / 5 clinician trust score</li>
          </ul>
          <p className="text-[10.5px] text-slate-400 mt-2.5 leading-relaxed">Reference targets from the Phase 1 problem framing — session stats above are prototype demo data, not a clinical validation result.</p>
        </div>
      </div>
    </div>
  );
}
