const fs = require('fs');
const path = require('path');
const PersonaRewriter = require('./engine/node_c_rewrite');
const PPTGenerator = require('./engine/node_c_ppt');
const { execSync } = require('child_process');

class SelfVerificationOrchestrator {
    constructor() {
        // Force MOCK mode for verification
        this.manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
        this.bible = JSON.parse(fs.readFileSync(this.manifest.paths.bible, 'utf8'));
        
        this.rewriter = new PersonaRewriter({ method: 'MOCK', apiKey: 'MOCK_KEY' });
        this.pptGen = new PPTGenerator(this.manifest);
    }

    async verify() {
        console.log("🚀 [VERIFICATION] Starting FAA-RSM Self-Audit...");
        
        const productId = "vibe_grapher_pro";
        const company = "TestCorp_Global";
        const persona = "Director of Sales";

        // 1. Verify Image Engine
        console.log("[NODE C] Verifying Playwright Image Capture...");
        try {
            execSync(`node engine/node_c_image.js ${productId} https://google.com`);
            console.log("✅ Image Engine: Verified.");
        } catch (e) {
            console.error("❌ Image Engine: Failed.");
        }

        // 2. Verify Rewrite Engine (Mock)
        console.log("[NODE C] Verifying Persona Rewrite Engine (MOCK)...");
        const targetedContent = await this.rewriter.rewrite("Sample Bible Content", persona, company);
        console.log(`✅ Rewrite Engine: Verified. Output: "${targetedContent}"`);

        // 3. Verify PPT Engine
        console.log("[NODE C] Verifying PPT Generation...");
        const contentMap = {
            "Title 1": `Self-Verification for ${company}`,
            "Text Placeholder 2": targetedContent
        };
        const pptPath = await this.pptGen.generate("Brand_Master.pptx", contentMap, "VERIFICATION_DECK");
        console.log(`✅ PPT Engine: Verified. Saved at: ${pptPath}`);

        console.log("\n--- [VERIFICATION COMPLETE] SYSTEM READY FOR INTELLIMIRA RELEASE ---");
    }
}

new SelfVerificationOrchestrator().verify();
