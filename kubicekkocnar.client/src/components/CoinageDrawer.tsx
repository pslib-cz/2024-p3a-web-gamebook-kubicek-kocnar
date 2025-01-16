import { Coinage } from "../types/Coinage";

export function CoinageDrawer({coinage, count} : {coinage: Coinage, count: number})
{
  return (
    <div>
      <p>{coinage.name}: {count}</p>
    </div>
  )
}