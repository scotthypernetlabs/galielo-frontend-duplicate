import { Box, Grid, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Machine } from "../../business/objects/machine";
import { faSdCard, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "../ProgressBar";
import React from "react";

type Props = {
  machine: Machine;
  station: boolean;
  fileUploadText?: string;
};

type State = {};

class LandingZone extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  public render() {
    const { machine, station } = this.props;
    let memory: number = 0;
    let cores: number = 0;
    if (machine.memory !== "Unknown") {
      memory = parseInt((parseInt(machine.memory) / 1e9).toFixed(1));
    }
    if (machine.cpu !== "Unknown") {
      cores = +machine.cpu;
    }
    const iconColor =
      machine.status.toUpperCase() === "ONLINE" ? "rgb(40, 202, 66)" : "red";

    return (
      <Box
        border={station ? "2px dashed" : "0.5px solid"}
        borderColor={
          station
            ? machine.status.toUpperCase() === "ONLINE"
              ? "primary.main"
              : "red"
            : "#999"
        }
        borderRadius={5}
        bgcolor="rgb(255, 255, 255, 0.5)"
        p={3}
        m={1}
        minWidth="250px"
        maxWidth="250px"
        minHeight={this.props.station ? "130px" : "100px"}
        maxHeight={this.props.station ? "130px" : "100px"}
        className={this.props.station ? "station-box" : ""}
      >
        <Grid container>
          <Grid item xs={12}>
            <svg
              width="10px"
              height="10px"
              viewBox="0 0 100 100"
              version="1.1"
              style={{ float: "left", margin: "5px 5px 5px 0px" }}
            >
              <ellipse
                id="online-badge"
                fill={iconColor}
                cx="50"
                cy="50"
                rx="40"
                ry="40"
              />
            </svg>
            <Typography
              variant="h4"
              noWrap={true}
              gutterBottom={true}
              style={{ fontWeight: 500 }}
            >
              {machine.machine_name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FontAwesomeIcon
              icon={faSdCard}
              color="grey"
              style={{ float: "left", marginRight: 5 }}
            />
            <h5 style={{ color: "grey", fontWeight: 400 }}>{memory}GB</h5>
          </Grid>
          <Grid item xs={6}>
            <FontAwesomeIcon
              icon={faTachometerAlt}
              color="grey"
              style={{ float: "left", marginRight: 5 }}
            />
            <h5 style={{ color: "grey", fontWeight: 400 }}>{cores} Cores</h5>
          </Grid>
          {this.props.station && (
            <div>
              <Grid item xs={12}>
                <h5>{this.props.fileUploadText}</h5>
              </Grid>
            </div>
          )}
          <Grid item xs={12}>
            <ProgressBar type={"machine"} id={machine.mid} />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default LandingZone;
