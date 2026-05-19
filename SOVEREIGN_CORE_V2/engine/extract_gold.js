const fs = require('fs');
const PersonaRewriter = require('./engine/node_c_rewrite');

async function extractGold() {
    console.log("💰 [EXTRACTION] Initiating Gold-First Extraction (MOCK Mode)...");
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    const bible = JSON.parse(fs.readFileSync(manifest.paths.bible, 'utf8'));
    
    // Fix: Explicitly set method to MOCK in config
    const rewriter = new PersonaRewriter({ method: 'MOCK', apiKey: 'MOCK' });
    const whale = { name: "CEO_Alpha", persona: "C_Suite_Whale" };

    const product = bible.products[0];
    const proposal = await rewriter.rewrite(product.description + " Benefits: " + product.key_benefits.join('. '), whale.persona, "AlphaCorp");

    console.log(`
--- [THE GOLD: PROPOSAL FOR ${whale.name}] ---
"${proposal}"
`);
    console.log("✅ [EXTRACTION] Proposal harvested to Intelligence Vault (Simulated).");
}

extractGold().catch(console.error);
