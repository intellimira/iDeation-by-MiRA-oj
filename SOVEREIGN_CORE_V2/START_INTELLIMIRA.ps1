# Ari: Autonomous Ignition Protocol (v2.7 - Sovereign)
$ErrorActionPreference = "Stop"

Write-Host "🔥 [IGNITION] Starting IntelliMira Sovereign Core v2.7..." -ForegroundColor Cyan

# 1. Sovereign Auth Check
# Instead of hard-aborting, we check for available Auth Frequency
if (-not $env:GEMINI_API_KEY) {
    Write-Host "⚠️ [DISSONANCE] No GEMINI_API_KEY detected. Engine will attempt CLI-native fallback." -ForegroundColor Yellow
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

Write-Host "✅ [GREATNESS] Pipeline Active. Studio Operational." -ForegroundColor Green
