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

  const { playerInventory } = useContext(AppContext);

  const [img, setImg] = useState<string>("");

  handlePlayerMouseClick = () => {

    console.log(`Using item ${playerInventory?.selectedItem?.img}`);

    setUseItem(true);
  };

  React.useEffect(() => {

    console.log("Item selected");

    const s = playerInventory?.selectedItem      
    if (!s) return;

    setImg(s.img);

  }, [playerInventory?.selectedItem]);

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
  }, [useItem, playerInventory?.selectedItem]);

  useEffect(() =>{

    //console.log(playerInventory + " sdds");

    if (playerInventory && playerInventory.selectedItem)
      setImg(playerInventory.selectedItem.img)

  }, [playerInventory, playerInventory?.selectedItem]);

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