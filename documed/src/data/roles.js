export const ROLES = {
  physician: {
    key: "physician", label: "Physician",
    blurb: "Full clinical query access",
    permissions: { chat: true, documents: false, manageTeam: false, auditScope: "own" }
  },
  nurse: {
    key: "nurse", label: "Nurse Practitioner",
    blurb: "Clinical query access for intake & triage",
    permissions: { chat: true, documents: false, manageTeam: false, auditScope: "own" }
  },
  admin: {
    key: "admin", label: "Practice Administrator",
    blurb: "Document management & compliance oversight",
    permissions: { chat: false, documents: true, manageTeam: true, auditScope: "all" }
  }
};

export function defaultTabForRole(roleKey) {
  const p = ROLES[roleKey].permissions;
  if (p.chat) return "chat";
  if (p.documents) return "documents";
  return "audit";
}
