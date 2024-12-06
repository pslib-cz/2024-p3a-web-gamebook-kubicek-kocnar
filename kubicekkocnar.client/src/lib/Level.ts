import Game from "../types/Game";
import LevelType from "../types/Level"
import PlacedBlock from "../types/PlacedBlock";
import MapRenderer from "./MapRenderer";
import GenericFeature from "../types/Feature";
import FeatureRenderer from "./FeatureRenderer";

interface LevelOptions {
    name: string
}

const APIROUTE = (gameId: number, levelId?: number) => `https://localhost:7097/api/Games/${gameId}/Levels${levelId ? `/${levelId}` : ''}`;
class Level implements LevelType {
    available: boolean = false;
    gameId: number;
    levelId: number;
    name!: string;
    description?: string;
    nextLevel?: number;
    mapRenderer: MapRenderer;
    featureRenderer: FeatureRenderer;

    constructor(gameId: number, levelId: number, mapRenderer: MapRenderer, onReady: (level: Level) => void) {
        this.gameId = gameId;
        this.levelId = levelId
        this.mapRenderer = mapRenderer;
        this.featureRenderer = new FeatureRenderer(mapRenderer.scene);
        this.initializeServerLevel(onReady);
    }
    created!: Date;
    game?: Game | undefined;
    blocks: PlacedBlock[] = [];
    features: GenericFeature[] = [];

    async initializeServerLevel(onReady: (level: Level) => void) {
        try {
            const levelResponse = await fetch(APIROUTE(this.gameId, this.levelId));
            if (!levelResponse.ok) {
                throw new Error(`Response status: ${levelResponse.status}`);
            }
            const level: LevelType = await levelResponse.json();
            
            this.name = level.name;
            this.description = level.description;
            this.nextLevel = level.nextLevel;
            this.available = true;
            this.created = level.created;

            const levelBlocksResponse = await fetch(APIROUTE(this.gameId, this.levelId) + '/Blocks');
            if (!levelBlocksResponse.ok) {
                throw new Error(`Response status: ${levelBlocksResponse.status}`);
            }

            this.blocks = (await levelBlocksResponse.json()).map(MapRenderer.transformBlock);

            for (const block of level.blocks) {
                this.mapRenderer.addBlock(block);
            }

            const levelFeaturesResponse = await fetch(APIROUTE(this.gameId, this.levelId) + '/Features');
            if (!levelFeaturesResponse.ok) {
                throw new Error(`Response status: ${levelFeaturesResponse.status}`);
            }

            this.features = (await levelFeaturesResponse.json()).map(FeatureRenderer.transformFeature);

            console.log("features", this.features);

            for (const feature of this.features) {
                console.log("feature", feature);
                
                this.featureRenderer.addFeature(feature);
            }

            onReady(this);
        } catch (err: unknown) {
            console.error(err);
        }
    }

    async patchFeature(featureId: number, path: string, value: unknown, op: string = 'replace') {
        try {
            const featureResponse = await fetch(APIROUTE(this.gameId, this.levelId) + `/Features/${featureId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify([{
                    op: op,
                    path: path,
                    value: value
                }])
            })
            if (!featureResponse.ok) {
                throw new Error(`Response status: ${featureResponse.status}`);
            }
            const feature: GenericFeature = FeatureRenderer.transformFeature(await featureResponse.json());
            this.featureRenderer.removeFeature(feature);
            this.featureRenderer.addFeature(feature);
        }
        catch (err: unknown) {
            console.error(err);
        }
    }

    async patch(key: keyof LevelType, value: unknown) {
        try {
            const levelResponse = await fetch(APIROUTE(this.gameId, this.levelId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify({
                    op: 'replace',
                    path: `/${key}`,
                    value: value
                })
            })
            if (!levelResponse.ok) {
                throw new Error(`Response status: ${levelResponse.status}`);
            }
            const level: LevelType = await levelResponse.json();
            
            // @ts-expect-error since class Level implements LevelType, we can assign any key of LevelType to this
            this[key] = level[key];

            return level
        } catch (err: unknown) {
            console.error(err);
        }
    };

    async addBlock(block: PlacedBlock) {
        try {
            const blockResponse = await fetch(APIROUTE(this.gameId, this.levelId) + '/Blocks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    blockId: block.blockId,
                    state: block.state,
                    x: block.position.x,
                    y: block.position.y,
                    z: block.position.z,
                })
            })
            if (!blockResponse.ok) {
                throw new Error(`Response status: ${blockResponse.status}`);
            }
            const newBlock: PlacedBlock = await blockResponse.json();
            block = {...block, placedBlockId: newBlock.placedBlockId};
            
            this.blocks.push(block);
            this.mapRenderer.addBlock(block);
        } catch (err: unknown) {
            console.error(err);
        }
    }

    async removeBlock(block: PlacedBlock) {
        try {
            const blockResponse = await fetch(APIROUTE(this.gameId, this.levelId) + `/Blocks/${block.placedBlockId}`, {
                method: 'DELETE'
            })
            if (!blockResponse.ok) {
                throw new Error(`Response status: ${blockResponse.status}`);
            }
            
            const blockIndex = this.blocks.findIndex(block => block.placedBlockId === block.placedBlockId);
            if (blockIndex !== -1) {
                this.blocks.splice(blockIndex, 1);
            }
            this.mapRenderer.removeBlock(block);
        } catch (err: unknown) {
            console.error(err);
        }
    }

    async addFeature(feature: GenericFeature) {
        try {
            const featureResponse = await fetch(APIROUTE(this.gameId, this.levelId) + '/Features', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    featureId: feature.featureId,
                    type: feature.type,
                    x: feature.position?.x,
                    y: feature.position?.y,
                    z: feature.position?.z,
                    params: feature.params
                })
            })
            if (!featureResponse.ok) {
                throw new Error(`Response status: ${featureResponse.status}`);
            }
            const newFeature: GenericFeature = await featureResponse.json();
            feature = {...feature, featureId: newFeature.featureId};
            
            this.features.push(feature);
            this.featureRenderer.addFeature(feature);

            return feature;
        } catch (err: unknown) {
            console.error(err);
        }
    }

    async removeFeature(feature: GenericFeature) {
        try {
            const featureResponse = await fetch(APIROUTE(this.gameId, this.levelId) + `/Features/${feature.featureId}`, {
                method: 'DELETE'
            })
            if (!featureResponse.ok) {
                throw new Error(`Response status: ${featureResponse.status}`);
            }
            
            const featureIndex = this.features.findIndex(feature => feature.featureId === feature.featureId);
            if (featureIndex !== -1) {
                this.features.splice(featureIndex, 1);
            }
            this.featureRenderer.removeFeature(feature);
        } catch (err: unknown) {
            console.error(err);
        }
    }

    static async createLevel(gameId: number, mapRenderer: MapRenderer, options: LevelOptions, onReady: (level: Level) => void) {
        try {
            const levelResponse = await fetch(APIROUTE(gameId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: options.name
                })
            })
            if (!levelResponse.ok) {
                throw new Error(`Response status: ${levelResponse.status}`);
            }
            const level: LevelType = await levelResponse.json();
            
            return new Level(level.gameId, level.levelId, mapRenderer, onReady);
        } catch (err: unknown) {
            console.error(err);
        }
    }
}

export default Level