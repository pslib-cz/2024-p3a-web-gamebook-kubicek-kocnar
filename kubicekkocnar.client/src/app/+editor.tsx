import React, { useEffect, useState } from 'react';
import { Coinage } from '../types/Coinage';
import { ItemUpgrade } from '../types/ItemUpgrade';
import { GetCoinages } from '../api/Coinages';
import { GetUpgrades, PostUpgrade } from '../api/Upgrades';
import { Item } from '../types/Item';
import { DeleteItem, GetItems, PostItem } from '../api/Items';
import { useForm } from 'react-hook-form';

const Editor: React.FC = () => {

  const [coinages, setCoinages] = useState<Coinage[]>();
  const [upgrades, setUpgrades] = useState<ItemUpgrade[]>();
  const [items, setItems] = useState<Item[]>();

  useEffect(() => {    
    (async () => {      
      setCoinages(await GetCoinages());
      setUpgrades(await GetUpgrades());
      setItems(await GetItems());
    })();
  }, []);

  const defaultItem = {
    name: '',
    description: ''
  };

  const defaultUpgrade = {
    description: '',
    inputItemId: 0,
    outputItemId: 0
  };

  const defaultCoinage = {
    name: ''
  };

  return (
    <div>
      <h1>EdItOr</h1>
      <div>
        <h2>Items</h2>
        <div>
          <AddItemDrawer item={defaultItem} postFunction={PostItem}/>
        </div>
        <ul>
          {items?.map((item) => (
            <li key={item.itemId}>
              <div>
                <h3>{item.name} ({item.itemId})</h3>
                <p>{item.description}</p>
                <p>{item.img}</p>
                <img src={item.img} alt={item.name} />
                <p onClick={async() => {
                  DeleteItem(item.itemId); 
                  
                  // this use state is broken af
                  setItems(await GetItems());
                                    
                  window.location.reload()
                  }}>DELETE</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Upgrades</h2>
        <div>
          <AddItemDrawer item={defaultUpgrade} postFunction={PostUpgrade}/>
        </div>
        <ul>
          {upgrades?.map((upgrade) => (
            <li key={upgrade.itemUpgradeId}>
              <div>
                <p>{upgrade.description} ({upgrade.itemUpgradeId})</p>
                <p>{upgrade.inputItem.name} --- {upgrade.outputItem.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Coinages</h2>
        <div>
          <AddItemDrawer item={defaultCoinage} postFunction={PostItem}/>
        </div>
        <ul>
          {coinages?.map((coinage) => (
            <li key={coinage.coinageId}>
              <div>
                <p>{coinage.name} ({coinage.coinageId})</p>
                <p>{coinage.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function AddItemDrawer({item, postFunction} : {item : any, postFunction : any})
{
  const {register, handleSubmit} = useForm();
  const inputs: JSX.Element[] = [];

  for (const key in item) {
    if (typeof key === 'string') {
      inputs.push(<input {...register(key)} placeholder={key} type="text" id={key} name={key} />);
      continue;
    }
    
    if (typeof key === 'number') {
      inputs.push(<input {...register(key)} placeholder={key} type="number" id={key} name={key} />);
      continue;
    }
  }

  return (
    <form onSubmit={handleSubmit((item) => {console.log(item); postFunction(item); window.location.reload(); })}>
      {inputs}
      <button type="submit">Add</button>
    </form>
  );
}

export default Editor;