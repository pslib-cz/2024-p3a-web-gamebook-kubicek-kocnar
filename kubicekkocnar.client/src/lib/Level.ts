import Game from "../types/Game";
import LevelType from "../types/Level"
import PlacedBlock from "../types/PlacedBlock";
import MapRenderer from "./MapRenderer";
import GenericFeature from "../types/Feature";
import FeatureRenderer from "./features/FeatureRenderer";
import { FetchLevel } from "../api/Levels";
import { EnemyRenderer } from "./Enemy";
import { EnemyType } from "../types/Enemy";
import SaveHandler from "./SaveHandler";
import { Item } from "../types/Item";
import { Coinage } from "../types/Coinage";
import CorruptionHandler from "./CorruptionHandler";

// interface LevelOptions {
//   name: string
// }

const APIROUTE = (gameId: number, levelId?: number) => `${import.meta.env.VITE_API_URL}/Games/${gameId}/Levels${levelId ? `/${levelId}` : ''}`;
class Level implements LevelType {
  available: boolean = false;
  gameId: number;
  levelId: number;
  name!: string;
  description?: string;
  nextLevel?: number;
  mapRenderer: MapRenderer;
  featureRenderer: FeatureRenderer;
  enemyRenderer: EnemyRenderer | null = null;
  corruptionHandler: CorruptionHandler | null = null;
  enemies: EnemyType[] = [];
  items: Item[] = [];
  coinages: Coinage[] = [];

  constructor(gameId: number, levelId: number, mapRenderer: MapRenderer, onReady: (level: Level) => void) {
    this.gameId = gameId;
    this.levelId = levelId
    this.mapRenderer = mapRenderer;
    this.featureRenderer = new FeatureRenderer(mapRenderer.scene);

    this.initializeServerLevel(
      (level) => {
        onReady(level);

        this.enemyRenderer = new EnemyRenderer(mapRenderer.scene, this);

        this.corruptionHandler = new CorruptionHandler(this.blocks.filter(
          (block) => block.block.attributes[0] == "corrupt"
        ), this.blocks, this.enemyRenderer!);

        // init
        this.corruptionHandler.start();
      }
    );
  }
  created!: Date;
  game?: Game | undefined;
  blocks: PlacedBlock[] = [];
  features: GenericFeature[] = [];

  async initializeServerLevel(onReady: (level: Level) => void) {
    try {
      const level: LevelType = await FetchLevel(this.gameId, this.levelId) as LevelType;

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

      for (let i = 0; i < this.blocks.length; i++) {
        this.mapRenderer.addBlock(this.blocks[i]);
      }

      const levelFeaturesResponse = await fetch(APIROUTE(this.gameId, this.levelId) + '/Features');
      if (!levelFeaturesResponse.ok) {
        throw new Error(`Response status: ${levelFeaturesResponse.status}`);
      }

      this.features = (await levelFeaturesResponse.json()).map(FeatureRenderer.transformFeature);

      for (let i = 0; i < this.features.length; i++) {
        await this.featureRenderer.addFeature(this.features[i]);
      }

      const levelItemsResponse = await fetch(import.meta.env.VITE_API_URL + '/Items');
      if (!levelItemsResponse.ok) {
        throw new Error(`Response status: ${levelItemsResponse.status}`);
      }

      this.items = await levelItemsResponse.json();

      const levelCoinagesResponse = await fetch(import.meta.env.VITE_API_URL + '/Coinages');
      if (!levelCoinagesResponse.ok) {
        throw new Error(`Response status: ${levelCoinagesResponse.status}`);
      }

      this.coinages = await levelCoinagesResponse.json();

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
          'Content-Type': 'application/json-patch+json',
          'Authorization': `Bearer ${(await SaveHandler.getAuth())?.accessToken}`
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
          'Content-Type': 'application/json-patch+json',
          'Authorization': `Bearer ${(await SaveHandler.getAuth())?.accessToken}`
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await SaveHandler.getAuth())?.accessToken}`
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
      block = { ...block, placedBlockId: newBlock.placedBlockId };

      this.blocks.push(block);
      this.mapRenderer.addBlock(block);
    } catch (err: unknown) {
      console.error(err);
    }
  }

  async removeBlock(block: PlacedBlock) {
    try {
      const blockResponse = await fetch(APIROUTE(this.gameId, this.levelId) + `/Blocks/${block.placedBlockId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(await SaveHandler.getAuth())?.accessToken}`
        }
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await SaveHandler.getAuth())?.accessToken}`
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
      feature = { ...feature, featureId: newFeature.featureId };

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
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(await SaveHandler.getAuth())?.accessToken}`
        }
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

  // static async createLevel(gameId: number, mapRenderer: MapRenderer, options: LevelOptions, onReady: (level: Level) => void, player : Player) {
  //   try {
  //     const levelResponse = await fetch(APIROUTE(gameId), {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${(await SaveHandler.getAuth())?.accessToken}`
  //       },
  //       body: JSON.stringify({
  //         name: options.name
  //       })
  //     })
  //     if (!levelResponse.ok) {
  //       throw new Error(`Response status: ${levelResponse.status}`);
  //     }
  //     const level: LevelType = await levelResponse.json();

  //     return new Level(level.gameId, level.levelId, mapRenderer, onReady, player);
  //   } catch (err: unknown) {
  //     console.error(err);
  //   }
  // }
}

export default Level