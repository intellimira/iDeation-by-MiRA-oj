const fs = require('fs');
const path = require('path');
const CRMConnector = require('../AGENT_6_CRM_CONNECTOR/engine/crm_connector');
const Evangelist = require('../AGENT_5_EVANGELIST/engine/node_c_evangelist');

async function runRevenueLoop() {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    const connector = new CRMConnector(manifest);
    const evangelist = new Evangelist();

    const incomingLeads = [
        { name: "John Doe", persona: "Director of Sales", budget: 60000, primary_interest: "Revenue growth" }
    ];

    for (const lead of incomingLeads) {
        const qualification = await connector.qualifyLead(lead);
        
        if (qualification.status === "WHALE") {
            console.log(`[LOOP] Whale Detected! Dispatching Agent 5 Evangelist...`);
            const outreach = await evangelist.synthesizeParadigmShift("High-Ticket Sales Audit", lead.name);
            console.log(`[LOOP] Automated Proposal Generated:\n"${outreach}"`);
        }
    }
}

runRevenueLoop().catch(console.error);
