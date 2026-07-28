export const INITIAL_PATIENTS = [
  {
    id: "ew",
    name: "Eleanor Whitfield",
    dob: "1958-03-14",
    mrn: "DM-10234",
    sex: "F",
    snapshot: "Hypertension and left-knee osteoarthritis. Established patient since 2016.",
    allergies: [
      { allergen: "penicillin", display: "Penicillin", reaction: "Diffuse rash, moderate severity", documented: "2019-06-11" }
    ],
    documents: [
      { id: "doc-ew-1", title: "Visit Note — Follow-up", type: "EHR Note", date: "2024-11-02",
        content: "Patient presents for routine hypertension follow-up. Blood pressure well controlled on lisinopril 10mg daily. Patient reports mild left knee pain, worsening with stairs, consistent with prior osteoarthritis diagnosis. No new medication changes today. Patient was reminded of her documented penicillin allergy noted in chart from 2019 and instructed to inform any covering provider before receiving antibiotics." },
      { id: "doc-ew-2", title: "Allergy & Adverse Reaction List", type: "Allergy Record", date: "Documented 2019-06-11, reviewed 2024-11-02",
        content: "Penicillin: reaction is diffuse rash, moderate severity, onset within 24 hours of administration. Documented 2019-06-11 by Dr. Chen. No known drug allergies to sulfonamides, NSAIDs, or latex. List reviewed and confirmed accurate at most recent visit." },
      { id: "doc-ew-3", title: "Insurance Coverage Summary", type: "Insurance Portal Export", date: "2024-01-08",
        content: "Plan: Aetna Choice PPO. Physical therapy is covered up to 20 visits per calendar year, with a 40 dollar copay per visit after the annual deductible of 500 dollars is met. Prior authorization is required after visit 12. Specialist referral is not required for in-network physical therapy providers." },
      { id: "doc-ew-4", title: "Radiology Report — Left Knee X-ray", type: "Historical Scan (PDF)", date: "2022-09-19",
        content: "Left knee, three views. Findings show mild to moderate medial joint space narrowing consistent with early osteoarthritis. No acute fracture identified. Recommend conservative management including physical therapy prior to orthopedic referral." },
      { id: "doc-ew-5", title: "Active Medication List", type: "EHR Medication Record", date: "2024-11-02",
        content: "Lisinopril 10mg, once daily, for hypertension. Atorvastatin 20mg, once daily, for hyperlipidemia. No other active prescriptions on file." }
    ],
    suggested: [
      "Has this patient had a documented reaction to penicillin?",
      "What does her insurance cover for physical therapy?",
      "Is she allergic to sulfa drugs?"
    ]
  },
  {
    id: "mi",
    name: "Marcus Ibe",
    dob: "1982-07-29",
    mrn: "DM-10391",
    sex: "M",
    snapshot: "Type 2 diabetes, moderately controlled. Established patient since 2021.",
    allergies: [
      { allergen: "sulfa", display: "Sulfa drugs (sulfonamides)", reaction: "Hives, mild-to-moderate", documented: "2021-04-02" }
    ],
    documents: [
      { id: "doc-mi-1", title: "Visit Note — Diabetes Management", type: "EHR Note", date: "2024-10-15",
        content: "Patient returns for type 2 diabetes management. Reports good adherence to metformin. No episodes of hypoglycemia reported. Discussed dietary adjustments. Patient has a known sulfa drug allergy on file, presenting as hives; this was reconfirmed verbally today before discussing a possible future prescription." },
      { id: "doc-mi-2", title: "Allergy & Adverse Reaction List", type: "Allergy Record", date: "Documented 2021-04-02, reviewed 2024-10-15",
        content: "Sulfonamides (sulfa drugs): reaction is hives, mild-to-moderate severity, appeared approximately two hours after administration of trimethoprim-sulfamethoxazole. Documented 2021-04-02. No known allergy to penicillin, NSAIDs, or latex. List reviewed and confirmed accurate at most recent visit." },
      { id: "doc-mi-3", title: "Insurance Coverage Summary", type: "Insurance Portal Export", date: "2024-02-20",
        content: "Plan: Blue Cross Blue Shield HMO. Physical therapy is covered up to 10 visits per calendar year and requires a specialist referral prior to the first visit. Copay is 25 dollars per visit. Diabetes education and nutrition counseling are covered separately at no copay." },
      { id: "doc-mi-4", title: "Lab Report — Hemoglobin A1c", type: "Lab Result", date: "2024-10-15",
        content: "Hemoglobin A1c result: 7.8 percent, indicating moderately controlled type 2 diabetes. Prior result six months ago was 8.4 percent, showing improvement. Continue current metformin dosage and recheck in three months." },
      { id: "doc-mi-5", title: "Active Medication List", type: "EHR Medication Record", date: "2024-10-15",
        content: "Metformin 1000mg, twice daily, for type 2 diabetes. No other active prescriptions on file." }
    ],
    suggested: [
      "Is he allergic to sulfa drugs?",
      "What was his most recent A1c result?",
      "Does his insurance require a referral for physical therapy?"
    ]
  },
  {
    id: "pn",
    name: "Priya Nair",
    dob: "1996-11-02",
    mrn: "DM-10508",
    sex: "F",
    snapshot: "Prenatal care, first pregnancy, currently 24 weeks. Established patient since 2023.",
    allergies: [],
    documents: [
      { id: "doc-pn-1", title: "Visit Note — Prenatal Check-up", type: "EHR Note", date: "2024-11-20",
        content: "Patient presents for routine 24-week prenatal check-up. Fundal height and fetal heart rate within normal limits. No known drug allergies confirmed and reviewed with patient today. Continuing prenatal vitamins and folic acid. Discussed upcoming glucose tolerance screening." },
      { id: "doc-pn-2", title: "Allergy & Adverse Reaction List", type: "Allergy Record", date: "Reviewed 2024-11-20",
        content: "No known drug allergies (NKDA). No known allergies to penicillin, sulfonamides, NSAIDs, or latex. List reviewed and confirmed accurate at most recent visit with no changes reported by patient." },
      { id: "doc-pn-3", title: "Insurance Coverage Summary", type: "Insurance Portal Export", date: "2024-03-11",
        content: "Plan: United Healthcare PPO. Physical therapy is covered up to 30 visits per calendar year with no copay for the first 5 visits, then a 30 dollar copay per visit thereafter. Prenatal and maternity care is covered at 100 percent in-network." },
      { id: "doc-pn-4", title: "Ultrasound Report — 20-week Anatomy Scan", type: "Historical Scan (PDF)", date: "2024-09-04",
        content: "Anatomy ultrasound performed at 20 weeks gestation. Fetal growth appropriate for gestational age. No structural abnormalities identified. Placenta positioned normally, not previa. Follow-up growth scan recommended at 32 weeks." },
      { id: "doc-pn-5", title: "Active Medication List", type: "EHR Medication Record", date: "2024-11-20",
        content: "Prenatal vitamin, once daily. Folic acid 400mcg, once daily. No other active prescriptions on file." }
    ],
    suggested: [
      "Does she have any known drug allergies?",
      "What did the anatomy scan show?",
      "Is physical therapy covered under her insurance?"
    ]
  }
];
