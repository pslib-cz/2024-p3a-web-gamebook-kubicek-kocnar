import { Coinage } from "../types/Coinage";
import { DELETE, GET, POST } from "./API";

export async function GetCoinages(): Promise<Coinage[]> {
  return await GET("Coinages") as Coinage[];
}

export async function DeleteCoinage(coinageId: number): Promise<void> {
  return await DELETE("Coinages", coinageId);
}

export async function PostCoinage(coinage: Coinage): Promise<void> {
  return await POST("Coinages", coinage);
}
