import {Box, IconButton, Tooltip} from "@material-ui/core";
import {linkBlue, red} from "../theme";
import {
  faArrowDown,
  faBox,
  faBoxOpen,
  faFileAlt,
  faInfo,
  faPause,
  faPlay,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import ArchiveOutlineIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import React from "react";
import JobAction from "./JobAction";

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
  isArchived?: boolean;

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
        ( <Box display="flex" alignItems="center">
          <Box mr={1}>
            <JobAction
              id={`${jobId}download`}
              action={onClickDownload}
              toolTipText="Download results"
              icon="arrow_downward"
              color={linkBlue}
            />
          </Box>
          {isArchived ?
            <JobAction
              id={`${jobId}unarchive`}
              toolTipText="Unarchive"
              icon="unarchive"
              onMouseUp={archiveJob}
              color={linkBlue}
            /> :
            <JobAction
              id={`${jobId}archive`}
              toolTipText="Archive"
              icon="archive"
              onMouseUp={archiveJob}
              color={linkBlue}
            />
          }
        </Box>
        ) : (
        <Box
          display="flex"
          flexWrap="nowrap"
          bgcolor="background.paper"
        >
          <Box mr={1}>
            {display == ActionDisplay.inProgress ?
              ( <JobAction
                id={`${jobId}pause`}
                action={pauseJob}
                toolTipText="Pause job"
                icon="pause"
                iconSize="sm"
                color={linkBlue}
              /> ):
              <JobAction
                id={`${jobId}start`}
                action={startJob}
                toolTipText="Start job"
                icon="plat"
                iconSize="sm"
                color={linkBlue}
              />
            }
          </Box>
          <Box mr={1}>
            <JobAction
              id={`${jobId}stop`}
              action={stopJob}
              toolTipText="Cancel job"
              icon="{faTimes}"
              color={red}
            />
          </Box>
          <Box mr={1}>
            <JobAction
              id={`${jobId}viewProcessLogs`}
              action={openProcessLog}
              toolTipText="Process logs"
              icon="info"
              color={linkBlue}
            />
          </Box>
          <Box mr={1}>
            <JobAction
              id={`${jobId}viewStdout`}
              action={openStdoutLog}
              toolTipText="Standard logs"
              icon="{faFileAlt}"
              color={linkBlue}
            />
          </Box>
        </Box>
        )
      }
    </>
  )
};

export default ActionsGroup;
