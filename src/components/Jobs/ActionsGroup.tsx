import { Box, IconButton, Tooltip } from "@material-ui/core";
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
import { linkBlue, red } from "../theme";
import ArchiveOutlineIcon from "@material-ui/icons/Archive";
import JobAction from "./JobAction";
import React from "react";
import UnarchiveIcon from "@material-ui/icons/Unarchive";

export enum ActionDisplay {
  downloadResults,
  inProgress,
  paused,
  building
}

interface Props {
  display: ActionDisplay;
  jobId: string;
  isStation?: boolean;
  canKill: boolean;
  killJob?: any;
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
    openStdoutLog,
    isStation,
    canKill,
    killJob
  } = props;

  const iconsList: any[] = [];
  if (
    display === ActionDisplay.inProgress ||
    display === ActionDisplay.paused
  ) {
    display == ActionDisplay.inProgress
      ? iconsList.push(
          <JobAction
            id={`${jobId}pause`}
            action={pauseJob}
            toolTipText="Pause job"
            icon="pause"
            iconSize="sm"
            color={linkBlue}
          />
        )
      : iconsList.push(
          <JobAction
            id={`${jobId}start`}
            action={startJob}
            toolTipText="Start job"
            icon="play"
            iconSize="sm"
            color={linkBlue}
          />
        );
    iconsList.push(
      <Box mr={1}>
        <JobAction
          id={`${jobId}stop`}
          action={stopJob}
          toolTipText="Cancel job"
          icon="close"
          color={red}
        />
      </Box>
    );
    iconsList.push(
      <Box mr={1}>
        <JobAction
          id={`${jobId}viewProcessLogs`}
          action={openProcessLog}
          toolTipText="Process logs"
          icon="info"
          color={linkBlue}
        />
      </Box>
    );
    iconsList.push(
      <Box mr={1}>
        <JobAction
          id={`${jobId}viewStdout`}
          action={openStdoutLog}
          toolTipText="Standard logs"
          icon="description"
          color={linkBlue}
        />
      </Box>
    );
  }
  // if (canKill) {
  //   iconsList.push(
  //     <Box mr={1}>
  //       <JobAction
  //         id={`${jobId}killSwitch`}
  //         action={killJob}
  //         toolTipText="Kill Job"
  //         icon="delete_forever"
  //         color={linkBlue}
  //       />
  //     </Box>
  //   );
  // }
  if (display === ActionDisplay.downloadResults && !isStation) {
    iconsList.push(
      <Box mr={1}>
        <JobAction
          id={`${jobId}download`}
          action={onClickDownload}
          toolTipText="Download results"
          icon="arrow_downward"
          color={linkBlue}
        />
      </Box>
    );
  }
  if (isArchived) {
    iconsList.push(
      <JobAction
        id={`${jobId}unarchive`}
        toolTipText="Unarchive"
        icon="unarchive"
        onMouseUp={archiveJob}
        color={linkBlue}
      />
    );
  } else {
    iconsList.push(
      <JobAction
        id={`${jobId}archive`}
        toolTipText="Archive"
        icon="archive"
        onMouseUp={archiveJob}
        color={linkBlue}
      />
    );
  }
  return (
    <>
      {display == ActionDisplay.downloadResults ? (
        <Box display="flex" alignItems="center">
          {iconsList.map((icon, idx) => {
            return <React.Fragment key={idx}>{icon}</React.Fragment>;
          })}
        </Box>
      ) : (
        <Box display="flex" flexWrap="nowrap" bgcolor="background.paper">
          {iconsList.map((icon, idx) => {
            return <React.Fragment key={idx}>{icon}</React.Fragment>;
          })}
        </Box>
      )}
    </>
  );
};

export default ActionsGroup;
