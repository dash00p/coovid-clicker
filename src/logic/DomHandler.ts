import { commarize } from "../helper/Dom.helper";

// this class is used to handle DOM interaction
class DomHandler {

  static updateTitle(value: number): void {
    document.title = `${commarize(value, 1)} doses | Coovid Clicker`;
  }
}

export default DomHandler;
