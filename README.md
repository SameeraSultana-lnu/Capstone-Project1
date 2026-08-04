# DocuMed

DocuMed is a responsive clinical record retrieval prototype designed for a small healthcare practice. It demonstrates how a healthcare team could search patient records, review scoped evidence, ingest documents, and track audit activity in a secure, role-aware workflow.

## Overview

This project combines a modern React frontend with a lightweight demo data model to simulate the experience of:

- signing in as a clinician or administrator
- selecting a patient and asking clinical questions
- retrieving grounded answers from the patient’s indexed documents
- managing document ingestion for a patient record
- viewing audit activity and dashboard metrics

## Key Highlights

- Role-based access simulation for different staff personas
- Patient-scoped retrieval with evidence display
- Mobile-friendly layout for tablets and phones
- Document upload workflow with validation and status tracking
- Persistent app state using browser storage
- Dashboard and audit views for operational visibility

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- lucide-react
- recharts
- Optional FastAPI backend scaffold in the backend folder

## Project Structure

```text
documed/
├── backend/                # Python dependencies and backend scaffold
├── docs/                   # Project documentation and structure notes
├── public/                 # Static assets
├── src/                    # Application source code
│   ├── components/         # Reusable UI components
│   ├── constants/          # App metadata and status labels
│   ├── data/               # Demo patients, staff, roles, and sample data
│   ├── tabs/               # Feature-specific page views
│   └── utils/              # Retrieval logic and helper utilities
├── package.json            # Frontend dependencies and scripts
└── README.md               # Project overview and setup guide
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run the frontend locally

```bash
npm run dev
```

Then open the local URL shown by Vite, typically:

```text
http://localhost:5173
```

### Build for production

```bash
npm run build
```

## Backend Setup

The backend folder currently contains Python dependencies for future API integration.

```bash
pip install -r backend/requirements.txt
```

If you add a FastAPI entrypoint later, you can run it with a command such as:

```bash
uvicorn main:app --reload
```

## Documentation

Additional project notes are available in:

- [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

## Notes

The current prototype uses demo data and simulated retrieval logic rather than a live clinical backend. It is intended to showcase the interface and workflow design for an assignment or product concept.
