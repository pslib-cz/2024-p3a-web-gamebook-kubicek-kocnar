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
  const { player, setPlayer } = useContext(AppContext);
  const [img, setImg] = useState("");

  handlePlayerMouseClick = () => {
    setUseItem(true);
  };

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      player?.inventory.Scroll(event.deltaY > 0);

      const s = player?.inventory.selectedItem;
      if (!s) return;

      setPlayer(player.Clone());
    };

    window.addEventListener('wheel', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [player]);

  React.useEffect(() => {
    if (useItem) {
      const s = player?.inventory?.selectedItem;
      if (!s) return;

      setImg(s.imgUsed);

      setTimeout(() => { setImg(s.img); }, 500);

      setUseItem(false); // Reset the state
    }
  }, [player?.inventory.selectedItem, useItem]);

  useEffect(() => {
    if (player && player.inventory.selectedItem)
      setImg(player.inventory.selectedItem.img)

  }, [player]);

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

export function getHandlePlayerMouseClick(): (item: Item | null) => void | null {

  return () => handlePlayerMouseClick && handlePlayerMouseClick();
}