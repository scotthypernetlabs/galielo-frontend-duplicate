import store from "../../store/store";
import { IUserStateRepository } from "../interfaces/IUserStateRepository";

export class UserStateRepository implements IUserStateRepository {
    
    // TODO: Fix this, should just return a bool
    public loggedIn(resolve: Function, reject: Function) {
        let state = store.getState();
        if (state.users.currentUser.user_id) {
            resolve();
        } else {
            reject();
        }
    }

    public hasWallet(resolve: Function, reject: Function) {
        let state = store.getState();
        if (state.users.currentUser.wallet) {
            resolve();
        } else {
            reject();
        }
    }

}