
/* eslint-disable react-refresh/only-export-components */
import './ItemController.css'
import { AppContext } from './AppContextProvider';
import { useContext } from 'react';

export function UIOverlay() {
  
  const { playerInventory } = useContext(AppContext);

  return (
    <div className='overlay'>
      <div className='ui-item'>
        <div>
          <h1>This inventory shall be ({playerInventory.current ? playerInventory.current.GetSelectedItem()?.toString() : 'NULL'})</h1>
        </div>
      </div>
    </div>
  )
}