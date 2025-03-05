import { AppContext } from '../../AppContextProvider';
import { useContext } from 'react';
import { ItemUpgrade } from '../../../types/ItemUpgrade';
import { CoinageDrawer } from './CoinageDrawer';
import styles from './player.module.css';

export function ItemUpgradeDrawer({ upgrade }: { upgrade: ItemUpgrade }) {
  const { player, setPlayer } = useContext(AppContext);

  return (
    <div
      onClick={
        () => {
          if (player?.inventory.ItemIsInHotbar(upgrade.inputItem) ||
            !player?.inventory.IsCostSufficient(upgrade.cost)) return;

          player?.inventory.RemoveItemFromHotbar(upgrade.inputItem);
          player?.inventory.AddItemIntoHotbar(upgrade.outputItem);
          setPlayer(player!.Clone());
        }
      }
      className={styles.upgradeDrawer}
    >
      <p>{upgrade.description}</p>
      <p>{upgrade.inputItem.name} to {upgrade.outputItem.name}</p>
      {upgrade.cost && upgrade.cost.map((a, x) => <CoinageDrawer key={x} coinage={a.coinage} count={a.cost} />)}
      {player?.inventory.IsCostSufficient(upgrade.cost) ? <p>Can afford</p> : <p>Cannot afford</p>}
      {player?.inventory.ItemIsInHotbar(upgrade.inputItem) ? <p>Item in hotbar</p> : <p>Item not in hotbar</p>}
    </div>
  )
}