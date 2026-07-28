import { AlertTriangle } from "lucide-react";
import { ROLES } from "../data/roles";

export default function TeamTab({ staff, currentUserId, onRoleChange }) {
  return (
    <div className="h-full overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      <div className="mb-5">
        <h2 className="font-brand text-xl text-slate-800">Team & Roles</h2>
        <p className="text-xs text-slate-500 mt-0.5">Reassign a staff member's role to change what they can access — takes effect immediately, even mid-session.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left font-data text-[10px] uppercase tracking-wide text-slate-400 bg-slate-50 border-b border-slate-200">
              <th className="py-2.5 px-4">Name</th><th className="py-2.5 px-4">Email</th><th className="py-2.5 px-4">Role</th><th className="py-2.5 px-4">Access summary</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => {
              const roleData = ROLES[s.role];
              const isYou = s.id === currentUserId;
              return (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {s.name} {isYou && <span className="ml-1.5 font-data text-[9.5px] bg-teal-50 text-teal-700 rounded-full px-2 py-0.5">You</span>}
                  </td>
                  <td className="py-3 px-4 font-data text-xs text-slate-400 whitespace-nowrap">{s.email}</td>
                  <td className="py-3 px-4">
                    <select value={s.role} onChange={e => onRoleChange(s.id, e.target.value)}
                      className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-slate-50">
                      {Object.values(ROLES).map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">{roleData.blurb}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">Every role change is written to the audit log with who changed it and the before/after role, so access changes stay reviewable for compliance.</p>
      </div>
    </div>
  );
}
