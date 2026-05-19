import json
import os
import subprocess
from engine.node_c_rewrite import PersonaRewriter
from engine.node_c_ppt import PPTGenerator
from engine.node_d_sync import StateSync

class SalesToolOrchestrator:
    def __init__(self, manifest_path='manifest.json'):
        with open(manifest_path, 'r') as f:
            self.manifest = json.load(f)
        
        # Load Bible
        with open(self.manifest['paths']['bible'], 'r') as f:
            self.bible = json.load(f)
            
        self.rewriter = PersonaRewriter(api_key=os.getenv("OPENAI_API_KEY"))
        self.ppt_gen = PPTGenerator(self.manifest)
        self.syncer = StateSync(self.manifest)

    def get_product_data(self, product_id):
        for p in self.bible['products']:
            if p['id'] == product_id:
                return p
        return None

    def capture_image(self, product_id, url):
        print(f"[NODE C] Triggering Playwright for {product_id}...")
        subprocess.run(["node", "engine/node_c_image.js", product_id, url])

    def build_kit(self, product_id, persona_name, company_name, product_url):
        print(f"\n--- STARTING BUILD: {company_name} / {persona_name} ---")
        
        # 1. Image Capture (Node C)
        self.capture_image(product_id, product_url)
        
        # 2. Persona Content Compilation (Node C)
        product = self.get_product_data(product_id)
        bible_text = f"{product['name']}: {product['description']}. Benefits: {', '.join(product['key_benefits'])}"
        
        print("[NODE C] Rewriting for Persona Conciseness...")
        targeted_content = self.rewriter.rewrite(bible_text, persona_name, company_name)
        
        # 3. PPT Generation (Node C)
        print("[NODE C] Generating Targeted PPT...")
        content_map = {
            "Title 1": f"Future-Proofing {company_name}",
            "Text Placeholder 2": targeted_content
        }
        # We assume a default template exists
        ppt_path = self.ppt_gen.generate("Brand_Master.pptx", content_map, f"{company_name}_{product_id}_Deck")
        
        # 4. State Sync (Node D)
        print(f"[NODE D] Success. Output at: {ppt_path}")
        return ppt_path

if __name__ == "__main__":
    orchestrator = SalesToolOrchestrator()
    orchestrator.build_kit(
        product_id="vibe_grapher_pro",
        persona_name="Director of Sales",
        company_name="MegaCorp Solutions",
        product_url="https://whop.com" # Placeholder for product UI
    )
