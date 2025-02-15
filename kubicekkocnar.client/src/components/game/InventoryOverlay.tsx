
import '../ItemController.css'
import { AppContext } from '../AppContextProvider';
import { useContext, useEffect, useState } from 'react';
import { Coinage } from '../../types/Coinage';
import { ItemUpgrade } from '../../types/ItemUpgrade';
import { CoinageDrawer } from '../CoinageDrawer';

export function UIOverlay() {
  const { playerInventory } = useContext(AppContext);
  const [opened, setOpened] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });

  const handleKeyPress = (event: KeyboardEvent) => {

    if (event.key === 'e') {
      setOpened((a) => !a);

      if (!opened) {
        document.exitPointerLock();
      }
      else {
        // request pointer lock
      }
    }
  };

  useEffect(
    () => console.log("INVENTORY " + playerInventory)
    , [playerInventory]);

  return (
    <>
      {opened &&
        <div id="inventoryui">
          <div className='ui-item'>
            <div>
              <div>
                <h1>This inventory shall be ({playerInventory ? "1" : "fr"})</h1>
                {
                  playerInventory?.coinage.map((a: Coinage, x: number) => <CoinageDrawer key={x} coinage={a} count={-1} />)
                }
                <p>UPGRADES</p>
                {
                  playerInventory?.upgrades.map((a, x) => <ItemUpgradeDrawer key={x} upgrade={a} />)
                }
              </div>
            </div>
          </div>
        </div>
      }

    </>
  )
}

function ItemUpgradeDrawer({ upgrade }: { upgrade: ItemUpgrade }) {
  const { playerInventory, setPlayerInventory } = useContext(AppContext);

  return (
    <div
      onClick={
        () => {

          if (!playerInventory?.ItemIsInHotbar(upgrade.inputItem) ||
            !playerInventory?.IsCostSufficient(upgrade.cost)) return;

          playerInventory?.RemoveItemFromHotbar(upgrade.inputItem);
          playerInventory?.AddItemIntoHotbar(upgrade.outputItem);
          setPlayerInventory(playerInventory!.Clone());
        }
      }
      style={{ border: "1px solid black", width: "fit-content", margin: "auto" }}
    >
      <p>{upgrade.description}</p>
      <p>{upgrade.inputItem.name} to {upgrade.outputItem.name}</p>
      {upgrade.cost && upgrade.cost.map((a, x) => <CoinageDrawer key={x} coinage={a.coinage} count={a.cost} />)}
      {playerInventory?.IsCostSufficient(upgrade.cost) ? <p>Can afford</p> : <p>Cannot afford</p>}
      {playerInventory?.ItemIsInHotbar(upgrade.inputItem) ? <p>Item in hotbar</p> : <p>Item not in hotbar</p>}
    </div>
  )
}

