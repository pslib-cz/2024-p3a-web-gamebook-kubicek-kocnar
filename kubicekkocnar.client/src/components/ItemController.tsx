/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useEffect } from 'react';
import './ItemController.css'
import React from 'react';
import { Item } from '../types/Item';
import { useContext } from 'react';
import { AppContext } from './AppContextProvider';

const ItemContext = createContext<{ setUseItem: React.Dispatch<React.SetStateAction<boolean>> | null }>({ setUseItem: null });

interface HandlePlayerMouseClickProps {
  (): void;
}

let handlePlayerMouseClick: HandlePlayerMouseClickProps | null = null;

export function ItemUI() {
  const [useItem, setUseItem] = useState(false);
  const { playerInventory, setPlayerInventory } = useContext(AppContext);
  const [img, setImg] = useState("");

  handlePlayerMouseClick = () => {
    console.log(`Using item ${playerInventory?.selectedItem?.img}`);
    setUseItem(true);
  };

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      playerInventory?.Scroll(event.deltaY > 0);

        const s = playerInventory?.selectedItem;
        if (!s) return;

        setPlayerInventory(playerInventory.Clone());
    };

    window.addEventListener('wheel', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [playerInventory]);

  React.useEffect(() => {
    if (useItem) {      
      const s = playerInventory?.selectedItem      
      if (!s) return;

      setImg(s.imgUsed);

      setTimeout(() => {
        setImg(s.img);
      }, 500);

      console.log("Item used");
      setUseItem(false); // Reset the state
    }
  }, [playerInventory?.selectedItem, useItem]);

  useEffect(() =>{
    if (playerInventory && playerInventory.selectedItem)
      setImg(playerInventory.selectedItem.img)

  }, [playerInventory]);

  return (
    <ItemContext.Provider value={{ setUseItem }}>
      <div className='overlay'>
        <div className="ui-item">
          {
            img != "" && 
            <img src={img}></img>
          }
        </div>
      </div>
    </ItemContext.Provider>
  )
}

export function getHandlePlayerMouseClick() : (item : Item | null) => void | null {

  return () => handlePlayerMouseClick && handlePlayerMouseClick();
}