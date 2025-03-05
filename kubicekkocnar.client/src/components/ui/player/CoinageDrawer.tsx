import { Coinage } from "../../../types/Coinage";
import styles from './player.module.css';

export function CoinageDrawer({ coinage, count }: { coinage: Coinage, count: number }) {
  return (
    <div className={styles.coinageDrawer}>
      <p>{coinage.name}: {count}</p>
    </div>
  )
}