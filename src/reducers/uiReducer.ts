import {
  FINISH_LOADING,
  NOTIFICATIONS_SELECTED,
  NOTIFICATIONS_UNSELECTED,
  UIActions
} from "../actions/uiActions";
import { IUIState } from "../business/objects/store";
import { Reducer } from "redux";

class UIState implements IUIState {
  constructor(
    public loadFinished: boolean = false,
    public notificationsSelected: boolean = false
  ) {}
}

const uiReducer: Reducer<UIState, UIActions> = (
  state = new UIState(),
  action: UIActions
) => {
  switch (action.type) {
    case FINISH_LOADING:
      return Object.assign({}, state, { loadFinished: true });
    case NOTIFICATIONS_SELECTED:
      return Object.assign({}, state, { notificationsSelected: true });
    case NOTIFICATIONS_UNSELECTED:
      return Object.assign({}, state, { notificationsSelected: false });
    default:
      return state;
  }
};

export default uiReducer;
