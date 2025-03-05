
import '../ItemController.css'
import { AppContext } from '../AppContextProvider';
import { useContext, useEffect, useState } from 'react';
import { Coinage } from '../../types/Coinage';
import { ItemUpgrade } from '../../types/ItemUpgrade';
import { CoinageDrawer } from '../CoinageDrawer';

export function UIOverlay() {
  const { player } = useContext(AppContext);
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
    () => console.log("INVENTORY ", player?.inventory)
    , [player]);

  return (
    <>
      {opened &&
        <div id="inventoryui">
          <div className='ui-item'>
            <div>
              <div>
                <h1>This inventory shall be ({player ? "1" : "fr"})</h1>
                {
                  player?.inventory?.coinage.map((a: Coinage, x: number) => <CoinageDrawer key={x} coinage={a} count={player!.inventory.coinageAmount[x]} />)
                }
                <p>UPGRADES</p>
                <div style={{ display: 'flex' }}>
                  {
                    player?.inventory?.upgrades.map((a, x) => <ItemUpgradeDrawer key={x} upgrade={a} />)
                  }
                </div>
              </div>

              <div>
                <h1>Story</h1>
                {
                  player?.story.scrolls.map((a, x) => <p key={x}>{a.params.text}</p>)
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
  const { player, setPlayer } = useContext(AppContext);

  return (
    <div
      onClick={
        () => {
          if (player?.inventory.ItemIsInHotbar(upgrade.inputItem) ||
            !player?.inventory.IsCostSufficient(upgrade.cost)) return;

          player?.inventory.RemoveItemFromHotbar(upgrade.inputItem);
          player?.inventory.AddItemIntoHotbar(upgrade.outputItem);
          setPlayer(player!.Clone());
        }
      }
      style={{ border: "1px solid black", width: "fit-content", margin: "auto" }}
    >
      <p>{upgrade.description}</p>
      <p>{upgrade.inputItem.name} to {upgrade.outputItem.name}</p>
      {upgrade.cost && upgrade.cost.map((a, x) => <CoinageDrawer key={x} coinage={a.coinage} count={a.cost} />)}
      {player?.inventory.IsCostSufficient(upgrade.cost) ? <p>Can afford</p> : <p>Cannot afford</p>}
      {player?.inventory.ItemIsInHotbar(upgrade.inputItem) ? <p>Item in hotbar</p> : <p>Item not in hotbar</p>}
    </div>
  )
}

