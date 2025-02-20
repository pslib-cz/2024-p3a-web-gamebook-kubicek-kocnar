import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Coinage } from '../types/Coinage';
import { ItemUpgrade } from '../types/ItemUpgrade';
import { GetCoinages } from '../api/Coinages';
import { GetUpgrades } from '../api/Upgrades';
import { Item } from '../types/Item';
import { GetItems } from '../api/Items';
import { useForm } from 'react-hook-form';
import { EnemyType } from '../types/Enemy';
import { FetchEnemies } from '../api/Enemies';
import { DELETE, objTypes, PATCH, POST } from '../api/API';
import styles from './editor.module.css';
import Texture from '../types/Texture';
import { DeleteTexture, FetchTextures, GetTextureURL } from '../api/Textures';
import SaveHandler, { Save } from '../lib/SaveHandler';
import AuthWidget from '../components/auth/AuthWidget';

const Editor = () => {
  const auth: MutableRefObject<Save['auth'] | null> = useRef(null);

  const [textures, setTextures] = useState<Texture[]>();
  const [coinages, setCoinages] = useState<Coinage[]>();
  const [upgrades, setUpgrades] = useState<ItemUpgrade[]>();
  const [items, setItems] = useState<Item[]>();
  const [enemies, setEnemies] = useState<EnemyType[]>();

  async function Reload() {
    setTextures(await FetchTextures());
    setCoinages(await GetCoinages());
    setUpgrades(await GetUpgrades());
    setItems(await GetItems());
    setEnemies(await FetchEnemies());
    auth.current = await SaveHandler.getAuth();

    console.log(auth.current);
  }

  useEffect(() => { Reload(); }, []);

  const defaultItem = { name: '', description: '' };
  const defaultUpgrade = { description: '', inputItemId: 0, outputItemId: 0 };
  const defaultCoinage = { name: '' };
  const defaultEnemy = { name: '', health: 0, damage: 0, attackSpeed: 0, speed: 0, isGhost: false, textureId: 1 };

  return (
    <div>
      {auth.current && <AuthWidget auth={auth.current} />}
      <h1>EdItOr</h1>
      <div>
        <h2>Textures</h2>
        <ItemDrawers
          items={textures}
          deleteFunction={async (id) => { await DeleteTexture(id); Reload() }}
          patchFunction={async (id, key, value) => { await PATCH("Textures", id, key, value); Reload(); }}
        />
      </div>
      <div>
        <h2>Items</h2>
        <CompleteDrawer defaultItem={defaultItem} items={items || []} Reload={Reload} objType="Items" />
      </div>
      <div>
        <h2>Upgrades</h2>
        <CompleteDrawer defaultItem={defaultUpgrade} items={upgrades || []} Reload={Reload} objType="ItemUpgrades" />
      </div>
      <div>
        <h2>Coinages</h2>
        <CompleteDrawer defaultItem={defaultCoinage} items={coinages || []} Reload={Reload} objType="Coinages" />
      </div>
      <div>
        <h2>Enemies</h2>
        <CompleteDrawer defaultItem={defaultEnemy} items={enemies || []} Reload={Reload} objType="Enemies" />
      </div>
    </div>
  );
};

function CompleteDrawer(
  {defaultItem, items, Reload, objType} : 
  {defaultItem: unknown, items: unknown[], Reload: () => void, objType: objTypes}) {
  return (
    <>
      <AddItemDrawer
        item={defaultItem}
        postFunction={async (item) => { await POST(item, objType); Reload(); }}
      />
      <ItemDrawers
        items={items}
        deleteFunction={async (id) => { await DELETE(objType, id); Reload() }}
        patchFunction={async (id, key, value) => { await PATCH(objType, id, key, value); Reload(); }}
      />
    </>
  )
}

function ItemDrawers({ items, deleteFunction, patchFunction, }:
  { items?: unknown[], deleteFunction: (arg0: number) => void, patchFunction: (id: number, key: string, value: string) => void }) {
  if (!items) return <div></div>;

  const drawers: JSX.Element[] = [];

  let keyId = 0;

  for (const item of items) {
    drawers.push(
      <ItemDrawer item={item} topLevel key={keyId++} deleteFunction={deleteFunction} patchFunction={patchFunction} />
    );
  }

  return (
    <div className={styles.itemswrapper}>
      {drawers}
    </div>
  );
}

function ItemDrawer(
  { item, topLevel, deleteFunction, patchFunction }:
    { item: any, topLevel: boolean, deleteFunction?: (arg0: number) => void, reloadFunction?: () => void, patchFunction?: (id: number, key: string, value: string) => void }) {
  const fields: JSX.Element[] = [];

  let keyId = 0;

  for (const key in item) {
    if (typeof item[key] === 'object') {
      fields.push(
        <div key={keyId++}>
          <p>{key}:</p>
          <ItemDrawer key={key} item={item[key]} topLevel={false} />
        </div>
      );
    } else {

      if (key == "itemId" || key == "itemUpgradeId" || key == "coinageId" || key == "enemyId" || key == "textureId") {
        fields.push(
          <>
            <p className={styles.field} key={key}>{key}: {item[key]}</p>
            {
              key == "textureId" && <img style={{ width: 100 }} src={GetTextureURL(item[key])} alt="texture" />
            }
          </>
        )
        continue;
      }

      if (deleteFunction) {
        fields.push(
          <div key={key} className={[styles.flexfield, styles.field].join(' ')}>
            <p key={keyId++}>{key}</p>
            <input defaultValue={item[key]} onChange={(e) => {
              patchFunction && patchFunction(item.itemId || item.itemUpgradeId || item.coinageId || item.enemyId || item.textureId, key, e.currentTarget.value)
            }} />
          </div>
        );
      }
      else {
        fields.push(<p className={styles.field} key={key}>{key}: {item[key]}</p>);
      }

    }
  }

  return (
    <div className={`${styles.drawer} ${topLevel ? styles.topLevel : ""}`}>
      {fields}
      {deleteFunction && <button onClick={() =>
        deleteFunction(item.itemId || item.itemUpgradeId || item.coinageId || item.enemyId || item.textureId)
      }>Delete</button>}
    </div>
  );
}

function AddItemDrawer({ item, postFunction }: { item: any, postFunction: (arg: any) => void }) {
  const { register, handleSubmit } = useForm();
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
    <form onSubmit={handleSubmit((item) => { console.log(item); postFunction(item); })}>
      {inputs}
      <button type="submit">Add</button>
    </form>
  );
}

export default Editor;