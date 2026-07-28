const STOPWORDS = new Set(["a","an","the","is","are","was","were","has","have","had","does","did","do","this","that","of","for","to","in","on","and","or","what","which","who","her","his","she","he","it","with","any","about","currently"]);

function tokenize(str) {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/)
    .filter(w => w.length > 1 && !STOPWORDS.has(w)).map(w => w.replace(/s$/, ""));
}

function chunksForPatient(patient) {
  const chunks = [];
  patient.documents.forEach(doc => {
    const sentences = doc.content.match(/[^.!?]+[.!?]+/g) || [doc.content];
    sentences.forEach(s => chunks.push({ docId: doc.id, docTitle: doc.title, docType: doc.type, docDate: doc.date, text: s.trim() }));
  });
  return chunks;
}

function scoreChunk(text, queryTokens) {
  const chunkTokens = new Set(tokenize(text));
  let score = 0;
  queryTokens.forEach(t => { if (chunkTokens.has(t)) score++; });
  return score;
}

const DRUG_KEYWORDS = {
  penicillin: ["penicillin"], sulfa: ["sulfa", "sulfonamide", "sulfonamides", "sulfamethoxazole"],
  nsaid: ["nsaid", "nsaids", "ibuprofen"], latex: ["latex"], aspirin: ["aspirin"]
};

function detectIntent(query) {
  const q = query.toLowerCase();
  if (/allerg|reaction|penicillin|sulfa|latex|nsaid|aspirin/.test(q)) return "allergy";
  if (/insurance|cover|coverage|copay|deductible|referral|physical therapy|\bpt\b|plan\b|authorization/.test(q)) return "insurance";
  if (/medication|taking|prescri|drug list|dosage|dose/.test(q)) return "medication";
  return "general";
}

function findDrugMention(query) {
  const q = query.toLowerCase();
  for (const [key, terms] of Object.entries(DRUG_KEYWORDS)) if (terms.some(t => q.includes(t))) return key;
  return null;
}

function answerAllergy(patient, query) {
  const allergyDoc = patient.documents.find(d => d.type === "Allergy Record");
  const drug = findDrugMention(query);
  if (drug) {
    const match = patient.allergies.find(a => a.allergen === drug);
    if (match) {
      return {
        text: `Yes — the record shows a documented reaction to ${match.display.toLowerCase()}: ${match.reaction.toLowerCase()}, documented ${match.documented}.`,
        confidence: "grounded",
        citations: [{ docTitle: allergyDoc.title, docType: allergyDoc.type, docDate: allergyDoc.date, text: allergyDoc.content }]
      };
    }
    return {
      text: `No — the allergy record was checked and shows no documented reaction to ${drug === "nsaid" ? "NSAIDs" : drug}. This was explicitly reviewed, not assumed.`,
      confidence: "grounded",
      citations: [{ docTitle: allergyDoc.title, docType: allergyDoc.type, docDate: allergyDoc.date, text: allergyDoc.content }]
    };
  }
  if (patient.allergies.length === 0) {
    return { text: `The patient has no known drug allergies (NKDA) documented in the record.`, confidence: "grounded",
      citations: [{ docTitle: allergyDoc.title, docType: allergyDoc.type, docDate: allergyDoc.date, text: allergyDoc.content }] };
  }
  const list = patient.allergies.map(a => `${a.display} (${a.reaction.toLowerCase()})`).join(", ");
  return { text: `The record documents the following allergy: ${list}.`, confidence: "grounded",
    citations: [{ docTitle: allergyDoc.title, docType: allergyDoc.type, docDate: allergyDoc.date, text: allergyDoc.content }] };
}

function answerInsurance(patient, query) {
  const doc = patient.documents.find(d => d.type === "Insurance Portal Export");
  if (!doc) return answerGeneral(patient, query);
  const qTokens = tokenize(query);
  const sentences = doc.content.match(/[^.!?]+[.!?]+/g) || [doc.content];
  const scored = sentences.map(s => ({ text: s.trim(), score: scoreChunk(s, qTokens) })).sort((a, b) => b.score - a.score);
  const top = scored.filter(s => s.score > 0).slice(0, 2);
  const chosen = top.length ? top : [{ text: sentences[0] }];
  return {
    text: `According to the insurance record on file: ${chosen.map(c => c.text.replace(/\.$/, "")).join("; ")}.`,
    confidence: top.length ? "grounded" : "partial",
    citations: [{ docTitle: doc.title, docType: doc.type, docDate: doc.date, text: doc.content }]
  };
}

function answerMedication(patient, query) {
  const doc = patient.documents.find(d => d.type === "EHR Medication Record");
  if (!doc) return answerGeneral(patient, query);
  return {
    text: `Current active medications on file: ${doc.content.replace(" No other active prescriptions on file.", "")}`,
    confidence: "grounded",
    citations: [{ docTitle: doc.title, docType: doc.type, docDate: doc.date, text: doc.content }]
  };
}

function answerGeneral(patient, query) {
  const qTokens = tokenize(query);
  const chunks = chunksForPatient(patient);
  const scored = chunks.map(c => ({ ...c, score: scoreChunk(c.text, qTokens) })).sort((a, b) => b.score - a.score);
  const top = scored.filter(c => c.score > 0).slice(0, 3);
  if (top.length === 0) {
    return { text: `Nothing in this patient's indexed records matches that question. Rather than guess, DocuMed is flagging this as not found — it may need a source that hasn't been ingested yet.`, confidence: "none", citations: [] };
  }
  const citations = []; const seen = new Set();
  top.forEach(c => { if (!seen.has(c.docId)) { seen.add(c.docId); citations.push({ docTitle: c.docTitle, docType: c.docType, docDate: c.docDate, text: c.text }); } });
  return { text: `Based on the indexed record: ${top.map(c => c.text.replace(/\.$/, "")).join("; ")}.`, confidence: top[0].score >= 2 ? "grounded" : "partial", citations };
}

export function answerQuestion(patient, query) {
  const intent = detectIntent(query);
  if (intent === "allergy") return answerAllergy(patient, query);
  if (intent === "insurance") return answerInsurance(patient, query);
  if (intent === "medication") return answerMedication(patient, query);
  return answerGeneral(patient, query);
}
