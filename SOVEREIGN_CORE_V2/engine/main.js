const CRMConnector = require('./engine/crm_connector');
const fs = require('fs');

async function runLeadOrchestrator() {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    const connector = new CRMConnector(manifest);

    const incomingLeads = [
        { name: "John Doe", persona: "Director of Sales", budget: 60000, primary_interest: "Revenue growth" },
        { name: "Jane Smith", persona: "Solutions Architect", budget: 20000, primary_interest: "Security" }
    ];

    for (const lead of incomingLeads) {
        const result = await connector.qualifyLead(lead);
        await connector.syncToCRM(result);
    }
}

runLeadOrchestrator();
