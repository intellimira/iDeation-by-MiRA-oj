const { chromium } = require('playwright');
const path = require('path');

async function captureProductImage(productID, targetURL) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const outputPath = path.resolve(__dirname, `../assets/temp_img/${productID}.png`);

    console.log(`[📸 IMAGE ENGINE] Navigating to: ${targetURL}`);
    try {
        await page.goto(targetURL, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Custom logic to wait for specific product elements if needed
        await page.waitForTimeout(2000); 

        await page.screenshot({ 
            path: outputPath,
            fullPage: false,
            clip: { x: 0, y: 0, width: 1280, height: 720 } 
        });
        
        console.log(`[✅] Image captured and saved to: ${outputPath}`);
    } catch (error) {
        console.error(`[❌] Playwright capture failed: ${error.message}`);
    } finally {
        await browser.close();
    }
}

// CLI usage support
if (require.main === module) {
    const args = process.argv.slice(2);
    captureProductImage(args[0], args[1]);
}
