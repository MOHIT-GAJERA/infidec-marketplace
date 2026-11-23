---
title: Auto-Deploy with GitHub Actions
description: How the included GitHub Actions workflow analyses, builds and deploys the Booqora Rental Platform on every push, with preview URLs for pull requests.
---

The package includes `.github/workflows/deploy.yml` at the repository root. Once your code is on GitHub, every push to `main` builds the **Rental Platform** and deploys it to Firebase Hosting. Every pull request gets its own temporary preview URL.

## What the workflow does

| Job | Runs on | Steps |
|---|---|---|
| `build` | Every push and pull request to `main`, and manual runs | Checkout → Flutter **3.41.4** (stable, cached) → `flutter pub get` → `flutter analyze --no-fatal-infos` → `flutter build web --release` → upload `build/web` as an artifact (kept 7 days) |
| `deploy-live` | Pushes to `main` and manual runs (not pull requests) | Download the artifact → validate the service-account secret → `firebase deploy --only hosting:platform` → best-effort `firebase deploy --only firestore:rules,storage` |
| `deploy-preview` | Pull requests from the same repository | Deploys the artifact to a Hosting **preview channel** that expires after 7 days and comments the URL on the pull request |

Every job runs in `booqora_platform/` (`defaults.run.working-directory`). A `concurrency` group cancels an older run on the same branch when you push again.

:::note The analyser is a gate
`flutter analyze --no-fatal-infos` fails the build on **errors and warnings** (infos are allowed). An unused import, for example, stops the deploy. Run the same command locally before you push.
:::

:::warning Functions are not deployed by CI
The workflow deploys **hosting and rules only**. Deploy Cloud Functions from your computer ([Deploy Functions, Rules & Indexes](doc:installation/backend-deploy#3-deploy-the-functions)). The Marketing Website is not built by this workflow either; deploy it as in [Build & Deploy](doc:web/deployment).
:::

## 1. Point the workflow at your project

Edit `.github/workflows/deploy.yml` and replace the author's IDs:

| Line | Change to |
|---|---|
| `url: https://booqora-platform.web.app` (environment `production`) | Your platform URL |
| `--project booqora-infidec` (twice, in `deploy-live`) | `--project <your-project-id>` |
| `projectId: booqora-infidec` (in `deploy-preview`) | `projectId: <your-project-id>` |
| `target: platform` | Keep, as long as `.firebaserc` maps `platform` to your site |

If you change Flutter versions locally, update `flutter-version: 3.41.4` to match.

## 2. Create a service account

:::steps
### Open IAM
Google Cloud Console → **IAM & Admin → Service Accounts** for your project → **Create service account**, for example `github-deploy`.

### Grant roles
Give it **Firebase Hosting Admin** (hosting and preview channels). To let CI also redeploy rules, add **Firebase Rules Admin** and **Service Usage Consumer**.

### Create a key
Open the account → **Keys → Add key → Create new key → JSON**. A `.json` file downloads.
:::

:::danger Treat the key like a password
Never commit the JSON file. Keep it in a git-ignored folder (the included `.gitignore` ignores `secret/` and `*-firebase.json`) and delete local copies you no longer need.
:::

## 3. Add the GitHub secret

In your repository: **Settings → Secrets and variables → Actions → New repository secret**.

| Name | Value |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | The **entire** contents of the JSON key file, from `{` to `}` |

The `deploy-live` job checks this secret before using it, without printing it. It stops with a clear error if the secret is missing, is not valid JSON, lacks `type`, `project_id`, `private_key` or `client_email`, or has a damaged private key. On success it logs which service account and project it uses.

## 4. Push and watch

```bash title="Terminal"
git add .
git commit -m "Point CI at my Firebase project"
git push origin main
```

Open the **Actions** tab. A green run means the platform is live. You can also start a run by hand with **Run workflow** (`workflow_dispatch`).

## Rules deploy is best effort

After hosting succeeds, the job tries to deploy `firestore:rules` and `storage`. If the service account lacks the **Service Usage Consumer** role, this step prints a warning (*"Security rules were not redeployed by CI"*) and the run still passes. The rules already in Firebase stay active. Grant the role, or deploy rules locally, when you change `firestore.rules` or `storage.rules`.

## When a deploy fails

The job copies the most relevant error lines from the deploy log into **annotations** on the run summary, so you rarely need to open the raw log. Common causes:

| Annotation | Fix |
|---|---|
| *Add the FIREBASE_SERVICE_ACCOUNT repository secret* | Create the secret (step 3) |
| *is not valid JSON* | Paste the whole key file again, including the braces |
| *Permission denied* / *403* | Add **Firebase Hosting Admin** to the service account |
| *Hosting target platform not detected* | Check `.firebaserc` maps `platform` to your site and is committed |
| Analyse step fails | Fix the warnings shown in the log, or run `flutter analyze` locally |

**Next:** [Backups & Monitoring →](doc:installation/backups)
