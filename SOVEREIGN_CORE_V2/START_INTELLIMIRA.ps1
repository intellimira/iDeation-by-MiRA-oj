# Ari: Autonomous Ignition Protocol (v2.3)
$ErrorActionPreference = "Stop"

Write-Host "🔥 [IGNITION] Starting IntelliMira Sovereign Core v2.3..." -ForegroundColor Cyan

# 1. Environment Sovereignty Check
if (-not $env:GEMINI_API_KEY) {
    Write-Host "⚠️ [DISSONANCE] GEMINI_API_KEY environment variable missing. Launch aborted." -ForegroundColor Red
    exit
}

# 2. Sync with Repository
Write-Host "🌐 [SYNC] Pulling latest Sovereign Logic..." -ForegroundColor Yellow
& "C:\Program Files\Git\bin\git.exe" pull origin main

# 3. Dependency Self-Healing
Write-Host "🛠️ [HEALING] Ensuring Swarm Dependencies..." -ForegroundColor Yellow
npm install --quiet

# 4. Initiate the Triple-Threat Run
Write-Host "🚀 [LAUNCH] Engaging Sovereign Engine..." -ForegroundColor Green
node engine/run_triple_threat.js

# 5. The Portal Launch
Write-Host "✨ [PORTAL] Opening IntelliMira Studio..." -ForegroundColor Magenta
code .

Write-Host "[GREATNESS] Pipeline Active. Studio Operational." -ForegroundColor Green
