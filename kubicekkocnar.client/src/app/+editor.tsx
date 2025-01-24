import React, { useEffect, useState } from 'react';
import { Coinage } from '../types/Coinage';
import { ItemUpgrade } from '../types/ItemUpgrade';
import { DeleteCoinage, GetCoinages, PostCoinage } from '../api/Coinages';
import { DeleteUpgrade, GetUpgrades, PostUpgrade } from '../api/Upgrades';
import { Item } from '../types/Item';
import { DeleteItem, GetItems, PostItem } from '../api/Items';
import { useForm } from 'react-hook-form';
import { EnemyType } from '../types/Enemy';
import { AddEnemy, DeleteEnemy, FetchEnemies } from '../api/Enemies';

const Editor: React.FC = () => {

  const [coinages, setCoinages] = useState<Coinage[]>();
  const [upgrades, setUpgrades] = useState<ItemUpgrade[]>();
  const [items, setItems] = useState<Item[]>();
  const [enemies, setEnemies] = useState<EnemyType[]>();

  async function Reload()
  {
    console.log('Reloading');
    setCoinages(await GetCoinages());
    setUpgrades(await GetUpgrades());
    setItems(await GetItems());
    setEnemies(await FetchEnemies());
  }

  useEffect(() => { Reload(); }, []);

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
        <AddItemDrawer item={defaultItem} postFunction={async (item) => {await PostItem(item); Reload(); }}/>
        <ItemDrawers items={items}  deleteFunction={async (id) => {await DeleteItem(id); Reload()}}/>
      </div>
      <div>
        <h2>Upgrades</h2>
        <AddItemDrawer item={defaultUpgrade} postFunction={async (item) => {await PostUpgrade(item); Reload(); }}/>
        <ItemDrawers items={upgrades} deleteFunction={async (id) => {await DeleteUpgrade(id); Reload()}}/>
      </div>
      <div>
        <h2>Coinages</h2>
        <AddItemDrawer item={defaultCoinage} postFunction={async (item) => {await PostCoinage(item); Reload(); }}/>
        <ItemDrawers items={coinages} deleteFunction={async (id) => {await DeleteCoinage(id); Reload()}}/>
      </div>
      <div>
        <h2>Enemies</h2>
        <AddItemDrawer item={defaultEnemy} postFunction={async (item) => {await AddEnemy(item); Reload(); }}/> 
        <ItemDrawers items={enemies} deleteFunction={async (id) => {await DeleteEnemy(id); Reload()}}/>
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
      <ItemDrawer item={item} topLevel key={keyId++} deleteFunction={deleteFunction}/>
    );
  }

  return (
    <div>
      {drawers}
    </div>
  );
}

function ItemDrawer({item, topLevel, deleteFunction} : {item : any, topLevel : boolean, deleteFunction? : (arg0 : number) => void, reloadFunction? : () => void})
{
  const fields : JSX.Element[] = [];

  let keyId = 0;

  for(const key in item) {
    if (typeof item[key] === 'object') {
      fields.push(
        <div key={keyId++}>
          <p>{key}:</p>
          <ItemDrawer key={key} item={item[key]} topLevel={false} />
        </div>
      );
    } else {
      fields.push(<p key={key}>{key}: {item[key]}</p>);
    }
  }

  return (
    <div>
      {topLevel && <p>-------------</p>}
      {fields}
      {deleteFunction && <button onClick={() => 
        {
          deleteFunction(item.itemId || item.upgradeId || item.coinageId || item.enemyId);
        }
      }>Delete</button>}      
    </div>
  );
}

function AddItemDrawer({item, postFunction} : {item : any, postFunction : (arg : any) => void})
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