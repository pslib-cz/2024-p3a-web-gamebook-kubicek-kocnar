/* eslint-disable react-refresh/only-export-components */
import { useState, createContext } from 'react';
import './ItemController.css'
import React from 'react';
import { Item } from '../types/Item';
import { useContext } from 'react';
import { AppContext } from './AppContextProvider';

/*
interface Item {
    img : string;
    imgUsed : string;
}
*/

const demoItem : Item = {
    img: "/Fr.png",
    imgUsed: "/Fr1.png",
}

const ItemContext = createContext<{ setUseItem: React.Dispatch<React.SetStateAction<boolean>> | null }>({ setUseItem: null });

interface HandlePlayerMouseClickProps {
  (): void;
}

let handlePlayerMouseClick: HandlePlayerMouseClickProps | null = null;

export function ItemUI() {
  const [useItem, setUseItem] = useState(false);

  const { playerInventory } = useContext(AppContext);

  handlePlayerMouseClick = () => {

    console.log(`Using item ${playerInventory.current?.GetSelectedItem()?.img}`);

    setUseItem(true);
  };

  React.useEffect(() => {
    if (useItem) {

      setImg(demoItem.imgUsed);

      setTimeout(() => {
          setImg(demoItem.img);
      }, 500);

      console.log("Item used");
      setUseItem(false); // Reset the state
    }
  }, [useItem]);

  const [img, setImg] = useState<string>(demoItem.img);

  return (
    <ItemContext.Provider value={{ setUseItem }}>
      <div className='overlay'>
        <div className="ui-item">
          <img src={img}></img>
        </div>
      </div>
    </ItemContext.Provider>
  )
}

export function getHandlePlayerMouseClick() : (item : Item | null) => void | null {

  return () => handlePlayerMouseClick && handlePlayerMouseClick();
}