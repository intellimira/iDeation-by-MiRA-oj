const { OpenAI } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

class PersonaRewriter {
    constructor(config) {
        this.method = config.method || 'GEMINI';
        this.apiKey = config.apiKey;
        this.vaultPath = config.vaultPath || path.join(__dirname, '../../AGENT_0_MIRA_CORE/intelligence_vault.json');
        this.systemPrompt = `You are a Sales Content Architect. Rewrite the provided 'Bible' content to be extremely concise, ROI-focused, and targeted to the specific persona. Output MUST be under 150 tokens. Prioritize executive summary style.`;
    }

    async rewrite(bibleFragment, persona, companyContext) {
        const prompt = `${this.systemPrompt}\n\nBible Content: ${bibleFragment}\nTarget Persona: ${persona}\nCompany: ${companyContext}`;
        let result;

        if (this.method === 'PROCEDURAL') {
            result = await this.rewriteProcedural(bibleFragment, persona, companyContext);
        } else if (this.method === 'GEMINI') {
            result = await this.rewriteGemini(prompt);
        } else if (this.method === 'OPENAI') {
            result = await this.rewriteOpenAI(prompt);
        } else {
            result = "[MOCK] Concise ROI-focused content for " + persona;
        }

        // The Data Harvest: Archive ROI-proven outputs
        if (this.method !== 'MOCK' && this.method !== 'PROCEDURAL') {
            this.harvest(bibleFragment, persona, result);
        }

        return result;
    }

    async rewriteProcedural(bibleFragment, persona, companyContext) {
        // Phase 2: Procedural Assembly (Mocking vault retrieval for now)
        return `[SOVEREIGN] Targeted ROI summary for ${persona} at ${companyContext} based on archived patterns.`;
    }

    async rewriteGemini(prompt) {
        const genAI = new GoogleGenerativeAI(this.apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    }

    async rewriteOpenAI(prompt) {
        const openai = new OpenAI({ apiKey: this.apiKey });
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
            temperature: 0.3
        });
        return response.choices[0].message.content.trim();
    }

    harvest(input, persona, output) {
        try {
            if (!fs.existsSync(this.vaultPath)) return;
            const vault = JSON.parse(fs.readFileSync(this.vaultPath, 'utf8'));
            vault.fragments.push({
                timestamp: new Date().toISOString(),
                persona: persona,
                input_sample: input.substring(0, 100),
                output_gold: output
            });
            vault.vault_metadata.current_fragment_count = vault.fragments.length;
            fs.writeFileSync(this.vaultPath, JSON.stringify(vault, null, 2));
        } catch (e) {
            console.error("[⚠️] Sovereignty Harvest Failed:", e.message);
        }
    }
}

module.exports = PersonaRewriter;
