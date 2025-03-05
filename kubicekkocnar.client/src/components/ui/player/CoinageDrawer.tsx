import { Coinage } from "../../../types/Coinage";
import styles from './player.module.css';

export function CoinagesDrawer({ coinages, count }: { coinages: Coinage[], count: number[] }) {
  return (
    <div className={styles.coinagesDrawer}>
      {coinages.map((coinage, x) => <CoinageDrawer key={x} coinage={coinage} count={count[x]} />)}
    </div>
  )
}

function CoinageDrawer({ coinage, count }: { coinage: Coinage, count: number }) {
  return (
    <div className={styles.coinageDrawer}>
      <p>{coinage.name}: {count}</p>
    </div>
  )
}