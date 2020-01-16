import { Query } from '../business/objects/modal';
import { Reducer } from 'redux';
import { ModalActions, OPEN_MODAL, CLOSE_MODAL, OPEN_NOTIFICATION_MODAL } from '../actions/modalActions';
import { IModalState } from '../business/objects/store';

class ModalState implements IModalState {
  constructor(
    public modal_name: string = '',
    public modal_text: string = '',
    public modal_query: Query = { text: '', number: 0})
    {

  }
}

const modalReducer: Reducer<ModalState, ModalActions> = (state = new ModalState(), action:ModalActions) => {
  switch(action.type){
    case OPEN_MODAL:
      return new ModalState(action.modal_name, '', {text: '', number: 0});
    case CLOSE_MODAL:
      return new ModalState('', '', { text: '', number: 0 });
    case OPEN_NOTIFICATION_MODAL:
      return new ModalState(action.modal_name, action.text, { text: '', number: 0});
    default:
      return state;
  }
}

export default modalReducer;
