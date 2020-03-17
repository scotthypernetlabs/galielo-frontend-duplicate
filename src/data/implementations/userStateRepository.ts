import { IUserStateRepository } from "../interfaces/IUserStateRepository";
import store from "../../store/store";

export class UserStateRepository implements IUserStateRepository {
  // TODO: Fix this, should just return a bool
  public loggedIn() {
    const state = store.getState();
    return Promise.resolve(state.users.currentUser.user_id != null);
  }

  public hasWallet() {
    const state = store.getState();
    return Promise.resolve(state.users.currentUser.wallets.length > 0);
  }
}
