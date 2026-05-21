const fs = require('fs');
const path = require('path');

class TrustValidator {
    constructor(vaultPath) {
        this.vaultPath = vaultPath || path.join(__dirname, 'intelligence_vault.json');
    }

    /**
     * Calculates the Trust Resonance of a torrent result.
     * @param {Object} torrent - The torrent metadata (seeds, peers, size, name, uploader, comments).
     * @returns {Object} { resonance: Number, status: String, warnings: Array }
     */
    calculateResonance(torrent) {
        let score = 0;
        let warnings = [];

        // 1. Availability Resonance (Seeds/Peers)
        const ratio = torrent.seeds / (torrent.peers || 1);
        if (torrent.seeds > 100) score += 0.3;
        else if (torrent.seeds > 10) score += 0.15;
        
        if (ratio > 2) score += 0.1;

        // 2. Structural Resonance (Entropy Check)
        // Example: If it's a software/DAW and the size is suspiciously small (< 100MB)
        if (torrent.name.toLowerCase().includes('fl studio')) {
            const sizeGB = torrent.sizeBytes / (1024 * 1024 * 1024);
            if (sizeGB < 0.1) {
                warnings.push("SUSPICIOUS_SIZE: FL Studio usually > 1GB");
                score -= 0.4;
            } else if (sizeGB > 1) {
                score += 0.4; // Increased weight for correct size
            }
        }

        // 3. User Vouch Sentiment (Mock)
        if (torrent.comments && (torrent.comments.toLowerCase().includes('works') || torrent.comments.toLowerCase().includes('stable'))) {
            score += 0.3; // Increased weight for stability vouches
        }

        // 4. Source Authority (Placeholder)
        if (torrent.uploader === 'Scene_Master' || torrent.uploader === 'R2R') {
            score += 0.2;
        }
        
        const resonance = Math.min(Math.max(score, 0), 1);
        let status = "DISSONANT";
        if (resonance > 0.7) status = "HARMONIC";
        else if (resonance >= 0.5) status = "NEUTRAL";

        return { resonance, status, warnings };
    }
}

module.exports = TrustValidator;
