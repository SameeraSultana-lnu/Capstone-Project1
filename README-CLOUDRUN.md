# Cloud Run deployment setup

This repository is configured to deploy the DocuMed frontend to Google Cloud Run.

## Required GitHub secrets

Add these repository secrets in GitHub:

- GCP_PROJECT_ID
- GCP_SA_KEY

## Required Google Cloud setup

1. Enable Cloud Run, Cloud Build, and Artifact Registry.
2. Create a service account for GitHub Actions.
3. Grant the service account roles:
   - Cloud Run Admin
   - Service Account User
   - Storage Admin
   - Viewer
4. Create and download a JSON key for that service account.
5. Add the full JSON contents to the GCP_SA_KEY secret.

## Deploy

Push to the main branch and GitHub Actions will deploy automatically.
