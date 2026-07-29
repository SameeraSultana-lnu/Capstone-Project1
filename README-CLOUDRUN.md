# Cloud Run deployment setup

This repository is configured to deploy the DocuMed frontend to Google Cloud Run.

## Required GitHub secrets

Add these repository secrets in GitHub:

- GCP_PROJECT_ID
- GCP_SERVICE_ACCOUNT_EMAIL
- GCP_WORKLOAD_IDENTITY_PROVIDER

## Required Google Cloud setup

1. Enable Cloud Run, Cloud Build, and Artifact Registry.
2. Create a service account for GitHub Actions.
3. Configure Workload Identity Federation for GitHub.
4. Grant the service account roles:
   - Cloud Run Admin
   - Service Account User
   - Storage Admin
   - Viewer
5. Bind the GitHub repository to the Workload Identity Provider.
6. Grant the same service account `roles/artifactregistry.writer` so it can push the container image.

## Deploy

Push to the main branch and GitHub Actions will deploy automatically.
