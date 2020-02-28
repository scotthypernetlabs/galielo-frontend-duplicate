import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import React from "react";
import Select from "react-select";
// import Button from '../../css/modules/Button';
import BlenderWizard from "./Blender";
import HecrasWizard from "./HECRAS";
import JuliaWizard from "./Julia";
import PythonWizard from "./Python";
import RWizard from "./R";
import SRH2DWizard from "./SRH2D";
import StataWizard from './Stata';
import { Dispatch } from "redux";
import {
  DockerInputState,
  IDockerInput
} from "../../business/objects/dockerWizard";
import {
  ICloseModal,
  IOpenNotificationModal,
  closeModal,
  openNotificationModal
} from "../../actions/modalActions";
import {
  IReceiveDockerInput,
  receiveDockerInput
} from "../../actions/dockerActions";
import { IStore } from "../../business/objects/store";

type Props = {
  state: DockerInputState;
  openNotificationModal: (
    modal_name: string,
    text: string
  ) => IOpenNotificationModal;
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
  closeModal: () => ICloseModal;
  filePath: string;
};

type State = {
  showDisplayTemplate: boolean;
  useDockerWizard: boolean;
};

class DockerWizard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showDisplayTemplate: false,
      useDockerWizard: false
    };
    this.generateDisplayTemplate = this.generateDisplayTemplate.bind(this);
    this.generateDockerForm = this.generateDockerForm.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.createDockerFile = this.createDockerFile.bind(this);
    this.toggleDisplayTemplate = this.toggleDisplayTemplate.bind(this);
  }

  componentDidMount(){
    this.props.receiveDockerInput({
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
    })
  }

  componentDidUpdate() {
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute(
        "style",
        "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
      );
      tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    }
  }

  createDockerFile(e: any) {
    e.preventDefault();
    const { dockerTextFile } = this.props.state;
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/octet-stream," +
        encodeURIComponent(this.props.state.dockerTextFile)
    );
    element.setAttribute("download", "Dockerfile");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    this.props.openNotificationModal(
      "Notifications",
      "Docker file has been created! Please move the Dockerfile to your project folder and reupload the folder."
    );
  }

  handleSelect(selectedFramework: any) {
    if (selectedFramework.label === "Not Listed") {
      this.props.receiveDockerInput({
        selectedFramework,
        dockerTextFile:
          "#Unfortunately we have yet to setup a semi-automated process for your framework. You can use this editor to create your own Dockerfile."
      });
      this.setState({
        showDisplayTemplate: true
      });
    } else {
      this.props.receiveDockerInput({ selectedFramework });
    }
  }

  handleInput(type: any) {
    return (e: any) => {
      const { value } = e.target;
      this.props.receiveDockerInput({
        [type]: value
      });
    };
  }

  generateDisplayTemplate() {
    const { dockerTextFile } = this.props.state;
    if (!this.state.showDisplayTemplate) {
      return <> </>;
    }
    return (
      <>
        <header className="docker-wizard-header"> Docker File Wizard </header>
        <div className="template-container">
          <textarea
            cols={72}
            value={dockerTextFile}
            className="docker-command"
            onChange={this.handleInput("dockerTextFile")}
          ></textarea>
        </div>
      </>
    );
  }

  generateDockerForm() {
    const { selectedFramework } = this.props.state;
    const options = [
      { value: "python:3.7", label: "Python 3.7" },
      { value: "python:2.7", label: "Python 2.7" },
      { value: "tensorflow/tensorflow:latest-py3", label: "Tensorflow" },
      { value: "r-base", label: "R" },
      { value: "1.1", label: "Julia 1.1" },
      { value: "1.0", label: "Julia 1.0" },
      { value: "hecras", label: "HEC-RAS" },
      { value: "srh2d", label: "SRH-2D" },
      // { value: 'Blender', label: 'Blender'},
      { value: 'stata', label: "Stata"},
      { value: "Not Listed", label: "Not Listed" }
    ];
    let component = null;
    if (selectedFramework) {
      if (
        selectedFramework.label.includes("Python") ||
        selectedFramework.label.includes("Tensorflow")
      ) {
        component = <PythonWizard />;
      }
      if (selectedFramework.label.includes("HEC-RAS")) {
        component = <HecrasWizard />;
      }
      if (selectedFramework.label.includes("SRH-2D")) {
        component = <SRH2DWizard />;
      }
      if (selectedFramework.label.includes("Julia")) {
        component = <JuliaWizard />;
      }
      if (selectedFramework.label === "R") {
        component = <RWizard />;
      }
      if (selectedFramework.label === "Blender") {
        component = <BlenderWizard />;
      }
      if(selectedFramework.label === 'Stata'){
        component = <StataWizard />;
      }
    }
    return (
      <div className="docker-form-container">
        <div className="select-framework">
          <Select
            value={selectedFramework}
            onChange={this.handleSelect}
            options={options}
            placeholder="Select Framework..."
          />
        </div>
        {component}
        <div className="submit-docker-form">{this.generateSubmitForm()}</div>
      </div>
    );
  }

  toggleDisplayTemplate(e: any) {
    e.preventDefault();
    this.setState(prevState => ({
      showDisplayTemplate: !prevState.showDisplayTemplate
    }));
  }

  generateSubmitForm() {
    const { entrypoint } = this.props.state;
    console.log(this.props);
    if (
      entrypoint.length > 0 ||
      this.props.state.dockerTextFile.includes("ENTRYPOINT")
    ) {
      return (
        <>
          <form className="submit-docker-form" onSubmit={this.createDockerFile}>
            <button className="primary-btn">Create Dockerfile</button>
          </form>
        </>
      );
    }
  }

  dockerWizardUi() {
    return (
      <div className="docker-wizard-style" onClick={e => e.stopPropagation()}>
        <div className="docker-wizard-container">
          <div className="docker-wizard-form">{this.generateDockerForm()}</div>
          <div className="docker-wizard-template">
            <button type="button" onClick={this.toggleDisplayTemplate}>
              Display Dockerfile
            </button>
            {this.generateDisplayTemplate()}
          </div>
        </div>
        <div className="bottom-left-button">
          <button
            type="button"
            onClick={this.props.closeModal}
            className="styled-button"
          >
            Quit
          </button>
        </div>
      </div>
    );
  }

  queryModal() {
    return (
      <div className="coming-soon-modal" onClick={this.props.closeModal}>
        <div
          className="coming-soon-modal-inner"
          onClick={e => e.stopPropagation()}
        >
          <p> Docker Wizard </p>
          <h2>
            {" "}
            The root folder does not contain a Dockerfile. Would you like to use the
            Docker Wizard?{" "}
          </h2>
          <div className="query-button-container">
            <button
              type="button"
              onClick={this.queryButton(true)}
              className="styled-button"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={this.queryButton(false)}
              className="styled-button"
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }

  queryButton(bool: boolean) {
    return (e: any) => {
      if (bool) {
        this.setState({
          useDockerWizard: true
        });
      } else {
        this.props.openNotificationModal(
          "Notifications",
          "The job was cancelled due to lacking a Dockerfile."
        );
      }
    };
  }

  render() {
    return (
      <>
        {this.state.useDockerWizard ? this.dockerWizardUi() : this.queryModal()}
      </>
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  state: state.docker.inputState,
  filePath: state.modal.modal_text
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (modal_name: string, text: string) =>
    dispatch(openNotificationModal(modal_name, text)),
  receiveDockerInput: (object: IDockerInput) =>
    dispatch(receiveDockerInput(object)),
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(DockerWizard);
