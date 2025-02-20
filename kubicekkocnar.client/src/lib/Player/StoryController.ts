import { Scroll } from "../features/Scroll";

export class StoryController{

  public scrolls : Scroll[] = [];

  public AddStory(sc : Scroll) {
    if (this.scrolls.includes(sc)) return;
    this.scrolls.push(sc);
  }
}
