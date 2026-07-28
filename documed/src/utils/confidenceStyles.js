export function confidenceStyles(c) {
  if (c === "grounded") return { label: "Grounded in record", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (c === "partial") return { label: "Partial match — review source", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Not found in record", cls: "bg-rose-50 text-rose-700 border-rose-200" };
}
