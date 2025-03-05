
import '../../ItemController.css'
import { AppContext } from '../../AppContextProvider';
import { useContext, useEffect, useState } from 'react';
import { Coinage } from '../../../types/Coinage';
import { ItemUpgradeDrawer } from './ItemUpgradeDrawer';
import { CoinageDrawer } from './CoinageDrawer';
import { StoryDrawer } from './StoryDrawer';

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
                  player?.story.scrolls.map((a, x) => <StoryDrawer key={x} scroll={a} />)
                }
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}