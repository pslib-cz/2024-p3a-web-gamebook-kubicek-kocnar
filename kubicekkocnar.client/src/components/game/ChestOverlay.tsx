
import '../ItemController.css'
import { AppContext } from '../AppContextProvider';
import { useContext, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
export function ChestOverlay(chest) {
  
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

      if (!opened) {
        document.exitPointerLock();
      }
      else 
      {
        // request pointer lock
      }
    }

  };

  return (
    <>
    { opened &&
      <div id="inventoryui">
        <div className='ui-item'>
        <div>
        <div> 
          <h1>This inventory shall be cr</h1>
        </div>
      </div>
      </div>
    </div>
    }
    </>
  )
}

