import store from "../../store/store";
import { IUserStateRepository } from "../interfaces/IUserStateRepository";

export class UserStateRepository implements IUserStateRepository {

    // TODO: Fix this, should just return a bool
    public loggedIn() {
      let state = store.getState();
      return Promise.resolve(state.users.currentUser.user_id != null);
    }

    public hasWallet() {
      let state = store.getState();
      return Promise.resolve(state.users.currentUser.wallets.length > 0);
    }

}
