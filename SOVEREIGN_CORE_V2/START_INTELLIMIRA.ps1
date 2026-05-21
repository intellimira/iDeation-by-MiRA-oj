# Ari: Autonomous Ignition Protocol
$ErrorActionPreference = "Stop"

Write-Host "🔥 [IGNITION] Starting IntelliMira Sovereign Core v2.0..." -ForegroundColor Cyan

# 1. Environment Sovereignty Check
if (-not $env:GEMINI_API_KEY) {
    Write-Host "⚠️ [DISSONANCE] GEMINI_API_KEY environment variable missing. Launch aborted." -ForegroundColor Red
    exit
}

# 2. Sync with Repository (Get the latest intent)
Write-Host "🌐 [SYNC] Pulling latest Sovereign Logic from GitHub..." -ForegroundColor Yellow
git pull origin main

# 3. Dependency Self-Healing
Write-Host "🛠️ [HEALING] Ensuring Swarm Dependencies..." -ForegroundColor Yellow
npm install --quiet

# 4. Initiate the Triple-Threat Run
Write-Host "🚀 [LAUNCH] Engaging Sovereign Engine..." -ForegroundColor Green
node engine/run_triple_threat.js

Write-Host "✅ [GREATNESS] Cycle Complete. Ledger synchronized." -ForegroundColor Green
