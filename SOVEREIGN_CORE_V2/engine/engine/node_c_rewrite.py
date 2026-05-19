import json
from openai import OpenAI # Assuming OpenAI for the rewrite logic

class PersonaRewriter:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)
        self.system_prompt = (
            "You are a Sales Content Architect. Rewrite the provided 'Bible' content "
            "to be extremely concise, ROI-focused, and targeted to the specific persona. "
            "Output MUST be under 150 tokens. Prioritize executive summary style."
        )

    def rewrite(self, bible_fragment, persona, company_context):
        prompt = f"Bible Content: {bible_fragment}\nTarget Persona: {persona}\nCompany: {company_context}"
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.3 # Stability over creativity
        )
        return response.choices[0].message.content.strip()
