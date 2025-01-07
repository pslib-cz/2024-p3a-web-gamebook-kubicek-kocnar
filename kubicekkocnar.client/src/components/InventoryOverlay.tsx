
import './ItemController.css'
import { AppContext } from './AppContextProvider';
import { useContext, useEffect, useState } from 'react';
import { Coinage } from '../types/Coinage';
import { ItemUpgrade } from '../types/ItemUpgrade';

export function UIOverlay() {
  
  const { playerInventory } = useContext(AppContext);

  const [opened, setOpened] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });

  const handleKeyPress = (event : KeyboardEvent) => {

    if (event.key === 'e') {
      setOpened((a) => !a);

      if (opened) {        
        document.exitPointerLock();
      }
      else 
      {
        // request pointer lock
      }
    }

  };

  useEffect(
    () => console.log("INVENTORY " + playerInventory)
  ,[playerInventory]);

  return (
    <>
    { opened &&
      <div>
        <div className='ui-item'>
        <div>
        <div> 
          <h1>This inventory shall be ({playerInventory ? "1" : "fr"})</h1>
          {
            playerInventory?.coinage.map((a : Coinage, x : number) => <CoinageDrawer key={x} coinage={a} />)
          }
          <p>------- UPGRADES</p>
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

function CoinageDrawer({coinage} : {coinage: Coinage})
{
  return (
    <div>
      <p>{coinage.name}</p>
    </div>
  )
}

function ItemUpgradeDrawer({upgrade} : {upgrade: ItemUpgrade})
{
  const { playerInventory } = useContext(AppContext);

  return (
    <div
      onClick={
        () => console.log("UPGRADE CLICKED")
      }
      style={{border: "1px solid black", width: "fit-content", margin: "auto"}}
    >
      <p>{upgrade.description}</p>
      <p>{upgrade.inputItem.name} to {upgrade.outputItem.name}</p>
      {upgrade.cost && upgrade.cost.map((a, x) => <CoinageDrawer key={x} coinage={a.coinage} />)}
      {playerInventory?.IsCostSufficient(upgrade.cost) ? <p>Can afford</p> : <p>Cannot afford</p>}
    </div>
  )
}