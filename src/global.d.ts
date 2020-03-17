import { Logger } from "./components/Logger";

declare global {
  interface Window {
    logger: Logger;
  }
}
