const { chromium } = require('playwright');
const path = require('path');

async function generateStablePDF(content, outputPath, imagePath) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @page { size: A4; margin: 0; }
            body { font-family: 'Inter', sans-serif; }
            .page-container { height: 297mm; width: 210mm; padding: 20mm; display: flex; flex-direction: column; }
        </style>
    </head>
    <body class="bg-white">
        <div class="page-container border-l-8 border-blue-600">
            <header class="mb-10">
                <h1 class="text-4xl font-bold text-gray-900">${content.title}</h1>
                <p class="text-blue-600 font-semibold tracking-widest uppercase mt-2">Executive Enablement Kit</p>
            </header>
            
            <main class="flex-grow">
                <section class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Strategic Summary</h2>
                    <p class="text-lg text-gray-600 leading-relaxed">${content.body}</p>
                </section>
                
                <section class="mt-auto">
                    <img src="file://${path.resolve(imagePath)}" class="w-full h-64 object-cover rounded-xl shadow-lg" />
                </section>
            </main>
            
            <footer class="mt-10 border-t pt-4 text-sm text-gray-400 flex justify-between">
                <span>Generated for: ${content.company}</span>
                <span>Confidential | Sales Enablement Engine</span>
            </footer>
        </div>
    </body>
    </html>
    `;

    await page.setContent(htmlContent);
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
    await browser.close();
}
