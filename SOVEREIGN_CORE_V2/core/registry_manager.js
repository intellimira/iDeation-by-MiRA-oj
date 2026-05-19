const fs = require('fs');
const path = require('path');

class RegistryManager {
    constructor(manifest) {
        this.manifest = manifest;
        this.registryPath = path.join(__dirname, 'registry.json');
    }

    async inflateAgent(agentId) {
        const registry = JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
        if (!registry.registry[agentId]) throw new Error("Agent not found in registry.");

        console.log(`[CAR] Inflating Agent: ${agentId}...`);
        registry.registry[agentId].status = "ACTIVE";
        fs.writeFileSync(this.registryPath, JSON.stringify(registry, null, 2));

        return require(registry.registry[agentId].path);
    }

    async deflateAgent(agentId) {
        const registry = JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
        registry.registry[agentId].status = "DORMANT";
        fs.writeFileSync(this.registryPath, JSON.stringify(registry, null, 2));
        console.log(`[CAR] Agent ${agentId} returned to DORMANT state.`);
    }
}

module.exports = RegistryManager;
