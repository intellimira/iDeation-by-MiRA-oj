const fs = require('fs');
const PersonaRewriter = require('./engine/node_c_rewrite');
const Evangelist = require('../market/engine/node_c_evangelist');
const CRM = require('./engine/crm_connector');

async function runMiningExtraction() {
    console.log('⛏️ [MINING PROTOCOL] Initiating Stone-Turning...');
    const manifest = { paths: { bible: './data/bible.json' } };
    const bible = JSON.parse(fs.readFileSync('./data/bible.json', 'utf8'));
    
    const rewriter = new PersonaRewriter({ method: 'MOCK', apiKey: 'MOCK' });
    const evangelist = new Evangelist();
    const crm = new CRM(manifest);
    
    for (const product of bible.products) {
        console.log(`[MINING] Analyzing potential: ${product.name}`);
        const outreach = await evangelist.synthesizeParadigmShift('High-Yield Affiliate', product.name);
        console.log(`💰 [GOLD HARVESTED - OUTREACH]: 
${outreach}
`);
    }
    console.log('✅ [MINING PROTOCOL] Extraction Complete. Evidence logged.');
}
runMiningExtraction().catch(console.error);
