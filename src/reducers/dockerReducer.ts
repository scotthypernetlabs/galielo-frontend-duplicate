import { DOCKER_WIZARD_INPUT, DockerActions } from "../actions/dockerActions";
import { DockerInputState } from "../business/objects/dockerWizard";
import { IDockerState } from "../business/objects/store";
import { Reducer } from "redux";

class DockerState implements IDockerState {
  constructor(
    public inputState: DockerInputState = {
      selectedFramework: null,
      dockerTextFile: "",
      frameworkText: "",
      dependencyText: "",
      dependencyInput: "",
      target: "",
      entrypoint: "",
      fileUploadText: "",
      fileUploadHover: false,
      disabled: false
    }
  ) {}
}

const dockerReducer: Reducer<DockerState, DockerActions> = (
  state = new DockerState(),
  action: DockerActions
) => {
  switch (action.type) {
    case DOCKER_WIZARD_INPUT:
      return Object.assign({}, state, {
        inputState: Object.assign({}, state.inputState, action.inputObject)
      });
    default:
      return state;
  }
};

export default dockerReducer;
