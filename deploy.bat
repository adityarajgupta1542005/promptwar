@echo off
REM ============================================================
REM  VoteSmart AI — Production Deploy Script
REM  GCP Project: promptwarhack2skil
REM  Run this from CMD (not PowerShell) in the project root.
REM ============================================================

echo.
echo ============================================================
echo  VoteSmart AI — Production Deploy
echo  Project: promptwarhack2skil  ^|  Region: asia-south1
echo ============================================================
echo.

REM ── STEP 1: Clean install ────────────────────────────────────
echo [1/7] Installing frontend dependencies...
call npm install --legacy-peer-deps
if %ERRORLEVEL% neq 0 (
    echo [FAIL] npm install failed. Fix errors above and retry.
    pause & exit /b 1
)
echo [OK] Dependencies installed.
echo.

REM ── STEP 2: Verify build ─────────────────────────────────────
echo [2/7] Building production bundle (Vite)...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [FAIL] Build failed. Check errors above — likely a JSX/import issue.
    echo        Tip: Run "npm run build" manually to see the full stack trace.
    pause & exit /b 1
)
echo [OK] dist/ folder ready.
echo.

REM ── STEP 3: Preview build locally (optional, non-blocking) ───
echo [3/7] Starting preview server for 5 seconds (Ctrl+C to skip)...
echo        Open http://localhost:4173 to verify the build.
timeout /t 5 /nobreak >nul
echo.

REM ── STEP 4: Git commit ───────────────────────────────────────
echo [4/7] Committing all changes to Git...
git add -A
git commit -m "fix: stepIndex ReferenceError, nginx API proxy, CSP + CORS URLs updated to promptwarhack2skil"
if %ERRORLEVEL% neq 0 (
    echo [WARN] Git commit failed or nothing to commit — continuing...
)
echo.

REM ── STEP 5: Set GCP project ──────────────────────────────────
echo [5/7] Configuring GCP project...
call gcloud config set project promptwarhack2skil
if %ERRORLEVEL% neq 0 (
    echo [FAIL] gcloud config failed. Are you authenticated?
    echo        Run: gcloud auth login
    pause & exit /b 1
)
echo.

REM ── STEP 6: Enable required APIs ─────────────────────────────
echo [6/7] Enabling Cloud APIs (safe to re-run)...
call gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
echo.

REM ── STEP 7: Deploy to Cloud Run ──────────────────────────────
echo [7/7] Deploying to Cloud Run...
echo        This builds a Docker image from Dockerfile and deploys it.
echo        First deploy takes ~5 min. Subsequent deploys ~2 min.
echo.
call gcloud run deploy votesmart-ai ^
  --source . ^
  --region asia-south1 ^
  --allow-unauthenticated ^
  --port 8080 ^
  --memory 256Mi ^
  --cpu 1 ^
  --min-instances 0 ^
  --max-instances 10 ^
  --timeout 30s

if %ERRORLEVEL% neq 0 (
    echo.
    echo [FAIL] Deployment failed!
    echo        Check logs with:
    echo        gcloud run services logs read votesmart-ai --region asia-south1
    pause & exit /b 1
)

echo.
echo ============================================================
echo  DEPLOYMENT COMPLETE!
echo  
echo  NEXT STEPS:
echo  1. Open the URL printed above in your browser.
echo  2. If UI loads = SUCCESS (stepIndex fix worked)
echo  3. If API calls fail = set GEMINI_API_KEY on backend:
echo     gcloud run services update votesmart-ai ^
echo       --region asia-south1 ^
echo       --set-env-vars GEMINI_API_KEY=YOUR_KEY_HERE
echo  
echo  CHECK LOGS:
echo  gcloud run services logs read votesmart-ai --region asia-south1
echo ============================================================
pause
