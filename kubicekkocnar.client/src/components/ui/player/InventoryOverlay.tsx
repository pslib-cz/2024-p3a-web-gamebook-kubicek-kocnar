
import '../../ItemController.css'
import { AppContext } from '../../AppContextProvider';
import { useContext, useEffect, useState } from 'react';
import { ItemUpgradesDrawer } from './ItemUpgradeDrawer';
import { CoinagesDrawer } from './CoinageDrawer';
import { StorysdDrawer } from './StoryDrawer';

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
                <CoinagesDrawer coinages={player!.inventory.coinage} count={player!.inventory.coinageAmount} />
                <p>UPGRADES</p>
                <div style={{ display: 'flex' }}>
                  <ItemUpgradesDrawer upgrades={player!.inventory.upgrades} />
                </div>
              </div>

              <div>
                <h1>Story</h1>
                <StorysdDrawer scrolls={player!.story.scrolls} />
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}