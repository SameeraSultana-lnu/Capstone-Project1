import {
  User, MessageSquare, AlertTriangle, Send, CheckCircle2, ScanLine
} from "lucide-react";
import { confidenceStyles } from "../utils/confidenceStyles";

export default function ChatTab({ patients, currentPatient, setCurrentPatientId, conversations, askValue, setAskValue, handleAsk, isSubmittingQuery }) {
  const thread = currentPatient ? (conversations[currentPatient.id] || []) : [];

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] overflow-hidden">
      <aside className="border-r border-slate-200 bg-white p-4 overflow-y-auto">
        <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-2 px-1">Patient context</p>
        <div className="flex flex-col gap-1.5 mb-5">
          {patients.map(p => {
            const active = currentPatient && currentPatient.id === p.id;
            return (
              <button key={p.id} onClick={() => setCurrentPatientId(p.id)}
                className={`text-left rounded-lg border px-3 py-2.5 transition ${active ? "border-teal-600 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                <div className={`text-sm font-semibold ${active ? "text-teal-800" : "text-slate-700"}`}>{p.name}</div>
                <div className="font-data text-[10px] text-slate-400">MRN {p.mrn} · {p.documents.length} docs</div>
              </button>
            );
          })}
        </div>

        {currentPatient && (
          <>
            <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-2 px-1">Suggested questions</p>
            <div className="flex flex-col gap-1.5">
              {currentPatient.suggested.map((q, i) => (
                <button key={i} onClick={() => handleAsk(null, q)} className="text-left text-xs text-teal-800 bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 rounded-lg px-2.5 py-2 transition">
                  {q}
                </button>
              ))}
            </div>
          </>
        )}
      </aside>

      <section className="flex flex-col min-h-0 bg-slate-50">
        {!currentPatient ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
              <User className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="font-brand text-lg text-slate-800 mb-2">Select a patient to begin</h3>
            <p className="text-sm text-slate-500 max-w-sm">Questions are scoped to one patient's records at a time — pick someone from the left to start asking.</p>
          </div>
        ) : (
          <>
            <div className="bg-teal-700 text-teal-50 px-5 py-2.5 text-xs font-data flex items-center justify-between flex-wrap gap-1">
              <span>Scoped to <strong>{currentPatient.name}</strong> · MRN {currentPatient.mrn} — search covers only her indexed records</span>
              {currentPatient.allergies.length > 0 && (
                <span className="bg-rose-500/90 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Allergy on file
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {thread.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-full text-slate-400 px-8">
                  <MessageSquare className="w-8 h-8 mb-3 text-slate-300" />
                  <p className="text-sm">Ask a question about {currentPatient.name}, or pick a suggestion on the left.</p>
                </div>
              ) : (
                thread.map((item, idx) => {
                  const conf = confidenceStyles(item.confidence);
                  return (
                    <div key={idx} className="mb-5 anim-rise">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="font-data text-[10px] bg-slate-600 text-white rounded px-1.5 py-0.5 mt-0.5">Q{idx + 1}</span>
                        <span className="text-sm font-semibold text-slate-800">{item.q}</span>
                      </div>
                      <div className="bg-white border border-slate-200 border-l-[3px] border-l-teal-600 rounded-r-lg rounded-l-sm px-4 py-3">
                        <span className={`inline-flex items-center gap-1 font-data text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border mb-2 ${conf.cls}`}>
                          {item.confidence === "grounded" && <CheckCircle2 className="w-3 h-3" />}
                          {item.confidence === "partial" && <AlertTriangle className="w-3 h-3" />}
                          {conf.label}
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed">{item.a}</p>
                        <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200 font-data text-[10px] text-slate-400">
                          {item.citations.length} source{item.citations.length === 1 ? "" : "s"} cited · {item.ts}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-3 py-1 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
                <input value={askValue} onChange={e => setAskValue(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleAsk(e); }} placeholder={`Ask about ${currentPatient.name}...`}
                  className="flex-1 py-2.5 text-sm outline-none bg-transparent" disabled={isSubmittingQuery} />
                <button type="button" onClick={handleAsk} disabled={isSubmittingQuery} className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-3.5 py-2 flex items-center gap-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-70">
                  <Send className="w-3.5 h-3.5" /> {isSubmittingQuery ? "Working..." : "Ask"}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 px-1">Answers are drawn only from this patient's indexed records — nothing is inferred beyond what's documented.</p>
            </div>
          </>
        )}
      </section>

      <aside className="border-l border-slate-200 bg-white p-4 overflow-y-auto">
        <div className="flex items-center gap-1.5 mb-3">
          <ScanLine className="w-3.5 h-3.5 text-amber-600" />
          <p className="font-data text-[10px] uppercase tracking-wide text-slate-400">Evidence rail</p>
        </div>
        {thread.length === 0 ? (
          <p className="text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg p-3 leading-relaxed">Sources will appear here as questions are asked — every claim traces back to a specific passage.</p>
        ) : (
          [...thread].reverse().map((item, gi) => (
            <div key={gi} className="mb-4">
              <p className="font-data text-[10px] text-slate-400 mb-1.5 line-clamp-2">"{item.q}"</p>
              {item.citations.length === 0 ? (
                <p className="text-xs text-slate-400">No matching passage found.</p>
              ) : item.citations.map((c, ci) => (
                <div key={ci} className="anim-slide bg-white border border-slate-200 border-t-2 border-t-amber-500 rounded-b-lg rounded-t-sm px-2.5 py-2 mb-2">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-bold text-teal-800">{c.docTitle}</span>
                    <span className="font-data text-[9px] bg-amber-500 text-white rounded px-1.5 py-0.5 whitespace-nowrap">{c.docType}</span>
                  </div>
                  <div className="font-data text-[9.5px] text-slate-400 mb-1.5">{c.docDate}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed border-l-2 border-amber-100 pl-2">{c.text}</p>
                </div>
              ))}
            </div>
          ))
        )}
      </aside>
    </div>
  );
}
