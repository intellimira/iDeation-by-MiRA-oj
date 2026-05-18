const { OpenAI } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

class PersonaRewriter {
    constructor(config) {
        this.method = config.method || 'GEMINI';
        this.apiKey = config.apiKey;
        this.systemPrompt = `You are a Sales Content Architect. Rewrite the provided 'Bible' content to be extremely concise, ROI-focused, and targeted to the specific persona. Output MUST be under 150 tokens. Prioritize executive summary style.`;
    }

    async rewrite(bibleFragment, persona, companyContext) {
        const prompt = `${this.systemPrompt}\n\nBible Content: ${bibleFragment}\nTarget Persona: ${persona}\nCompany: ${companyContext}`;
        
        if (this.method === 'GEMINI') {
            return await this.rewriteGemini(prompt);
        } else if (this.method === 'OPENAI') {
            return await this.rewriteOpenAI(prompt);
        } else {
            return "[MOCK] Concise ROI-focused content for " + persona;
        }
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
}

module.exports = PersonaRewriter;
