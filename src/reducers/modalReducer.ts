import {
  CLOSE_MODAL,
  ModalActions,
  OPEN_DOCKER_WIZARD,
  OPEN_MODAL,
  OPEN_NOTIFICATION_MODAL,
  OPEN_QUERY_MODAL
} from "../actions/modalActions";
import { IModalState } from "../business/objects/store";
import { Reducer } from "redux";

class ModalState implements IModalState {
  constructor(
    public modal_name: string = "",
    public modal_text: string = "",
    public modal_query: any = null
  ) {}
}

const modalReducer: Reducer<ModalState, ModalActions> = (
  state = new ModalState(),
  action: ModalActions
) => {
  switch (action.type) {
    case OPEN_MODAL:
      return new ModalState(action.modal_name, "", null);
    case CLOSE_MODAL:
      return new ModalState("", "", null);
    case OPEN_NOTIFICATION_MODAL:
      return new ModalState(action.modal_name, action.text, null);
    case OPEN_DOCKER_WIZARD:
      return new ModalState(
        "Docker Wizard",
        action.directoryName,
        action.fileList
      );
    case OPEN_QUERY_MODAL:
      return new ModalState("Query", "", action.query);
    default:
      return state;
  }
};

export default modalReducer;
