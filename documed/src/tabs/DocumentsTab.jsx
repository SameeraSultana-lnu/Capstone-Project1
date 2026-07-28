import { useState } from "react";
import { Upload, FileText, CheckCircle2, FilePlus2, AlertTriangle } from "lucide-react";
import { SAMPLE_SCANS } from "../data/sampleScans";
import { STATUS_META } from "../constants/statusMeta";

export default function DocumentsTab({ patients, uploadPatientId, setUploadPatientId, ingestionQueue, ingestedSamples, onSampleIngest, onFileUpload, fileInputRef }) {
  const [uploadFeedback, setUploadFeedback] = useState("");

  function validateFiles(fileList) {
    if (!fileList || fileList.length === 0) return "Please choose at least one file to upload.";

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    const maxBytes = 10 * 1024 * 1024;

    for (const file of fileList) {
      if (!allowedTypes.includes(file.type) && !/\.(pdf|png|jpe?g)$/i.test(file.name)) {
        return "Only PDF, PNG, JPG, and JPEG files are supported.";
      }
      if (file.size > maxBytes) {
        return "Each file must be 10 MB or smaller.";
      }
    }

    return "";
  }

  function handleFileSelection(e) {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadFeedback("Please choose at least one file to upload.");
      return;
    }

    const validationMessage = validateFiles(files);
    if (validationMessage) {
      setUploadFeedback(validationMessage);
      e.target.value = "";
      return;
    }

    setUploadFeedback("");
    onFileUpload(files);
    e.target.value = "";
  }

  return (
    <div className="h-full overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-3">Batch or per-patient upload</p>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assign uploads to patient</label>
          <select value={uploadPatientId} onChange={e => setUploadPatientId(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 bg-slate-50">
            {patients.map(p => <option key={p.id} value={p.id}>{p.name} — MRN {p.mrn}</option>)}
          </select>

          <div onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl py-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/40 transition">
            <Upload className="w-6 h-6 text-teal-700 mb-2" />
            <p className="text-sm font-semibold text-slate-700">Click to upload PDFs or scanned notes</p>
            <p className="text-xs text-slate-400 mt-1">Batch upload supported · OCR runs automatically</p>
          </div>
          {uploadFeedback && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{uploadFeedback}</span>
            </div>
          )}
          <input ref={fileInputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg" className="hidden"
            onChange={handleFileSelection} />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-3">Simulate an incoming fax / scan</p>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">Demo records with real content, so you can watch a scan go from ingestion straight into a clinician's answer.</p>
          <div className="flex flex-col gap-2">
            {SAMPLE_SCANS.map(s => {
              const patient = patients.find(p => p.id === s.patientId);
              const done = ingestedSamples.includes(s.id);
              return (
                <div key={s.id} className="flex items-center justify-between gap-3 border border-slate-200 rounded-lg px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-700 truncate">{s.title}</div>
                    <div className="font-data text-[10px] text-slate-400 truncate">{s.filename} → {patient ? patient.name : "—"}</div>
                  </div>
                  <button disabled={done} onClick={() => onSampleIngest(s)}
                    className={`shrink-0 text-xs font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1 ${done ? "bg-emerald-50 text-emerald-600" : "bg-teal-700 text-white hover:bg-teal-800"}`}>
                    {done ? <><CheckCircle2 className="w-3.5 h-3.5" /> Indexed</> : <><FilePlus2 className="w-3.5 h-3.5" /> Ingest</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-8 overflow-x-auto">
        <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-3">Ingestion queue</p>
        {ingestionQueue.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">No documents ingested yet this session.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-data text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-200">
                <th className="py-2 pr-3">File</th><th className="py-2 pr-3">Patient</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {[...ingestionQueue].reverse().map(item => {
                const meta = STATUS_META[item.status];
                const Icon = meta.icon;
                const patient = patients.find(p => p.id === item.patientId);
                return (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-2.5 pr-3 font-medium text-slate-700">{item.filename}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{patient ? patient.name : "—"}</td>
                    <td className={`py-2.5 pr-3 font-semibold flex items-center gap-1.5 ${meta.cls}`}>
                      <Icon className={`w-3.5 h-3.5 ${meta.spin ? "animate-spin" : ""}`} /> {meta.label}
                    </td>
                    <td className="py-2.5 pr-3 font-data text-xs text-slate-400">{item.ts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-3">Indexed document inventory</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {patients.map(p => (
            <div key={p.id}>
              <p className="text-sm font-semibold text-slate-700 mb-1.5">{p.name}</p>
              <ul className="space-y-1">
                {p.documents.map(d => (
                  <li key={d.id} className="flex items-start gap-1.5 text-xs text-slate-500">
                    <FileText className="w-3 h-3 mt-0.5 text-teal-600 shrink-0" />
                    <span>{d.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
