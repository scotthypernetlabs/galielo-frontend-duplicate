import { Reducer } from "redux";
import { UIActions, FINISH_LOADING } from "../actions/uiActions";
import { IUIState } from "../business/objects/store";

class UIState implements IUIState {
  constructor(
    public loadFinished: boolean = false
  ){

  }
}

const uiReducer: Reducer<UIState, UIActions> = (state = new UIState(), action:UIActions) => {
  switch(action.type){
    case FINISH_LOADING:
      return Object.assign({}, state, {loadFinished: true});
    default:
      return state;
  }
}

export default uiReducer;
