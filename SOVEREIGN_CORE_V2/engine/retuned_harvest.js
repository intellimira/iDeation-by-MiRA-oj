const { chromium } = require('playwright');
const fs = require('fs');

async function harvestWhopMarketplace() {
    console.log('⛏️ [RETUNING] Scanning Whop.com with custom User-Agent...');
    const browser = await chromium.launch({ headless: true });
    
    // Custom context to mimic real browser
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    const url = 'https://whop.com/affiliates/buyers/marketplace/?affiliate_marketplace:page=0';
    
    // Retuning: Use domcontentloaded instead of networkidle
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    await page.waitForTimeout(5000); // Allow dynamic content to load

    // Extract Product Nodes
    const products = await page.$$eval('a[href*="/product/"]', elements => 
        elements.map(el => ({
            name: el.innerText.trim(),
            link: el.href
        })).filter(p => p.name.length > 5)
    );
    
    console.log('✅ [HARVEST] Nodes successfully entrained:', products.length);
    fs.writeFileSync('./market/harvested_nodes.json', JSON.stringify(products, null, 2));
    await browser.close();
}
harvestWhopMarketplace().catch(console.error);
