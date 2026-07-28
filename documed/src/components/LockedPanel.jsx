import { Lock } from "lucide-react";

export default function LockedPanel({ title, reason }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-20 anim-rise">
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
        <Lock className="w-5 h-5 text-slate-500" />
      </div>
      <h3 className="font-brand text-lg text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm leading-relaxed">{reason}</p>
    </div>
  );
}
