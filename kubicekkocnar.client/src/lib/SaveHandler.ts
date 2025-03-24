import { Quaternion, Vector3 } from "three";
import { Inventory } from "./Player/Inventory";
import { Player } from "./Player/Player";
import { StoryController } from "./Player/StoryController";
import { apiURL } from "../env";

export interface Save {
  auth: {
    email: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresAt: number;
  },
  player: {
    inventory: Inventory,
    story: StoryController,
    level: number,
    game: number,
    position: Vector3,
    rotation: Quaternion,
  }
}

export default class SaveHandler {
  static async getAuth(): Promise<Save['auth'] | null> {
    const authRaw = localStorage.getItem('auth');
    if (!authRaw) return null;
    const auth = JSON.parse(authRaw);
    await this.refreshAuth(auth);
    return auth;
  }

  static async refreshAuth(auth: Save['auth']): Promise<void> {
    if (auth) {
      if (auth.expiresAt <= Date.now()) {
        try {
          const response = await fetch(`${apiURL}/account/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: auth.refreshToken }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('auth', JSON.stringify({ ...data, email: auth.email, expiresAt: Date.now() + data.expiresIn * 1000 }));
            console.log('Refresh successful');
          } else {
            console.error('Refresh failed');
          }
        } catch (error) {
          console.error('An error occurred:', error);
          // Handle error
        }
        console.log('Refreshing token');
      }
    }
  }

  static savePlayer(player: Player): void {
    const playerSaveData = {
      inventory: player.inventory,
      story: player.story,
      level: player.scene.userData.level.levelId,
      game: player.scene.userData.level.gameId,
      position: player.controller.playerPosition,
      rotation: player.controller.rotation,
    };

    localStorage.setItem('player', JSON.stringify(playerSaveData));
  }

  static loadPlayer(): Save['player'] | null {
    const playerRaw = localStorage.getItem('player');
    if (!playerRaw) return null;
    return JSON.parse(playerRaw);
  }
}