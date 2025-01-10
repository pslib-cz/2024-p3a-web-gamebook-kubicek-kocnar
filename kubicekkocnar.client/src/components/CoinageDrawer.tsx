import { Coinage } from "../types/Coinage";

export function CoinageDrawer({coinage} : {coinage: Coinage})
{
  return (
    <div>
      <p>{coinage.name}</p>
    </div>
  )
}