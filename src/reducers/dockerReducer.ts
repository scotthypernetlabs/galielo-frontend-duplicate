import { Reducer } from 'redux';
import { IDockerState } from '../business/objects/store';
import { DockerInputState } from '../business/objects/dockerWizard';
import { DockerActions, DOCKER_WIZARD_INPUT } from '../actions/dockerActions';

class DockerState implements IDockerState {
  constructor(
    public inputState:DockerInputState = {
      selectedFramework: null,
      dockerTextFile: '',
      frameworkText: '',
      dependencyText: '',
      dependencyInput: '',
      target: '',
      entrypoint: '',
      fileUploadText: '',
      fileUploadHover: false,
      disabled: false
    }
  ){

  }
}

const dockerReducer: Reducer<DockerState, DockerActions> = (state = new DockerState(), action:DockerActions) => {
  switch(action.type){
    case DOCKER_WIZARD_INPUT:
        return Object.assign({}, state, {inputState: Object.assign({}, state.inputState, action.inputObject )})
    default:
      return state;
  }
}

export default dockerReducer;
