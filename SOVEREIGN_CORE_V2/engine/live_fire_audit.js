const fs = require('fs');
const path = require('path');
const CRMConnector = require('./engine/crm_connector');
const Evangelist = require('../market/engine/node_c_evangelist'); // Corrected path
const KymaticaEngine = require('../core/kymatica_engine');

async function liveFireExtraction() {
    console.log("🌊 [KYMATICA] Initiating Resonance Extraction...");
    const manifest = { paths: { bible: './data/bible.json', assets: './assets/' } };
    
    const connector = new CRMConnector(manifest);
    const evangelist = new Evangelist();
    const kymatica = new KymaticaEngine(manifest);

    // 1. Ingest Simulated Lead
    const lead = { name: "CEO_Alpha", persona: "C_Suite_Whale", budget: 100000, primary_interest: "Market Dominance" };
    
    // 2. Qualify (Agent 6)
    const qualification = await connector.qualifyLead(lead);
    
    if (qualification.status === "WHALE") {
        console.log("✅ [WHALE DETECTED] Performing Frequency Sweep...");
        
        // 3. Entrain Resonance (Agent 7)
        const resonanceState = await kymatica.entrainFrequency(lead, [{id: 'C_Suite_Whale', tone: 'ROI-obsessed'}]);
        
        if (resonanceState.status === "HARMONIC_RESONANCE") {
            // 4. Generate Gold (Agent 5)
            const gold = await evangelist.synthesizeParadigmShift("High-Ticket Sentient Audit", lead.name);
            console.log(`
💰 [GOLD HARVESTED]:
"${gold}"
`);
        }
    }
}

liveFireExtraction().catch(console.error);
