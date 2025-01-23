import React, { useEffect, useState } from 'react';
import { Coinage } from '../types/Coinage';
import { ItemUpgrade } from '../types/ItemUpgrade';
import { GetCoinages } from '../api/Coinages';
import { GetUpgrades, PostUpgrade } from '../api/Upgrades';
import { Item } from '../types/Item';
import { DeleteItem, GetItems, PostItem } from '../api/Items';
import { useForm } from 'react-hook-form';
import { EnemyType } from '../types/Enemy';
import { AddEnemy, FetchEnemies } from '../api/Enemies';

const Editor: React.FC = () => {

  const [coinages, setCoinages] = useState<Coinage[]>();
  const [upgrades, setUpgrades] = useState<ItemUpgrade[]>();
  const [items, setItems] = useState<Item[]>();
  const [enemies, setEnemies] = useState<EnemyType[]>();

  useEffect(() => {    
    (async () => {      
      setCoinages(await GetCoinages());
      setUpgrades(await GetUpgrades());
      setItems(await GetItems());
      setEnemies(await FetchEnemies());
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

  const defaultEnemy = {
    name: '',
    health: 0,
    damage: 0,
    attackSpeed: 0,
    speed: 0,
    isGhost: false
  };

  return (
    <div>
      <h1>EdItOr</h1>
      <div>
        <h2>Items</h2>
        <AddItemDrawer item={defaultItem} postFunction={PostItem}/>
        <ItemDrawers items={items} deleteFunction={DeleteItem}/>
      </div>
      <div>
        <h2>Upgrades</h2>
        <AddItemDrawer item={defaultUpgrade} postFunction={PostUpgrade}/>
        <ItemDrawers items={upgrades}/>
      </div>
      <div>
        <h2>Coinages</h2>
        <AddItemDrawer item={defaultCoinage} postFunction={PostItem}/>
        <ItemDrawers items={coinages}/>
      </div>
      <div>
        <h2>Enemies</h2>
        <AddItemDrawer item={defaultEnemy} postFunction={AddEnemy}/> 
        <ItemDrawers items={enemies}/>
      </div>
    </div>
  );
};

function ItemDrawers({items, deleteFunction} : {items? : any[], deleteFunction : (arg0 : number) => void})
{
  if (!items) return <div></div>;

  const drawers : JSX.Element[] = [];

  let keyId = 0;

  for(const item of items)
  {
    drawers.push(
      <ItemDrawer item={item} topLevel key={keyId++}/>
    );
  }

  return (
    <div>
      {drawers}
    </div>
  );
}

function ItemDrawer({item, topLevel} : {item : any, topLevel : boolean})
{
  const fields : JSX.Element[] = [];

  let keyId = 0;

  for(const key in item)
  {
    if (typeof item[key] === 'object' && item[key] !== null) {
      fields.push(
        <div key={keyId++}>
          <p>{key}:</p>
          <ItemDrawer item={item[key]} topLevel={false} />
        </div>
      );
    } else {
      fields.push(<p>{key}: {item[key]}</p>);
    }
  }

  return (
    <div>
      {topLevel && <p>-------------</p>}
      {fields}
    </div>
  );
}

function AddItemDrawer({item, postFunction} : {item : any, postFunction : any})
{
  const {register, handleSubmit} = useForm();
  const inputs: JSX.Element[] = [];

  for (const key in item) {
    if (typeof key === 'string') {
      inputs.push(<input key={key} {...register(key)} placeholder={key} type="text" id={key} name={key} />);
      continue;
    }
    
    if (typeof key === 'number') {
      inputs.push(<input key={key} {...register(key)} placeholder={key} type="number" id={key} name={key} />);
      continue;
    }
  }

  return (
    <form onSubmit={handleSubmit((item) => {console.log(item); postFunction(item); })}>
      {inputs}
      <button type="submit">Add</button>
    </form>
  );
}

export default Editor;