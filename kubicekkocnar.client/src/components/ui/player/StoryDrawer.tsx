import { Scroll } from "../../../lib/features/Scroll";
import styles from './player.module.css';

export function StoryDrawer({ scroll }: { scroll: Scroll }) {
  return (
    <div className={styles.storyDrawer}>
      <p>{scroll.params.text}</p>
    </div>
  )
}