import * as Yup from "yup";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Hidden,
  IconButton,
  Switch,
  Tooltip,
  Zoom
} from "@material-ui/core";
import { Dictionary } from "../../business/objects/dictionary";
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
  IProjectTypeOptions,
  IProjectTypeWidget,
  IProjectTypeWizardSpecs,
  ProjectTypeExpanded,
  ProjectTypeOptions,
  ProjectTypesReceived
} from "../../business/objects/projectType";
import {
  IReceiveDockerInput,
  receiveDockerInput
} from "../../actions/dockerActions";
import { IStore } from "../../business/objects/store";
import { MyContext } from "../../MyContext";
import { ObjectSchema } from "yup";
import { ProjectType } from "../../business/interfaces/IProjectService";
import { connect } from "react-redux";
import { context } from "../../context";
import CloseIcon from "@material-ui/icons/Close";
import Draggable from "react-draggable";
import HecRasFileSystem from "./HecRasFileSystem";
import HecrasWizard from "./HECRAS";
import HelpIcon from "@material-ui/icons/Help";
import ProgressBar from "../ProgressBar";
import React from "react";
import SelectAdvancedSettings from "./SelectAdvancedSettings";
import SelectDependencies from "./SelectDependencies";
import SelectFile from "./SelectFile";
import SelectProject from "./SelectProject";
import SelectVersion from "./SelectVersion";
import SimpleModal from "./SimpleModal";

const HecResToolTipText =
  "If your Network File System is connected with Galileo, you will be able to set your project path next. \n If you are not sure what this is, it is likely does not aply to you.";
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
  dependenciesSelected: boolean;
  hecResFiles: Array<string>;
  step: number;
  projectTypes: ProjectTypesReceived[];
  selectedProjectType: { framework: string; version: string };
  dependencies: string[];
  hecRasNetworkFileSystem: boolean;
};

interface FormDependencies {
  name: string;
  version: string;
}

interface HecRasFormValues {
  name: string;
  description: string;
  sourceStorageId: string;
  sourcePath: string;
  destinationStorageId: string;
  destinationPath: string;
  projectTypeId: string;
  plan: string;
  filesToRun: string[];
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
  hecRas: HecRasFormValues;
}

class DockerWizard extends React.Component<Props, State> {
  context!: MyContext;
  projectTypeDetails: ProjectTypeExpanded;
  projectTypeId: string;
  public dockerWizardSchema: ObjectSchema;
  public readonly state = {
    showDisplayTemplate: false,
    useDockerWizard: false,
    disabled: true,
    modalWidth: 500,
    dependenciesSelected: false,
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
    // @ts-ignore
    dependencies: [],
    selectedProjectType: {
      framework: "",
      version: ""
    },
    hecRasNetworkFileSystem: false
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
    // The following methods are used by drag and drop
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.toggleHecRasNetworkFileSystem = this.toggleHecRasNetworkFileSystem.bind(
      this
    );
    this.setSelectedProjectType = this.setSelectedProjectType.bind(this);
    this.toggleDependenciesSelected = this.toggleDependenciesSelected.bind(
      this
    );
    this.machineCores = this.machineCores.bind(this);
    this.dockerWizardSchema = Yup.object().shape({
      projectVersion: Yup.string().required("Required"),
      projectFile: Yup.string().required("Required"),
      projectType: Yup.string().required("Required"),
      sourcePath: Yup.string().required("Required"),
      destinationPath: Yup.string()
        .matches(
          /^([a-zA-Z]:)?(\\[^<>:"/\\|?*]+)+\\?$/,
          "Is not in correct format"
        )
        .required(),
      cpuCount: Yup.number()
        .integer()
        .min(1)
        .max(this.machineCores())
        .default(1)
    });
  }
  machineCores() {
    if (this.props.options.target === "machine") {
      return parseInt(this.props.options.machineCores);
    } else {
      return 96;
    }
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
  toggleDependenciesSelected() {
    this.setState({ dependenciesSelected: true });
  }
  runJobWithDockerFile(projectType: ProjectType) {
    const { options } = this.props;
    if (!options) {
      return;
    }
    const files = [...options.fileList];
    if (options.target === "machine") {
      const sendJobFunction = async () => {
        await this.context.jobService.sendJob(
          options.mid,
          files,
          options.directoryName,
          options.stationid,
          projectType,
          true,
          options.machineCores
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
          projectType,
          true
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
      // fetch the selected framework info
      this.props.receiveDockerInput({ selectedFramework });
      this.setState({
        disabled: false
      });
    }
  }
  toggleHecRasNetworkFileSystem() {
    this.setState({
      hecRasNetworkFileSystem: !this.state.hecRasNetworkFileSystem
    });
  }
  incrementStep() {
    const { step, selectedProjectType, projectTypes } = this.state;
    if (step == 1) {
      const { framework } = selectedProjectType;
      let version: string;
      if (selectedProjectType.version == undefined) {
        version = "";
      } else {
        version = selectedProjectType.version;
      }
      const projectType: ProjectTypesReceived = projectTypes.find(
        (projectType: ProjectTypesReceived) =>
          projectType.name == framework && projectType.version == version
      );
      this.projectTypeId = projectType.id;
      let dependencyWidget: IProjectTypeWidget;
      this.context.projectTypesService
        .getProjectTypeById(projectType.id)
        .then((projectTypeDetails: ProjectTypeExpanded) => {
          this.projectTypeDetails = projectTypeDetails;

          projectTypeDetails.wizard_spec.forEach(
            (spec: IProjectTypeWizardSpecs) => {
              spec.widgets.forEach((widget: IProjectTypeWidget) => {
                if (widget.key == "dependencies") {
                  dependencyWidget = widget;
                }
              });
            }
          );
          const dependencies: string[] = [];
          dependencyWidget.options.forEach((option: IProjectTypeOptions) => {
            dependencies.push(option.value);
          });
          this.setState({ dependencies });
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
      cpuUsage: 1,
      hecRas: {
        name: "Name of project",
        description: "Description of your HECRAS project",
        sourceStorageId: null,
        sourcePath: null,
        destinationStorageId: null,
        destinationPath: null,
        projectTypeId: "",
        plan: "",
        filesToRun: []
      }
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
            const dependencies: Dictionary<string> = {};
            values.dependencies.forEach((dependency: FormDependencies) => {
              dependencies[`${dependency.name}`] = dependency.version;
            });
            this.runJobWithDockerFile(
              new ProjectType(
                this.projectTypeId,
                null,
                null,
                values.projectFile,
                dependencies,
                [values.projectArguments],
                values.cpuUsage,
                values.hecRas.sourceStorageId,
                values.hecRas.sourcePath,
                values.hecRas.destinationStorageId,
                values.hecRas.destinationPath
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
                      <>
                        {this.state.step === 1 && (
                          <>
                            <Box mb={2}>
                              <SelectProject
                                incrementStep={this.incrementStep}
                                projectTypes={this.state.projectTypes}
                              />
                            </Box>
                          </>
                        )}
                        {this.state.step === 1 &&
                          props.values.projectType !== "" && (
                            <>
                              {(props.values.projectType === "Python" ||
                                props.values.projectType === "HECRAS" ||
                                props.values.projectType === "Julia") && (
                                <Box mb={2}>
                                  <SelectVersion
                                    projectType={props.values.projectType}
                                    projectTypes={this.state.projectTypes}
                                    setSelectedProjectType={
                                      this.setSelectedProjectType
                                    }
                                  />
                                </Box>
                              )}
                              {props.values.projectType !== "HECRAS" ? (
                                <SelectFile
                                  projectFile={props.values.projectFile}
                                  values={props.values}
                                />
                              ) : (
                                <Box display="flex">
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={
                                            this.state.hecRasNetworkFileSystem
                                          }
                                          onChange={() =>
                                            this.toggleHecRasNetworkFileSystem()
                                          }
                                        />
                                      }
                                      label="Project is in my Network File System"
                                    />
                                  </FormGroup>
                                  <Tooltip
                                    title={HecResToolTipText}
                                    arrow
                                    placement="right-start"
                                    TransitionComponent={Zoom}
                                  >
                                    <IconButton aria-label="help" size="small">
                                      <HelpIcon fontSize="inherit" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              )}
                            </>
                          )}
                        {this.state.step === 2 &&
                          (props.values.projectType === "HECRAS" ? (
                            this.state.hecRasNetworkFileSystem ? (
                              <HecRasFileSystem />
                            ) : (
                              <HecrasWizard
                                selectedPlan={(plan: string) => {
                                  props.values.hecRas.plan = plan;
                                }}
                                selectedFiles={(list: Array<string>) => {
                                  props.values.hecRas.filesToRun = list;
                                }}
                                targetFiles={targetFiles}
                              />
                            )
                          ) : (
                            <SelectDependencies
                              toggleDependenciesSelected={
                                this.toggleDependenciesSelected
                              }
                              initialValues={props.values}
                              dependency={props.values.dependency}
                              dependencies={props.values.dependencies}
                            />
                          ))}

                        {this.state.step === 3 &&
                          (this.state.hecRasNetworkFileSystem ? (
                            <HecrasWizard
                              selectedPlan={(plan: string) => {
                                props.values.hecRas.plan = plan;
                              }}
                              selectedFiles={(list: Array<string>) => {
                                props.values.hecRas.filesToRun = list;
                              }}
                              targetFiles={targetFiles}
                            />
                          ) : (
                            <SelectAdvancedSettings
                              errors={props.errors}
                              touched={props.touched}
                              options={this.props.options}
                            />
                          ))}

                        {props.errors.projectType && (
                          <div id="feedback">{props.values.projectType}</div>
                        )}
                      </>
                    </div>
                    <div className="submit-docker-form">
                      {this.generateSubmitForm()}
                    </div>
                  </Box>
                  <Box className="docker-wizard-template">
                    {this.generateDisplayTemplate()}
                  </Box>
                </div>
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

                  {/* Step 1  */}
                  {this.state.step === 1 && (
                    <Button
                      disabled={
                        (props.values.projectType === "HECRAS" &&
                          props.values.projectVersion === "") ||
                        (props.values.projectType !== "HECRAS" &&
                          props.values.projectFile == "")
                      }
                      color="primary"
                      variant="contained"
                      size="large"
                      onClick={this.incrementStep}
                    >
                      Next
                    </Button>
                  )}
                  {/* Step 2 */}

                  {this.state.step === 2 &&
                    props.values.projectType === "HECRAS" &&
                    !this.state.hecRasNetworkFileSystem && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                      >
                        Run Project
                      </Button>
                    )}
                  {this.state.step === 2 &&
                    props.values.projectType === "HECRAS" &&
                    this.state.hecRasNetworkFileSystem && (
                      <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        onClick={this.incrementStep}
                      >
                        Next
                      </Button>
                    )}
                  {this.state.step === 2 &&
                    props.values.projectType !== "HECRAS" && (
                      <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        onClick={this.incrementStep}
                      >
                        Next
                      </Button>
                    )}

                  {this.state.step === 2 && this.state.dependenciesSelected && (
                    <Button
                      color="primary"
                      variant="contained"
                      size="large"
                      onClick={this.incrementStep}
                    >
                      Next
                    </Button>
                  )}

                  {/* {(this.state.step === 1 ||
                    (this.state.step === 2 &&
                      props.values.projectType !== "Hec-Ras") ||
                    (this.state.step === 2 &&
                      this.state.hecRasNetworkFileSystem)) && (
                    <Button
                      disabled={
                        props.values.projectType === "" ||
                        props.values.projectVersion === "" ||
                        props.values.projectFile.length < 4
                      }
                      color="primary"
                      variant="contained"
                      size="large"
                      onClick={this.incrementStep}
                    >
                      {(this.state.step === 1 || this.state.step === 2) &&
                      ((props.values.projectType !== "Hec-Ras" &&
                      props.values.dependencies.length === 0)
                        ? "Skip"
                        : "Next")}
                    </Button>
                  )}
*/}
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
    console.log("step", this.state.step);
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
