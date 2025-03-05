import { Scroll } from "../../../lib/features/Scroll";
import styles from './player.module.css';

export function StorysdDrawer({ scrolls }: { scrolls: Scroll[] }) {
  return (
    <div className={styles.storysDrawer}>
      {scrolls.map((a, x) => <StoryDrawer key={x} scroll={a} />)}
    </div>
  )
}

function StoryDrawer({ scroll }: { scroll: Scroll }) {
  return (
    <div className={styles.storyDrawer}>
      <p>{scroll.params.text}</p>
    </div>
  )
}