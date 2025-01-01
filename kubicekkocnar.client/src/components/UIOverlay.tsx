
/* eslint-disable react-refresh/only-export-components */
import './ItemController.css'
import { AppContext } from './AppContextProvider';
import { useContext, useEffect, useState } from 'react';
import { Coinage } from '../types/Coinage';

export function UIOverlay() {
  
  const { playerInventory } = useContext(AppContext);

  const [opened, setOpened] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleKeyPress = (event : any) => {

    if (event.key === 'e') {
      setOpened((a) => !a);
    }

  };

  useEffect(
    () => console.log("INVENTORY " + playerInventory)
  ,[playerInventory]);

  return (
    <div className='overlay'>
      <div className='ui-item'>
        {
          opened && 
          <div>
            <div> 
              <h1>This inventory shall be ({playerInventory ? "1" : "fr"})</h1>
              {
                playerInventory?.coinage.map((a : Coinage, x : number) =>{
                  return <p key={x}>{a.name}</p>
                })
              }
              <p>------- UPGRADES</p>
              {
                playerInventory?.upgrades.map((a, x) => {
                  return <div key={x}>
                    <p>{a.description}</p>
                    <p>Cost: {a.cost[0].cost} {a.cost[0].coinage.name}</p>                    
                  </div>
                })
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}