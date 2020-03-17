import { FINISH_LOADING, UIActions } from "../actions/uiActions";
import { IUIState } from "../business/objects/store";
import { Reducer } from "redux";

class UIState implements IUIState {
  constructor(public loadFinished: boolean = false) {}
}

const uiReducer: Reducer<UIState, UIActions> = (
  state = new UIState(),
  action: UIActions
) => {
  switch (action.type) {
    case FINISH_LOADING:
      return Object.assign({}, state, { loadFinished: true });
    default:
      return state;
  }
};

export default uiReducer;
