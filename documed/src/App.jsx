import { useEffect, useState, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { INITIAL_PATIENTS } from "./data/patients";
import { INITIAL_STAFF } from "./data/staff";
import { ROLES, defaultTabForRole } from "./data/roles";
import { answerQuestion } from "./utils/retrievalEngine";
import { confidenceStyles } from "./utils/confidenceStyles";
import { getSafeErrorMessage, withErrorHandling } from "./utils/errorHandling";
import { createSafePersistencePayload } from "./utils/security";
import LoginScreen from "./components/LoginScreen";
import AppHeader, { TabNav, TAB_ICONS } from "./components/AppHeader";
import LockedPanel from "./components/LockedPanel";
import DashboardTab from "./tabs/DashboardTab";
import ChatTab from "./tabs/ChatTab";
import DocumentsTab from "./tabs/DocumentsTab";
import TeamTab from "./tabs/TeamTab";
import AuditTab from "./tabs/AuditTab";

const STORAGE_KEY = "documed-app-state-v1";

function readStoredState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const storedState = readStoredState();
  const [session, setSession] = useState(storedState?.session ?? null);
  const [staff, setStaff] = useState(storedState?.staff ?? INITIAL_STAFF);
  const [patients, setPatients] = useState(storedState?.patients ?? INITIAL_PATIENTS);
  const [currentPatientId, setCurrentPatientId] = useState(storedState?.currentPatientId ?? null);
  const [conversations, setConversations] = useState(storedState?.conversations ?? {});
  const [auditLog, setAuditLog] = useState(storedState?.auditLog ?? []);
  const [activeTab, setActiveTab] = useState(storedState?.activeTab ?? "chat");
  const [ingestionQueue, setIngestionQueue] = useState(storedState?.ingestionQueue ?? []);
  const [ingestedSamples, setIngestedSamples] = useState(storedState?.ingestedSamples ?? []);
  const [uploadPatientId, setUploadPatientId] = useState(storedState?.uploadPatientId ?? INITIAL_PATIENTS[0].id);
  const [askValue, setAskValue] = useState(storedState?.askValue ?? "");
  const [aboutOpen, setAboutOpen] = useState(storedState?.aboutOpen ?? false);
  const [accessOpen, setAccessOpen] = useState(storedState?.accessOpen ?? false);
  const [appError, setAppError] = useState("");
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = createSafePersistencePayload({
      session,
      staff,
      patients,
      currentPatientId,
      conversations,
      auditLog,
      activeTab,
      ingestionQueue,
      ingestedSamples,
      uploadPatientId,
      askValue,
      aboutOpen,
      accessOpen
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [session, staff, patients, currentPatientId, conversations, auditLog, activeTab, ingestionQueue, ingestedSamples, uploadPatientId, askValue, aboutOpen, accessOpen]);

  const currentUser = session ? staff.find(s => s.email === session.email) : null;
  const currentRole = currentUser ? ROLES[currentUser.role] : null;
  const currentPatient = patients.find(p => p.id === currentPatientId) || null;

  function logAudit(entry, actorOverride) {
    const actor = actorOverride || { name: currentUser.name, label: currentRole.label };
    setAuditLog(prev => [...prev, { ts: new Date().toLocaleString([], { dateStyle: "short", timeStyle: "medium" }), user: actor.name, role: actor.label, ...entry }]);
  }

  function handleLoginSuccess(staffRecord) {
    try {
      setAppError("");
      if (!staffRecord?.email) {
        throw new Error("The selected account could not be loaded.");
      }
      setSession({ email: staffRecord.email });
      setActiveTab(defaultTabForRole(staffRecord.role));
      logAudit({ patient: "—", action: "Signed in", detail: staffRecord.email, confidence: "—" }, { name: staffRecord.name, label: ROLES[staffRecord.role].label });
    } catch (error) {
      setAppError(getSafeErrorMessage(error, "We could not sign you in right now. Please try again."));
    }
  }

  function handleLogout() {
    try {
      logAudit({ patient: "—", action: "Signed out", detail: session?.email || "unknown user", confidence: "—" });
      setSession(null);
      setCurrentPatientId(null);
      setAskValue("");
      setAccessOpen(false);
      setAppError("");
    } catch (error) {
      setAppError(getSafeErrorMessage(error, "We could not sign you out right now."));
    }
  }

  function handleRoleChange(staffId, newRole) {
    try {
      const member = staff.find(s => s.id === staffId);
      if (!member || member.role === newRole) return;
      const fromLabel = ROLES[member.role]?.label || "Unknown";
      const toLabel = ROLES[newRole]?.label || "Unknown";
      setStaff(prev => prev.map(s => (s.id === staffId ? { ...s, role: newRole } : s)));
      logAudit({ patient: "—", action: "Role changed", detail: `${member.name}: ${fromLabel} → ${toLabel}`, confidence: "—" });
    } catch (error) {
      setAppError(getSafeErrorMessage(error, "We could not change that role. Please try again."));
    }
  }

  function handleAsk(e, overrideQuery) {
    if (e && e.preventDefault) e.preventDefault();
    const query = (overrideQuery !== undefined ? overrideQuery : askValue).trim();
    if (!query) {
      setAppError("Please enter a question before submitting.");
      return;
    }
    if (!currentPatient) {
      setAppError("Please select a patient before asking a question.");
      return;
    }

    setAppError("");
    setIsSubmittingQuery(true);

    try {
      const result = withErrorHandling(() => answerQuestion(currentPatient, query), "We could not answer that question right now.");
      if (!result) {
        throw new Error("No answer could be generated for that question.");
      }
      setConversations(prev => ({
        ...prev,
        [currentPatient.id]: [...(prev[currentPatient.id] || []), { q: query, a: result.text, confidence: result.confidence, citations: result.citations, ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]
      }));
      logAudit({ patient: currentPatient.name, action: "Query", detail: query, confidence: confidenceStyles(result.confidence).label });
    } catch (error) {
      console.error(error);
      setAppError(getSafeErrorMessage(error, "We could not answer that question right now. Please try again."));
    } finally {
      setIsSubmittingQuery(false);
      setAskValue("");
    }
  }

  function updateQueueStatus(id, status) {
    setIngestionQueue(prev => prev.map(q => (q.id === id ? { ...q, status } : q)));
  }

  function runPipeline(item, sample) {
    const fail = message => {
      setIngestionQueue(prev => prev.map(q => (q.id === item.id ? { ...q, status: "error", error: message } : q)));
      setAppError(`We could not ingest "${item.filename}". ${message}`);
    };

    updateQueueStatus(item.id, "uploading");
    setTimeout(() => {
      try {
        updateQueueStatus(item.id, "ocr");
        setTimeout(() => {
          try {
            updateQueueStatus(item.id, "indexed");
            const doc = sample
              ? { id: `doc-${item.id}`, title: sample.title, type: sample.docType, date: sample.date, content: sample.content }
              : { id: `doc-${item.id}`, title: item.filename.replace(/\.[^.]+$/, ""), type: "Uploaded Scan", date: new Date().toLocaleDateString(),
                  content: "Document received through the ingestion pipeline. In this prototype, OCR text extraction is simulated for user-provided files — production DocuMed runs full OCR here and indexes the extracted text for retrieval, exactly as with the sample scanned records." };

            setPatients(prev => {
              const nextPatients = prev.map(p => (p.id === item.patientId ? { ...p, documents: [...p.documents, doc] } : p));
              const patientName = nextPatients.find(p => p.id === item.patientId)?.name || "—";
              logAudit({ patient: patientName, action: "Document indexed", detail: item.filename, confidence: "—" });
              return nextPatients;
            });
          } catch (error) {
            console.error(error);
            fail(getSafeErrorMessage(error, "Please try again."));
          }
        }, 900);
      } catch (error) {
        console.error(error);
        fail(getSafeErrorMessage(error, "Please try again."));
      }
    }, 650);
  }

  function handleFileUpload(fileList) {
    try {
      if (!fileList || fileList.length === 0) {
        throw new Error("Please choose at least one file to upload.");
      }
      const items = Array.from(fileList).map(f => ({
        id: Math.random().toString(36).slice(2), filename: f.name, patientId: uploadPatientId,
        status: "uploading", sizeKb: Math.max(1, Math.round(f.size / 1024)), ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }));
      setIngestionQueue(prev => [...prev, ...items]);
      items.forEach(item => runPipeline(item, null));
    } catch (error) {
      setAppError(getSafeErrorMessage(error, "We could not start the upload. Please try again."));
    }
  }

  function handleSampleIngest(sample) {
    try {
      if (!sample) {
        throw new Error("The selected sample could not be loaded.");
      }
      if (ingestedSamples.includes(sample.id)) return;
      const item = { id: `${sample.id}-${Date.now()}`, filename: sample.filename, patientId: sample.patientId, status: "uploading", sizeKb: 118, ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setIngestionQueue(prev => [...prev, item]);
      setIngestedSamples(prev => [...prev, sample.id]);
      runPipeline(item, sample);
    } catch (error) {
      setAppError(getSafeErrorMessage(error, "We could not ingest that sample. Please try again."));
    }
  }

  if (!session) {
    return <LoginScreen staff={staff} onLogin={handleLoginSuccess} />;
  }

  const visibleAuditLog = currentRole.permissions.auditScope === "all" ? auditLog : auditLog.filter(a => a.user === currentUser.name);

  const TABS = [
    { key: "dashboard", label: "Dashboard", icon: TAB_ICONS.dashboard, permitted: true },
    { key: "chat", label: "Ask", icon: TAB_ICONS.chat, permitted: currentRole.permissions.chat },
    { key: "documents", label: "Documents", icon: TAB_ICONS.documents, permitted: currentRole.permissions.documents },
    { key: "team", label: "Team", icon: TAB_ICONS.team, permitted: currentRole.permissions.manageTeam },
    { key: "audit", label: "Audit Log", icon: TAB_ICONS.audit, permitted: true }
  ];

  const ACCESS_ITEMS = [
    { label: "Ask clinical questions", on: currentRole.permissions.chat },
    { label: "Manage document ingestion", on: currentRole.permissions.documents },
    { label: "Manage staff roles", on: currentRole.permissions.manageTeam },
    { label: currentRole.permissions.auditScope === "all" ? "View practice-wide audit log" : "View your own audit log only", on: true }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col">
      {appError && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 text-sm text-rose-700">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{appError}</span>
          </div>
          <button onClick={() => setAppError("")} className="text-rose-700 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <AppHeader
        currentUser={currentUser}
        currentRole={currentRole}
        session={session}
        aboutOpen={aboutOpen}
        setAboutOpen={setAboutOpen}
        accessOpen={accessOpen}
        setAccessOpen={setAccessOpen}
        accessItems={ACCESS_ITEMS}
        onLogout={handleLogout}
      />

      <TabNav tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 min-h-0">
        {activeTab === "dashboard" && (
          <DashboardTab patients={patients} auditLog={visibleAuditLog} scope={currentRole.permissions.auditScope} />
        )}

        {activeTab === "chat" && (
          currentRole.permissions.chat
            ? <ChatTab patients={patients} currentPatient={currentPatient} setCurrentPatientId={setCurrentPatientId}
                conversations={conversations} askValue={askValue} setAskValue={setAskValue} handleAsk={handleAsk} isSubmittingQuery={isSubmittingQuery} />
            : <LockedPanel title="Clinical query access restricted" reason="Practice Administrators manage ingestion and compliance oversight. Clinical query access is limited to physicians and nurse practitioners to keep PHI access aligned with clinical need-to-know." />
        )}

        {activeTab === "documents" && (
          currentRole.permissions.documents
            ? <DocumentsTab patients={patients} uploadPatientId={uploadPatientId} setUploadPatientId={setUploadPatientId}
                ingestionQueue={ingestionQueue} ingestedSamples={ingestedSamples} onSampleIngest={handleSampleIngest}
                onFileUpload={handleFileUpload} fileInputRef={fileInputRef} />
            : <LockedPanel title="Document management restricted" reason="Ingestion and record management are restricted to Practice Administrators, keeping a single accountable owner for what enters the clinical record." />
        )}

        {activeTab === "team" && (
          currentRole.permissions.manageTeam
            ? <TeamTab staff={staff} currentUserId={currentUser.id} onRoleChange={handleRoleChange} />
            : <LockedPanel title="Staff management restricted" reason="Assigning and changing staff roles is restricted to Practice Administrators, keeping a single accountable owner for who can access what." />
        )}

        {activeTab === "audit" && <AuditTab log={visibleAuditLog} scope={currentRole.permissions.auditScope} />}
      </main>
    </div>
  );
}
