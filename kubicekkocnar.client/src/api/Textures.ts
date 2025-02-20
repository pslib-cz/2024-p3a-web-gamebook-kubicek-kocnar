import Texture from "../types/Texture";
import { DELETE, PATCH, POST } from "./API";

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
  return await POST("Textures", texture);
}

export async function DeleteTexture(textureId: number): Promise<void> {
  await DELETE("Textures", textureId);
}

export async function PatchTexture(textureId: number, key: string, value: unknown): Promise<void> {
  await PATCH("Textures", textureId, key, value);
}

export function GetTextureURL(textureId: number) {
  return `${URL}/${textureId}/Image`;
}