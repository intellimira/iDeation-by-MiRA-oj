const fs = require('fs');
const path = require('path');

class GlobalLedger {
    constructor(manifest) {
        this.manifest = manifest;
        this.ledgerPath = path.join(__dirname, '../market/dashboard/global_greatness_ledger.json');
    }

    // Append new metrics to the historical archive
    updateLedger(report) {
        let ledger = [];
        if (fs.existsSync(this.ledgerPath)) {
            ledger = JSON.parse(fs.readFileSync(this.ledgerPath, 'utf8'));
        }
        
        ledger.push(report);
        fs.writeFileSync(this.ledgerPath, JSON.stringify(ledger, null, 2));
        console.log("✅ [LEDGER] Greatness metrics aggregated longitudinally.");
    }
}

module.exports = GlobalLedger;
