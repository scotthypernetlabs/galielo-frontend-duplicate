import { Box, Button, Hidden, IconButton } from "@material-ui/core";
import { Dispatch } from "redux";
import {
  DockerInputState,
  DockerWizardOptions,
  IDockerInput
} from "../../business/objects/dockerWizard";
import { Formik } from "formik";
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
import { ProjectType } from "../../business/interfaces/IProjectService";
import {
  ProjectTypeExpanded,
  ProjectTypesReceived
} from "../../business/objects/projectType";
import { connect } from "react-redux";
import { context } from "../../context";
import CloseIcon from "@material-ui/icons/Close";
import Draggable from "react-draggable";
import HecrasWizard from "./HECRAS";
import ProgressBar from "../ProgressBar";
import React from "react";
import SelectAdvancedSettings from "./SelectAdvancedSettings";
import SelectDependencies from "./SelectDependencies";
import SelectFile from "./SelectFile";
import SelectProject from "./SelectProject";
import SelectVersion from "./SelectVersion";
import SimpleModal from "./SimpleModal";

const path = require("path");

let targetFiles: Array<string> = [];
type Props = {
  state: DockerInputState;
  openNotificationModal: (
    modal_name: string,
    text: string
  ) => IOpenNotificationModal;
  receiveDockerInput: (object: IDockerInput) => IReceiveDockerInput;
  closeModal: () => ICloseModal;
  filePath: string;
  options: DockerWizardOptions;
};

type State = {
  showDisplayTemplate: boolean;
  useDockerWizard: boolean;
  disabled: boolean;
  modalWidth: number;
  uploading: boolean;
  activeDrags: number;
  deltaPosition: any;
  hecResFiles: Array<string>;
  step: number;
  projectTypes: ProjectTypesReceived[];
  selectedProjectType: { framework: string; version: string };
};

interface FormDependencies {
  name: string;
  version: string;
}

interface FormSubmitValues {
  projectType: string;
  projectVersion: string;
  projectFile: string;
  dependencies: FormDependencies[];
  dependency: string;
  version: string;
  projectArguments: string;
  cpuUsage: number;
}

class DockerWizard extends React.Component<Props, State> {
  context!: MyContext;
  projectTypeDetails: ProjectTypeExpanded;
  projectTypeId: string;
  public readonly state = {
    showDisplayTemplate: false,
    useDockerWizard: false,
    disabled: true,
    modalWidth: 500,
    uploading: false,
    activeDrags: 0,
    deltaPosition: {
      x: 0,
      y: 0
    },
    hecResFiles: [""],
    step: 1,
    // @ts-ignore
    projectTypes: [],
    selectedProjectType: {
      framework: "",
      version: ""
    }
  };
  constructor(props: Props) {
    super(props);
    this.generateDisplayTemplate = this.generateDisplayTemplate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.runJobWithDockerFile = this.runJobWithDockerFile.bind(this);
    this.downloadDockerFile = this.downloadDockerFile.bind(this);
    this.toggleDisplayTemplate = this.toggleDisplayTemplate.bind(this);
    this.queryButton = this.queryButton.bind(this);
    this.uploadButton = this.uploadButton.bind(this);
    this.decrementStep = this.decrementStep.bind(this);
    this.incrementStep = this.incrementStep.bind(this);
    // The  folowing methods are used by drag and drop
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.setSelectedProjectType = this.setSelectedProjectType.bind(this);
  }
  // TODO  remove styles form the component
  getModalStyle = () => {
    return {
      paddingLeft: 50,
      paddingRight: 50,
      position: "absolute" as "absolute",
      width: "80%",
      height: "80%",
      backgroundColor: "#fff"
    };
  };

  customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      background: "#fff",
      opacity: 1,
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      borderColor: "grey",
      boxShadow: state.isFocused ? null : null
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      background: "#fff",
      opacity: 1,
      zIndex: 100
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
      background: "#fff",
      opacity: 1
    })
  };
  componentDidMount() {
    // get the uploaded files.
    const files: Array<string> = [];
    for (let i = 0, len = this.props.options.fileList.length; i < len; i++) {
      files.push(this.props.options.fileList[i].name);
    }
    // check if the file is a .p# file
    const EXTENSION = "p";
    targetFiles = files.filter(function(file) {
      return (
        path.extname(file).toLowerCase()[1] === EXTENSION &&
        !isNaN(path.extname(file).toLowerCase()[2])
      );
    });
  }
  componentDidUpdate() {
    // const tx = document.getElementsByTagName("textarea");
    // for (let i = 0; i < tx.length; i++) {
    //   tx[i].setAttribute(
    //     "style",
    //     "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
    //   );
    //   tx[i].addEventListener("input", OnInput, false);
    // }
    // function OnInput() {
    //   this.style.height = "auto";
    //   this.style.height = this.scrollHeight + "px";
    // }
  }
  // this
  runJobWithDockerFile(projectType: ProjectType) {
    const { dockerTextFile } = this.props.state;
    // What are these options
    const { options } = this.props;
    const dockerFileContents: BlobPart[] = [new Blob([dockerTextFile])];
    const file = new File(dockerFileContents, "Dockerfile", {
      type: "application/octet-stream"
    });
    if (!options) {
      return;
    }
    const files = [...options.fileList];
    const packagedFile = {
      fileObject: file,
      fullPath: "Dockerfile",
      lastModified: file.lastModified,
      name: "Dockerfile",
      size: file.size,
      type: file.type
    };
    files.push(packagedFile);
    if (options.target === "machine") {
      const sendJobFunction = async () => {
        await this.context.jobService.sendJob(
          options.mid,
          files,
          options.directoryName,
          options.stationid,
          projectType
        );
      };
      this.context.uploadQueue.addToQueue(sendJobFunction);
      this.context.uploadQueue.startQueue();
      this.setState({
        uploading: true
      });
    } else if (options.target === "station") {
      const sendJobFunction = async () => {
        await this.context.jobService.sendStationJob(
          options.stationid,
          files,
          options.directoryName,
          projectType
        );
      };
      this.context.uploadQueue.addToQueue(sendJobFunction);
      this.context.uploadQueue.startQueue();
      this.setState({
        uploading: true
      });
    }
    this.props.closeModal();
  }
  downloadDockerFile() {
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
  }
  onStart() {
    this.setState(prevState => {
      activeDrags: prevState.activeDrags + 1;
    });
  }

  onStop() {
    this.setState(prevState => {
      activeDrags: prevState.activeDrags - 1;
    });
  }
  handleSelect(selectedFramework: any) {
    if (selectedFramework.label === "Not Listed") {
      this.props.receiveDockerInput({
        selectedFramework,
        dockerTextFile:
          "#Unfortunately we have yet to setup a semi-automated process for your framework. You can use this editor to create your own Dockerfile."
      });
      this.setState({
        showDisplayTemplate: true,
        disabled: false
      });
    } else {
      // a framework is selected
      // fetch the selected framewotk info
      this.props.receiveDockerInput({ selectedFramework });
      this.setState({
        disabled: false
      });
    }
  }
  incrementStep() {
    const { step, selectedProjectType, projectTypes } = this.state;
    if (step == 1) {
      const { framework, version } = selectedProjectType;
      const projectType: ProjectTypesReceived = projectTypes.find(
        (projectType: ProjectTypesReceived) =>
          projectType.name == framework && projectType.version == version
      );
      this.projectTypeId = projectType.id;
      this.context.projectTypesService
        .getProjectTypeById(projectType.id)
        .then((projectTypeDetails: ProjectTypeExpanded) => {
          console.log("projectTypeDetails", projectTypeDetails);
          this.projectTypeDetails = projectTypeDetails;
        });
    }
    if (step) this.setState({ step: this.state.step + 1 });
  }
  decrementStep() {
    if (this.state.step >= 1) {
      this.setState({ step: this.state.step - 1 });
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
  setSelectedProjectType(framework: string, version: string) {
    this.setState({ selectedProjectType: { framework, version } });
  }
  dockerWizardUi() {
    // const { entrypoint } = this.props.state;
    const { projectTypes } = this.state;
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    const initialValues: FormSubmitValues = {
      projectType: "",
      projectVersion: "",
      projectFile: "",
      dependencies: [],
      dependency: "",
      version: "",
      projectArguments: "",
      cpuUsage: 1
    };

    return (
      <Draggable
        handle="strong"
        bounds={{ top: -40, left: -20, right: 200, bottom: 100 }}
        {...dragHandlers}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={(values: FormSubmitValues, actions: any) => {
            const dependencies: string[] = values.dependencies.map(
              (dependency: FormDependencies) => {
                return `${dependency.name} ${dependency.version}`;
              }
            );
            this.runJobWithDockerFile(
              new ProjectType(
                this.projectTypeId,
                null,
                null,
                values.projectFile,
                dependencies,
                values.projectArguments !== null,
                values.projectArguments,
                values.cpuUsage !== null,
                values.cpuUsage,
                null,
                null,
                null,
                null
              )
            );
            actions.setSubmitting(false);
          }}
        >
          {props => (
            <form onSubmit={props.handleSubmit}>
              <Box
                display="flex"
                flexDirection="column"
                p={1}
                m={1}
                style={this.getModalStyle()}
              >
                <strong className="cursor-move">
                  <div />
                </strong>
                <div className="docker-wizard-container">
                  <Box className="docker-wizard-form">
                    <div className="select-framework">
                      <Hidden smDown>
                        <IconButton
                          onClick={this.props.closeModal}
                          aria-label="Close"
                          className="closeButton"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Hidden>
                      {props.values.projectType !== "Hec-Ras" && (
                        <>
                          {this.state.step === 1 && (
                            <>
                              <Box mb={2}>
                                <SelectProject
                                  incrementStep={this.incrementStep}
                                  projectTypes={projectTypes}
                                />
                              </Box>
                            </>
                          )}
                          {this.state.step === 1 &&
                            props.values.projectType !== "" && (
                              <>
                                {(props.values.projectType === "Python" ||
                                  props.values.projectType === "Julia") && (
                                  <Box mb={2}>
                                    <SelectVersion
                                      projectType={props.values.projectType}
                                      projectTypes={projectTypes}
                                      setSelectedProjectType={
                                        this.setSelectedProjectType
                                      }
                                    />
                                  </Box>
                                )}
                                <SelectFile
                                  projectType={props.values.projectType}
                                />
                              </>
                            )}
                          {this.state.step === 2 && (
                            <SelectDependencies
                              initialValues={props.values}
                              dependency={props.values.dependency}
                              dependencies={props.values.dependencies}
                            />
                          )}
                          {this.state.step === 3 && <SelectAdvancedSettings />}

                          {props.errors.projectType && (
                            <div id="feedback">{props.values.projectType}</div>
                          )}
                        </>
                      )}
                      {props.values.projectType === "Hec-Ras" && (
                        <HecrasWizard targetFiles={targetFiles} />
                      )}
                    </div>

                    <div className="submit-docker-form">
                      {this.generateSubmitForm()}
                    </div>
                  </Box>
                  <Box className="docker-wizard-template">
                    {this.generateDisplayTemplate()}
                  </Box>
                </div>
                {/* <Box display="flex" justifyContent="center">
            <Button color="primary" onClick={this.toggleDisplayTemplate}>
              See Dockerfile
            </Button>
          </Box> */}
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  mb={1}
                >
                  {this.state.step === 1 && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={this.props.closeModal}
                    >
                      Cancel
                    </Button>
                  )}
                  {this.state.step != 1 && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={this.decrementStep}
                    >
                      Back
                    </Button>
                  )}

                  {this.state.step !== 3 && (
                    <Button
                      disabled={props.values.projectType === ""}
                      color="primary"
                      variant="contained"
                      size="large"
                      onClick={this.incrementStep}
                    >
                      Next
                    </Button>
                  )}

                  {this.state.step === 3 && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      type="submit"
                    >
                      Run Project
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Draggable>
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
        this.context.projectTypesService
          .getProjectTypes()
          .then((projectTypes: ProjectTypesReceived[]) => {
            this.setState({
              projectTypes
            });
          });
      } else {
        this.props.openNotificationModal(
          "Notifications",
          "The job was cancelled due to lacking a Dockerfile."
        );
      }
    };
  }

  uploadButton(bool: boolean) {
    return (e: any) => {
      if (bool) {
        this.downloadDockerFile();
      } else {
        this.props.closeModal();
      }
    };
  }

  // uploadingModal() {
  //   return (
  //     <div>
  //       <SimpleModal
  //         buttonMethod={this.uploadButton}
  //         hasTitle={true}
  //         titleText={`Uploading ${this.props.options.directoryName} with newly generated Dockerfile.`}
  //         bodyText={
  //           "You can download the Dockerfile and add to your project folder for future usage."
  //         }
  //         button2Text={"Download Dockerfile"}
  //         button1Text={"Close"}
  //         secondButton={true}
  //       >
  //         <ProgressBar
  //           type={this.props.options.target}
  //           id={
  //             this.props.options.target === "machine"
  //               ? this.props.options.mid
  //               : this.props.options.stationid
  //           }
  //         />
  //       </SimpleModal>
  //     </div>
  //   );
  // }

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
  options: state.modal.modal_query
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openNotificationModal: (modal_name: string, text: string) =>
    dispatch(openNotificationModal(modal_name, text)),
  receiveDockerInput: (object: IDockerInput) =>
    dispatch(receiveDockerInput(object)),
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(DockerWizard);
