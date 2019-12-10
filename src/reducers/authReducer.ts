import { Reducer } from 'redux';
import { AuthActions, RECEIVE_AUTH } from '../actions/authActions';
import { IAuthState } from '../business/objects/auth';

class AuthState implements IAuthState {
  constructor(public auth: any = {}){

  }
}

const authReducer: Reducer<AuthState, AuthActions> = (state = new AuthState(), action: AuthActions) => {
  switch(action.type){
    case RECEIVE_AUTH:
      return Object.assign({}, state, { auth: action.auth });
    default:
      return state;
  }
}

export default authReducer; 
