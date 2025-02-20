import { Coinage } from "../types/Coinage";
import { DELETE, GET, POST } from "./API";

// const URL: string = `${import.meta.env.VITE_API_URL}/Coinages`;

export async function GetCoinages(): Promise<Coinage[]> {
  return await GET("Coinages") as Coinage[];
}

export async function DeleteCoinage(coinageId: number): Promise<void> {
  return await DELETE("Coinages", coinageId);
}

export async function PostCoinage(coinage: Coinage): Promise<void> {

  return await POST("Coinages", coinage);

  // try {
  //   const blocksResponse = await fetch(URL, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(coinage)
  //   });
  //   if (!blocksResponse.ok) {
  //     throw new Error(`Response status: ${blocksResponse.status}`);
  //   }

  // } catch (err: unknown) {
  //   console.error(err);
  // }
}
