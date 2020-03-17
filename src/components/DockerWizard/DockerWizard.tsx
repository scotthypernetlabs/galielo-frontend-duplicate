import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem
} from "@material-ui/core";
import { Resizable, ResizableBox } from "react-resizable";
import { connect } from "react-redux";
import BlenderWizard from "./Blender";
import Draggable from "react-draggable";
import HecrasWizard from "./HECRAS";
import JuliaWizard from "./Julia";
import PythonWizard from "./Python";
import RWizard from "./R";
import React from "react";
import SRH2DWizard from "./SRH2D";
import Select from "react-select";
import StataWizard from "./Stata";

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
import { MyContext } from "../../MyContext";
import { context } from "../../context";
import { makeStyles } from "@material-ui/core/styles";
import SimpleModal from "./SimpleModal";
type Props = {
  state: DockerInputState;
  openNotificationModal: (
    modal_name: string,
    text: string
  ) => IOpenNotificationModal;
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
  closeModal: () => ICloseModal;
  filePath: string;
  fileList: File[];
};

type State = {
  showDisplayTemplate: boolean;
  useDockerWizard: boolean;
  disabled: boolean;
  modalWidth: number;
};

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

class DockerWizard extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.state = {
      showDisplayTemplate: false,
      useDockerWizard: false,
      disabled: true,
      modalWidth: 500
    };

    this.generateDisplayTemplate = this.generateDisplayTemplate.bind(this);
    this.generateDockerForm = this.generateDockerForm.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.createDockerFile = this.createDockerFile.bind(this);
    this.downloadDockerFile = this.downloadDockerFile.bind(this);
    this.toggleDisplayTemplate = this.toggleDisplayTemplate.bind(this);
  }

  getModalStyle = () => {
    // const top = 50;
    // const left = 50;
    return {
      cursor: "move",
      paddingTop: 50,
      paddingLeft: 50,
      paddingRight: 50,
      position: "absolute" as "absolute",
      width: "80%",
      height: "90%",
      backgroundColor: "white"
      // top: `${top}%`,
      // left: `${left}%`,
      // transform: `translate(-${top}%, -${left}%)`,
    };
  };

  customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      background: "white",
      opacity: 1,
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      borderColor: "grey",
      boxShadow: state.isFocused ? null : null
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      background: "white",
      opacity: 1,
      zIndex: 100
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
      background: "white",
      opacity: 1
    })
  };
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

    const dockerFileContents: BlobPart[] = [new Blob([dockerTextFile])];
    const file = new File(dockerFileContents, "Dockerfile", {
      type: "application/octet-stream"
    });
    const files = [...this.props.fileList];
    files.push(file);
  }
  downloadDockerFile(e: any) {
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
      "Docker file has been created! Please move the Dockerfile to your project folder."
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
      this.setState({
        disabled: false
      });
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
        <header className="docker-wizard-header"> Dockerfile </header>
        <div className="template-container">
          <textarea
            cols={72}
            value={dockerTextFile}
            className="docker-command"
            onChange={this.handleInput("dockerTextFile")}
          />
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
      { value: "stata", label: "Stata" },
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
      if (selectedFramework.label === "Stata") {
        component = <StataWizard />;
      }
    }
    return (
      <div className="docker-form-container">
        <h1>Docker Wizard</h1>
        <div className="select-framework">
          <Select
            value={selectedFramework}
            onChange={this.handleSelect}
            options={options}
            styles={this.customStyles}
            placeholder="Select a Framework..."
            theme={theme => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: "#4dc1ab",
                primary: "#83f4dd"
              }
            })}
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
    if (
      entrypoint.length > 0 ||
      this.props.state.dockerTextFile.includes("ENTRYPOINT")
    ) {
      return <></>;
    }
  }
  dockerWizardUi() {
    const { entrypoint } = this.props.state;
    return (
      <Box
        display="flex"
        flexDirection="column"
        p={1}
        m={1}
        style={this.getModalStyle()}
      >
        <div className="docker-wizard-container">
          <Box className="docker-wizard-form">{this.generateDockerForm()}</Box>
          <Box className="docker-wizard-template">
            {this.generateDisplayTemplate()}
          </Box>
        </div>
        <Box display="flex" justifyContent="center">
          {!this.state.disabled && (
            <Button color="primary" onClick={this.toggleDisplayTemplate}>
              {"See Dockerfile >"}
            </Button>
          )}
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center" mb={1}>
          <Button
            className={["secondary-button-large", "styled-button"].join(" ")}
            variant="outlined"
            onClick={this.props.closeModal}
          >
            Cancel
          </Button>

          <Button
            className={["primary-button-large", "styled-button"].join(" ")}
            variant="contained"
            color="primary"
            onClick={this.downloadDockerFile}
          >
            Create Dockerfile
          </Button>
        </Box>
      </Box>
    );
  }

  queryModal() {
    return (
      <div>
        <SimpleModal
          buttonMethod={this.queryButton}
          hasTitle={true}
          titleText={
            "The folder does not contain a DockerFile. Would you like to use the Docker Wizard to create one?"
          }
          bodyText={"You can also add a Dockerfile on your own and try again."}
          button2Text={"Use Docker Wizard"}
          button1Text={"Cancel"}
          secondButton={this.state.disabled}
        />
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

DockerWizard.contextType = context;

const mapStateToProps = (state: IStore) => ({
  state: state.docker.inputState,
  filePath: state.modal.modal_text,
  fileList: state.modal.modal_query
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (modal_name: string, text: string) =>
    dispatch(openNotificationModal(modal_name, text)),
  receiveDockerInput: (object: IDockerInput) =>
    dispatch(receiveDockerInput(object)),
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(DockerWizard);
