const fs = require('fs');
const path = require('path');

class SovereignHarvestVisualizer {
    constructor() {
        this.harvestBaseDir = path.join(__dirname, '../outputs/harvests');
    }

    async visualize() {
        console.clear();
        console.log("====================================================");
        console.log("   SOVEREIGN HARVEST: LIVE FIRE AUDIT DASHBOARD     ");
        console.log("====================================================");

        if (!fs.existsSync(this.harvestBaseDir)) {
            console.log("[!] No active harvests detected in workspace.");
            return;
        }

        const folders = fs.readdirSync(this.harvestBaseDir);
        let active = false;

        for (const folder of folders) {
            const statusPath = path.join(this.harvestBaseDir, folder, 'harvest_status.json');
            if (fs.existsSync(statusPath)) {
                active = true;
                const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
                
                if (status.status === "COMPLETE") {
                    console.log(`\n[COMPLETE] ${status.name || folder}`);
                    console.log(`[STATE] 100% Ingested | HARMONIC`);
                } else {
                    console.log(`\n[ACTIVE] ${status.name || folder}`);
                    console.log(`[PROGRESS] [${status.bar}] ${status.progress}%`);
                    console.log(`[METRICS] Speed: ${status.speed} MB/s | Peers: ${status.peers}`);
                    console.log(`[UPDATED] ${status.timestamp}`);
                }
            }
        }

        if (!active) {
            console.log("\n[SYSTEM] Tracking passive state. No live bit-streams detected.");
        }
        
        console.log("\n====================================================");
    }
}

const visualizer = new SovereignHarvestVisualizer();
visualizer.visualize();
