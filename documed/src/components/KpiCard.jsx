export default function KpiCard({ icon: Icon, label, value, sub, tint }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="min-w-0">
        <div className="font-brand text-2xl text-slate-800 leading-tight">{value}</div>
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        {sub && <div className="text-[10.5px] text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
