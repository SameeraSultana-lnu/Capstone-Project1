import { ClipboardList } from "lucide-react";

export default function AuditTab({ log, scope }) {
  return (
    <div className="h-full overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-4 h-4 text-slate-400" />
        <p className="text-sm text-slate-500">
          {scope === "all" ? "Showing the full practice audit trail — every user, every patient." : "Showing your query history only. Practice Administrators can view the full log."}
        </p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        {log.length === 0 ? (
          <p className="text-sm text-slate-400 p-6">No activity recorded yet this session.</p>
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left font-data text-[10px] uppercase tracking-wide text-slate-400 bg-slate-50 border-b border-slate-200">
                <th className="py-2.5 px-4">Time</th><th className="py-2.5 px-4">User</th><th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Patient</th><th className="py-2.5 px-4">Action</th><th className="py-2.5 px-4">Detail</th><th className="py-2.5 px-4">Result</th>
              </tr>
            </thead>
            <tbody>
              {[...log].reverse().map((a, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 px-4 font-data text-xs text-slate-400 whitespace-nowrap">{a.ts}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 whitespace-nowrap">{a.user}</td>
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{a.role}</td>
                  <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">{a.patient}</td>
                  <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">{a.action}</td>
                  <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate">{a.detail}</td>
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{a.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
