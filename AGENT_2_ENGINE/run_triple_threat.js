const fs = require('fs');
const PersonaRewriter = require('./engine/node_c_rewrite');
const PPTGenerator = require('./engine/node_c_ppt');

async function runTripleThreat() {
    console.log("🔥 [TRIPLE THREAT] Starting Total Application Execution...");
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    const bible = JSON.parse(fs.readFileSync(manifest.paths.bible, 'utf8'));
    
    const rewriter = new PersonaRewriter({ method: 'GEMINI', apiKey: process.env.GEMINI_API_KEY });
    const pptGen = new PPTGenerator(manifest);

    const personas = ["Director of Sales", "Solutions Architect", "Partner Manager"];
    const product = bible.products[0];

    for (const persona of personas) {
        console.log(`\n--- [PERSONA: ${persona}] ---`);
        const content = await rewriter.rewrite(product.description, persona, "MegaCorp");
        const contentMap = { "Title 1": `Strategy: ${product.name} for ${persona}`, "Text Placeholder 2": content };
        const path = await pptGen.generate("Brand_Master.pptx", contentMap, `KIT_${persona.replace(' ', '_')}`);
        console.log(`✅ Kit generated: ${path}`);
    }

    console.log("\n--- [EVANGELIST DRY-RUN] Synthesizing Launch Post... ---");
    const launchCopy = await rewriter.rewrite("Introducing iDeation-by-MiRA-oj: Sentient sales engine.", "Community", "Global");
    console.log(`🚀 Launch Post Content:\n"${launchCopy}"`);

    console.log("\n✅ [FINAL AUDIT] Checking Intelligence Vault...");
    const vault = JSON.parse(fs.readFileSync(manifest.paths.assets.replace('temp_img/', '../AGENT_0_MIRA_CORE/intelligence_vault.json'), 'utf8'));
    console.log(`Fragments harvested: ${vault.vault_metadata.current_fragment_count}`);
}

runTripleThreat().catch(console.error);
