const PptxGenJS = require("pptxgenjs");
const path = require("path");

class PPTGenerator {
    constructor(manifest) {
        this.manifest = manifest;
    }

    async generate(templateName, contentMap, outputName) {
        let pptx = new PptxGenJS();
        
        // Note: pptxgenjs handles templates differently than python-pptx.
        // For this implementation, we simulate the 'Master' by defining a layout.
        pptx.layout = "LAYOUT_4x3";

        let slide = pptx.addSlide();
        
        // Title
        slide.addText(contentMap["Title 1"] || "Sales Presentation", {
            x: 0.5, y: 0.5, w: "90%", h: 1,
            fontSize: 32, color: "363636", bold: true
        });

        // Body Content (The Concise Persona Rewrite)
        slide.addText(contentMap["Text Placeholder 2"] || "", {
            x: 0.5, y: 1.5, w: "90%", h: 3,
            fontSize: 18, color: "666666", valign: "top"
        });

        // Background simulation (The 'Vibe' requirement: preserve backgrounds)
        // In a full implementation, we would use pptx.defineLayout with background images.

        const outputPath = path.join(this.manifest.paths.outputs, `${outputName}.pptx`);
        await pptx.writeFile({ fileName: outputPath });
        return outputPath;
    }
}

module.exports = PPTGenerator;
