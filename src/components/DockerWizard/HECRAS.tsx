import { Dispatch } from "redux";
import { IDockerInput } from "../../business/objects/dockerWizard";
import {
  IReceiveDockerInput,
  receiveDockerInput
} from "../../actions/dockerActions";
import { IStore } from "../../business/objects/store";
import { connect } from "react-redux";
import React from "react";
import Select from "react-select";

type Props = {
  receiveDockerInput: (object: any) => IReceiveDockerInput;
  state: IDockerInput;
};

type State = {
  networkFileSystem: boolean;
  volumeLocation: string;
  volumeString: string;
  experimentName: string;
  experimentString: string;
  endingString: string;
  fileSystemMount: string;
  fileSystemString: string;
  frameworkText: string;
  selectedRAS: any;
  selectedPlan: any;
  rasText: string;
  planText: string;
  manualFiles: string;
};

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
});

class HecrasWizard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      networkFileSystem: false,
      volumeLocation: "C:\\Users\\Public\\Output",
      volumeString: `#This is where you will set your Galileo volume to be located\n\nENV OUTPUT_DIRECTORY="C:\\Users\\Public\\Output"\n\n`,
      experimentName: "",
      experimentString: "",
      endingString:
        "#Be sure to place this Dockerfile in the directory containing your .prj file\n\nCOPY . ${RAS_BASE_DIR}\\\\${RAS_EXPERIMENT}",
      fileSystemMount: "",
      fileSystemString: "",
      frameworkText: "",
      selectedRAS: { value: "5.0.7", label: "5.0.7" },
      selectedPlan: { value: "Current", label: "Current" },
      rasText: "",
      planText: "",
      manualFiles: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
    this.handleRasSelect = this.handleRasSelect.bind(this);
    this.toggleNetworkFileSystem = this.toggleNetworkFileSystem.bind(this);
  }
  componentDidMount() {
    this.props.receiveDockerInput({
      target: "",
      dependencyText: "",
      dependencyInput: "",
      dockerTextFile: "",
      frameworkText: "",
      entrypoint: ""
    });
  }
  componentDidUpdate(prevProps: Props, prevState: State) {
    let explanation;
    const frameworkText =
      "#The line below determines the build image to use\n\n" +
      `FROM hyperdyne/simulator:hecras\n\n`;
    let volumeString = this.state.volumeString;
    let experimentString = this.state.experimentString;
    let rasText = this.state.rasText;
    let planText = this.state.planText;
    let fileSystemString = this.state.fileSystemString;
    let change = false;
    if (this.state.manualFiles !== prevState.manualFiles) {
      change = true;
      planText = `ENV RAS_PLANS="${this.state.manualFiles}"\n\n`;
    }
    if (this.state.networkFileSystem !== prevState.networkFileSystem) {
      change = true;
    }
    if (this.state.frameworkText !== frameworkText) {
      change = true;
    }
    if (prevState.volumeLocation !== this.state.volumeLocation) {
      explanation = `#This is where you will set your Galileo volume to be located\n\n`;
      volumeString = `ENV OUTPUT_DIRECTORY="${this.state.volumeLocation}"\n\n`;
      change = true;
    }
    if (prevState.experimentName !== this.state.experimentName) {
      explanation = `#This will be the name of the folder created in the volume for your experiment\n\n`;
      experimentString = `ENV RAS_EXPERIMENT="${this.state.experimentName}"\n\n`;
      change = true;
    }
    if (prevState.fileSystemMount !== this.state.fileSystemMount) {
      if (this.state.fileSystemMount.length === 0) {
        fileSystemString = "";
      } else {
        explanation = `# If you are running a model from a local filesystem mounted as a volume, give the container path here, leave empty if not using\n\n`;
        fileSystemString = `ENV READ_ONLY_MODEL_PATH="${this.state.fileSystemMount}"\n\n`;
      }
      change = true;
    }
    if (prevState.selectedRAS !== this.state.selectedRAS) {
      rasText = `ENV RAS_VERSION=${this.state.selectedRAS.value}\n\n`;
      change = true;
    }
    if (prevState.selectedPlan.value !== this.state.selectedPlan.value) {
      if (this.state.selectedPlan.value === "All") {
        planText = `ENV RUN_ALL_PLANS=1\n\n`;
      } else if (this.state.selectedPlan.value === "Current") {
        planText = "";
      }
      change = true;
    }
    if (change) {
      this.setState({
        fileSystemString: fileSystemString,
        experimentString: experimentString,
        volumeString: volumeString,
        frameworkText: frameworkText,
        rasText: rasText,
        planText: planText
      });
      let finalizedDockerFile = frameworkText + volumeString;
      if (this.state.selectedPlan.value === "All" || "Manually Select") {
        finalizedDockerFile += planText;
      }
      if (this.state.experimentName.length > 0) {
        finalizedDockerFile += experimentString;
      }
      if (this.state.selectedRAS.value !== "5.0.7") {
        finalizedDockerFile += rasText;
      }
      finalizedDockerFile += fileSystemString;
      finalizedDockerFile += this.state.endingString;
      const entrypoint = "HECRAS";
      this.props.receiveDockerInput({
        dockerTextFile: finalizedDockerFile,
        entrypoint: entrypoint
      });
    }
    if (
      this.props.state.entrypoint !== "set" &&
      !this.state.networkFileSystem
    ) {
      this.props.receiveDockerInput({
        entrypoint: "set"
      });
    }
  }
  handleRasSelect(selectedRAS: any) {
    this.setState({
      selectedRAS
    });
  }
  handleSelectPlan(selectedPlan: any) {
    this.setState({
      selectedPlan
    });
  }
  handleChange(type: keyof State) {
    return (e: any) => {
      const value = e.target.value;
      if (type === "fileSystemMount") {
        this.setState({
          fileSystemMount: value,
          volumeLocation: value,
          experimentName: "."
        });
      } else {
        this.setState(updateState(type, value));
      }
    };
  }
  toggleNetworkFileSystem(boolean: boolean) {
    return (e: any) => {
      this.setState({
        networkFileSystem: boolean
      });
    };
  }
  handleFiles(fileList: FileList) {
    const extensionList: string[] = [];
    Array.from(fileList).forEach(fileObj => {
      const ext = fileObj.name.split(".").pop();
      if (extensionList.indexOf(ext) === -1) {
        extensionList.push(ext);
      }
    });
    const string = extensionList.join(",");
    this.setState({
      manualFiles: string
    });
  }
  render() {
    const { selectedRAS, selectedPlan } = this.state;
    const rasOptions = [
      { value: "5.0.5", label: "5.0.5" },
      { value: "5.0.7", label: "5.0.7" }
    ];
    const planOptions = [
      { value: "Current", label: "Current" },
      { value: "All", label: "All" },
      { value: "Manually Select", label: "Manually Select" }
    ];
    let yesToggle = "white";
    let noToggle = "black";
    if (this.state.networkFileSystem) {
      yesToggle = "black";
      noToggle = "white;";
    }
    return (
      <div className="hecras-wizard">
        <section>
          <div className="label">RAS Version</div>
          <div className="select-framework">
            <Select
              value={selectedRAS}
              onChange={this.handleRasSelect}
              options={rasOptions}
              placeholder="Select ras version..."
            />
          </div>
        </section>
        <section>
          <div className="label">Plan to Run</div>
          <Select
            value={selectedPlan}
            onChange={this.handleSelectPlan}
            options={planOptions}
            placeholder="Select plans to run..."
          />
          {selectedPlan.value === "Manually Select" && (
            <>
              <input
                type="file"
                accept=".p*"
                multiple
                onChange={e => this.handleFiles(e.target.files)}
              />
            </>
          )}
        </section>
        <section>
          <div className="label">Network File System?</div>
          <div className="attach-volume-toggle">
            <div
              className={yesToggle}
              onClick={this.toggleNetworkFileSystem(true)}
            >
              <p>Yes</p>
            </div>
            <div
              className={noToggle}
              onClick={this.toggleNetworkFileSystem(false)}
            >
              <p>No</p>
            </div>
          </div>
        </section>
        {this.state.networkFileSystem && (
          <>
            <section>
              <div className="label">RAS Model Path</div>
              <div className="docker-wizard-input-block">
                <input
                  type="text"
                  value={this.state.fileSystemMount}
                  onChange={this.handleChange("fileSystemMount")}
                />
              </div>
            </section>
            <section>
              <div className="label">RAS Output Location (Galileo Volume)</div>
              <div className="docker-wizard-input-block">
                <input
                  type="text"
                  value={this.state.volumeLocation}
                  onChange={this.handleChange("volumeLocation")}
                />
              </div>
            </section>
            <section>
              <div className="label">Experiment Name</div>
              <div className="docker-wizard-input-block">
                <input
                  type="text"
                  value={this.state.experimentName}
                  onChange={this.handleChange("experimentName")}
                />
              </div>
            </section>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: IStore) => ({
  state: state.docker.inputState
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  receiveDockerInput: (object: any) => dispatch(receiveDockerInput(object))
});

export default connect(mapStateToProps, mapDispatchToProps)(HecrasWizard);
