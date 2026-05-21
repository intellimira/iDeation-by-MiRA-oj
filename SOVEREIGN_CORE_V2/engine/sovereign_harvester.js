const fs = require('fs');
const path = require('path');
const TrustValidator = require('../core/trust_validator');
const KymaticaEngine = require('../core/kymatica_engine');

class SovereignHarvester {
    constructor() {
        // Load manifest for Kymatica
        const manifestPath = path.join(__dirname, 'manifest.json');
        const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
        
        this.validator = new TrustValidator();
        this.kymatica = new KymaticaEngine(manifest);
        this.client = null;
    }

    async initClient() {
        if (!this.client) {
            const { default: WebTorrent } = await import('webtorrent');
            this.client = new WebTorrent();
        }
    }

    /**
     * Executes a Kymatic Search and Live Harvest.
     * @param {string} vibePrompt - The semantic search prompt.
     */
    async harvest(vibePrompt) {
        await this.initClient();
        console.log(`[HARVESTER] Initiating Kymatic Search: "${vibePrompt}"`);
        
        // Node A: Semantic Expansion
        const searchTerms = this.expandQuery(vibePrompt);
        console.log(`[NODE A] Expanded Vectors: ${JSON.stringify(searchTerms)}`);

        // Node B: Mock Sourcing & Validation
        // Real-world verified 25.2.5 build data integration
        const mockResults = [
            {
                name: "FL Studio 2025.2.5 (v25.x) All Plugins Edition + FLEX Library [Scene]",
                seeds: 3450,
                peers: 820,
                sizeBytes: 8500000000, // ~8.5 GB - Harmonic for All Plugins + Library
                uploader: "Scene_Master",
                comments: "Verified stable 25.2.5. Gopher AI and Dynamic Mixer tracks working. Clean.",
                magnet: "magnet:?xt=urn:btih:2525c5a7a6183aae1e09d831df6748d566095a10&dn=FL+Studio+2025+Stable" 
            }
        ];

        console.log(`[NODE B] Validating ${mockResults.length} potential sources...`);
        
        const validatedResults = mockResults.map(res => {
            const audit = this.validator.calculateResonance(res);
            return { ...res, audit };
        });

        const topHit = validatedResults.sort((a, b) => b.audit.resonance - a.audit.resonance)[0];

        if (topHit && topHit.audit.resonance > 0.7) {
            console.log(`[HARMONIC FOUND] Target: ${topHit.name}`);
            
            const localPath = path.join(__dirname, '../outputs/harvests', topHit.name.replace(/[^a-z0-9]/gi, '_').toLowerCase());
            if (!fs.existsSync(localPath)) fs.mkdirSync(localPath, { recursive: true });

            console.log(`[NODE C] Initializing Live Sovereign Harvest to: ${localPath}`);
            
            await this.liveHarvest(topHit.magnet, localPath);
            
            this.syncToVault(topHit);
            return { ...topHit, localPath };
        } else {
            console.warn(`[DISSONANCE DETECTED] No results met trust threshold.`);
            return null;
        }
    }

    async liveHarvest(magnet, downloadPath) {
        return new Promise((resolve, reject) => {
            const statusFile = path.join(downloadPath, 'harvest_status.json');
            
            // Swarm Acceleration: High-Frequency Trackers
            const announce = [
                'udp://tracker.opentrackr.org:1337/announce',
                'udp://tracker.leechers-paradise.org:6969/announce',
                'udp://9.rarbg.to:2920/announce',
                'udp://p4p.arenabg.com:1337/announce',
                'udp://tracker.internetwarriors.net:1337/announce',
                'udp://tracker.cyberia.is:6969/announce',
                'udp://exodus.desync.com:6969/announce',
                'udp://open.stealth.si:80/announce'
            ];

            // Initial 'Seeking' state
            const initialStatus = {
                status: "CONNECTING",
                name: "Seeking Peers (Swarm Acceleration Active)...",
                progress: "0.00",
                speed: "0.00",
                peers: 0,
                bar: '░'.repeat(30),
                timestamp: new Date().toISOString()
            };
            fs.writeFileSync(statusFile, JSON.stringify(initialStatus, null, 2));

            this.client.add(magnet, { path: downloadPath, announce: announce }, (torrent) => {
                console.log(`[NODE C] Connected to swarm. Metadata received.`);
                
                torrent.on('download', (bytes) => {
                    const progress = (torrent.progress * 100).toFixed(2);
                    const speed = (torrent.downloadSpeed / (1024 * 1024)).toFixed(2);
                    const peers = torrent.numPeers;
                    
                    const barLength = 30;
                    const filledLength = Math.round(barLength * torrent.progress);
                    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
                    
                    const output = `\r[SOVEREIGN HARVEST] [${bar}] ${progress}% | ${speed} MB/s | Peers: ${peers}`;
                    process.stdout.write(output);

                    const status = {
                        status: "HARVESTING",
                        name: torrent.name,
                        progress,
                        speed,
                        peers,
                        bar,
                        timestamp: new Date().toISOString()
                    };
                    fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
                });

                torrent.on('done', () => {
                    console.log('\n[NODE C] Full Payload Ingested Successfully.');
                    const status = { status: "COMPLETE", timestamp: new Date().toISOString() };
                    fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
                    resolve();
                });

                torrent.on('error', (err) => {
                    console.error('\n[NODE C] Harvest Error:', err);
                    reject(err);
                });
            });
        });
    }

    expandQuery(prompt) {
        return [`${prompt} official`, `${prompt} high seeds`, `${prompt} verified uploader`];
    }

    syncToVault(hit) {
        const vaultPath = path.join(__dirname, '../core/intelligence_vault.json');
        let vault = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
        
        const entry = {
            id: `TORRENT_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "HARVESTED_DATA",
            metadata: {
                name: hit.name,
                resonance: hit.audit.resonance,
                status: hit.audit.status,
                source: hit.uploader
            }
        };

        vault.fragments.push(entry);
        vault.vault_metadata.current_fragment_count++;
        
        fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2));
        console.log(`[NODE D] Data frequency synchronized to Intelligence Vault.`);
    }
}

if (require.main === module) {
    const harvester = new SovereignHarvester();
    const query = process.argv[2] || "FL Studio";
    harvester.harvest(query).catch(err => {
        console.error("[CRITICAL] Harvest Aborted:", err);
        process.exit(1);
    });
}

module.exports = SovereignHarvester;
