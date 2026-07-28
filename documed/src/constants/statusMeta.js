import { Loader2, CheckCircle2 } from "lucide-react";

export const STATUS_META = {
  uploading: { label: "Uploading", cls: "text-slate-500", icon: Loader2, spin: true },
  ocr: { label: "Running OCR", cls: "text-amber-600", icon: Loader2, spin: true },
  indexed: { label: "Indexed", cls: "text-emerald-600", icon: CheckCircle2, spin: false },
  error: { label: "Error", cls: "text-rose-600", icon: CheckCircle2, spin: false }
};

export const CONFIDENCE_COLORS = {
  "Grounded in record": "#0d9488",
  "Partial match — review source": "#d97706",
  "Not found in record": "#e11d48"
};
