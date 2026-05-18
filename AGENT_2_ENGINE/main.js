const fs = require('fs');
const path = require('path');
const PersonaRewriter = require('./engine/node_c_rewrite');
const PPTGenerator = require('./engine/node_c_ppt');
const { execSync } = require('child_process');

class SalesToolOrchestrator {
    constructor(manifestPath = 'manifest.json') {
        this.manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        this.bible = JSON.parse(fs.readFileSync(this.manifest.paths.bible, 'utf8'));
        
        // Dynamic Auth Selection
        const authConfig = {
            method: process.env.AUTH_METHOD || 'GEMINI',
            apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || 'MOCK_KEY'
        };
        
        this.rewriter = new PersonaRewriter(authConfig);
        this.pptGen = new PPTGenerator(this.manifest);
    }

    getProductData(productId) {
        return this.bible.products.find(p => p.id === productId);
    }

    captureImage(productId, url) {
        console.log(`[NODE C] Triggering Playwright for ${productId}...`);
        try {
            execSync(`node engine/node_c_image.js ${productId} ${url}`);
        } catch (e) {
            console.warn(`[⚠️] Image capture skipped or failed. Proceeding with text-only sync.`);
        }
    }

    async buildKit(productId, personaName, companyName, productUrl) {
        console.log(`\n--- STARTING BUILD (Multi-Auth Engine): ${companyName} / ${personaName} ---`);
        console.log(`[NODE A] Auth Method: ${process.env.AUTH_METHOD || 'GEMINI'}`);

        // 1. Image Capture
        this.captureImage(productId, productUrl);
        
        // 2. Persona Content
        const product = this.getProductData(productId);
        const bibleText = `${product.name}: ${product.description}. Benefits: ${product.key_benefits.join(', ')}`;
        
        console.log("[NODE C] Rewriting for Persona Conciseness...");
        const targetedContent = await this.rewriter.rewrite(bibleText, personaName, companyName);
        
        // 3. PPT Generation
        console.log("[NODE C] Generating Targeted PPT...");
        const contentMap = {
            "Title 1": `Future-Proofing ${company_name}`,
            "Text Placeholder 2": targetedContent
        };
        
        const pptPath = await this.pptGen.generate("Brand_Master.pptx", contentMap, `${companyName}_${productId}_Deck`);
        
        console.log(`[NODE D] Success. Output at: ${pptPath}`);
        return pptPath;
    }
}

async function main() {
    const orchestrator = new SalesToolOrchestrator();
    await orchestrator.buildKit(
        "vibe_grapher_pro",
        "Director of Sales",
        "MegaCorp Solutions",
        "https://whop.com"
    );
}

main();
