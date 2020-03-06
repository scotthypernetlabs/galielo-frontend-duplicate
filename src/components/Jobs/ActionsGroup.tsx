import {Box, Fab, Grid, IconButton, Tooltip} from "@material-ui/core";
import {linkBlue, red} from "../theme";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faFileAlt, faInfo, faPause, faPlay, faTimes} from "@fortawesome/free-solid-svg-icons";
import ArchiveOutlineIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import React from "react";

export enum ActionDisplay {
  downloadResults,
  inProgress,
  paused
}

interface Props {
  display: ActionDisplay,
  jobId: string;

  // For download
  onClickDownload?: any;
  archiveJob?: any;
  isArchived: boolean;

  // For job in progress
  pauseJob?: any;
  stopJob?: any;
  startJob?: any;
  openProcessLog?: any;
  openStdoutLog?: any;
}

const ActionsGroup: React.SFC<Props> = (props: Props) => {
  const {
    display,
    onClickDownload,
    jobId,
    isArchived,
    archiveJob,
    pauseJob,
    startJob,
    stopJob,
    openProcessLog,
    openStdoutLog
  } = props;
  return (
    <>
      {display == ActionDisplay.downloadResults ?
        <Box display="flex" alignItems="center">
          <Box>
            <Tooltip disableFocusListener title="Download results">
              <Fab
                size="small"
                onClick={onClickDownload}
                style={{backgroundColor: linkBlue.background}}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faArrowDown}
                  size="lg"
                  key={`${jobId}download`}
                  style={{color: linkBlue.main}}
                />
              </Fab>
            </Tooltip>
          </Box>
          <Tooltip
            disableFocusListener
            title={isArchived ? "Unarchive" : "Archive"}
          >
            <Box ml={2} display="flex" alignItems="center">
              <IconButton aria-label="archive" onMouseUp={archiveJob}>
                {isArchived ? (
                    <>
                      {" "}
                      <ArchiveOutlineIcon fontSize="small"/>{" "}
                    </>
                  ) :
                  (
                    <>
                      {" "}
                      <UnarchiveIcon fontSize="small"/>{" "}
                    </>
                  )}
              </IconButton>
            </Box>
          </Tooltip>
        </Box> :
        <Box
          display="flex"
          flexWrap="nowrap"
          p={1}
          m={1}
          bgcolor="background.paper"
          css={{maxWidth: 300}}
        >
          <Box mr={1}>

            {display == ActionDisplay.inProgress ?
              <Tooltip disableFocusListener title="Pause job">
                <Fab
                  size="small"
                  onClick={pauseJob}
                  style={{backgroundColor: linkBlue.background}}
                  className="add-cursor"
                >
                  <FontAwesomeIcon
                    icon={faPause}
                    size="sm"
                    key={`${jobId}pause`}
                    onClick={pauseJob}
                    style={{color: linkBlue.main}}
                  />
                </Fab>
              </Tooltip>
              :
              <Tooltip disableFocusListener title="Start job">
                <Fab
                  size="small"
                  onClick={startJob}
                  style={{backgroundColor: linkBlue.background}}
                  className="add-cursor"
                >
                  <FontAwesomeIcon
                    icon={faPlay}
                    size="sm"
                    key={`${jobId}start`}
                    onClick={startJob}
                    style={{color: linkBlue.main}}
                  />
                </Fab>
              </Tooltip>
            }
          </Box>
          <Box mr={1}>
            <Tooltip disableFocusListener title="Cancel job">
              <Fab
                size="small"
                onClick={stopJob}
                style={{backgroundColor: red.background}}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size="lg"
                  key={`${jobId}stop`}
                  style={{color: red.main}}
                />
              </Fab>
            </Tooltip>
          </Box>
          <Box mr={1}>
            <Tooltip disableFocusListener title="Process logs">
              <Fab
                size="small"
                onClick={openProcessLog}
                style={{backgroundColor: linkBlue.background}}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faInfo}
                  size="lg"
                  key={`${jobId}viewProcessLogs`}
                  style={{color: linkBlue.main}}
                />
              </Fab>
            </Tooltip>
          </Box>
          <Box mr={1}>
            <Tooltip disableFocusListener title="Standard logs">
              <Fab
                size="small"
                onClick={openStdoutLog}
                style={{backgroundColor: linkBlue.background}}
                className="add-cursor"
              >
                <FontAwesomeIcon
                  icon={faFileAlt}
                  size="lg"
                  key={`${jobId}viewStdout`}
                  style={{color: linkBlue.main}}
                />
              </Fab>
            </Tooltip>
          </Box>
        </Box>
      }
    </>
  )
};

export default ActionsGroup;
