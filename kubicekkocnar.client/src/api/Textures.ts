import Texture from "../types/Texture";
import { DELETE, PATCH } from "./API";

const URL = `${import.meta.env.VITE_API_URL}/Textures`;

export async function FetchTextures(): Promise<Texture[]> {
  try {
    const texturesResponse = await fetch(URL);
    if (!texturesResponse.ok) {
      throw new Error(`Response status: ${texturesResponse.status}`);
    }

    return await texturesResponse.json();

  } catch (err: unknown) {
    console.error(err);
  }

  return [];
}

export async function addTexture(texture: Texture) {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(texture)
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (err: unknown) {
    console.error(err);
  }
}

export async function DeleteTexture(textureId: number): Promise<void> {
  await DELETE("Textures", textureId);
}

export async function PatchTexture(textureId: number, key: string, value: any): Promise<void> {
  await PATCH("Textures", textureId, key, value);
}

export function GetTextureURL(textureId: number) {
  return `${URL}/${textureId}/Image`;
}