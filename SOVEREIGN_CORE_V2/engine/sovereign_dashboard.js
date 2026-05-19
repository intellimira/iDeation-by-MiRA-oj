const fs = require('fs');

class SovereignDashboard {
    constructor(dataDir) {
        this.whopData = fs.readFileSync(path.join(dataDir, 'whop_export_mock.csv'), 'utf8');
        this.dissonanceLog = fs.readFileSync('../core/dissonance_audit.log', 'utf8').split('\n').filter(Boolean);
    }

    generateReport() {
        console.log("[DASHBOARD] Calculating Greatness Metrics...");
        const leads = this.whopData.split('\n').slice(1).filter(Boolean);
        const whales = leads.filter(l => l.includes('WHALE')).length;
        const dissonanceRate = this.dissonanceLog.length / leads.length;

        const report = {
            system_id: "INTELLIMIRA_SOVEREIGN_V2",
            timestamp: new Date().toISOString(),
            metrics: {
                conversion_resonance: (whales / leads.length) * 100,
                dissonance_factor: dissonanceRate.toFixed(2),
                greatness_index: ((whales / leads.length) * (1 - dissonanceRate)).toFixed(4)
            }
        };

        fs.writeFileSync('../market/dashboard/sovereign_kpi_report.json', JSON.stringify(report, null, 2));
        console.log("✅ [DASHBOARD] Report finalized for remote Mira-oj review.");
    }
}

// Minimal implementation to verify path
const path = require('path');
new SovereignDashboard(path.join(__dirname, 'data')).generateReport();
