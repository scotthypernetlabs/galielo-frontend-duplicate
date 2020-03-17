import {
  AppBar,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs
} from "@material-ui/core";
import {
  EJobStatus,
  Job as JobModel,
  JobStatusDecode,
  decodeJobStatus
} from "../../../../business/objects/job";
import { Station } from "../../../../business/objects/station";
import { User } from "../../../../business/objects/user";
import { darkGrey } from "../../../theme";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../Core/Header";
import Job from "../../../Jobs/Job";
import React, { useState } from "react";

interface StationJobsExpandedProps {
  setMode: Function;
  stationJobs: any[];
  currentUser: User;
  match: any;
  station: Station;
}

const StationJobsExpanded: React.SFC<StationJobsExpandedProps> = (
  props: StationJobsExpandedProps
) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    switch (newValue) {
      case 0: {
        setValue(newValue);
        setTab("Running");
        break;
      }
      case 1: {
        setValue(newValue);
        setTab("Queued");
        break;
      }
      case 2: {
        setValue(newValue);
        setTab("Past Jobs");
        break;
      }
      default: {
        setValue(0);
        setTab("Running");
        break;
      }
    }
  };
  const { setMode, currentUser, stationJobs, match, station } = props;
  const [tab, setTab] = useState("Running");
  let jobList: JobModel[] = [];
  const allJobs = Object.keys(stationJobs[match.params.id]).map(
    key => stationJobs[match.params.id][key]
  );
  if (stationJobs[match.params.id]) {
    if (tab === "Running") {
      jobList = allJobs.filter(
        (job: JobModel) =>
          decodeJobStatus(job.status).status === "Job In Progress" ||
          decodeJobStatus(job.status).status === "Building Image" ||
          decodeJobStatus(job.status).status === "Building Container" ||
          decodeJobStatus(job.status).status === "Job Paused" ||
          decodeJobStatus(job.status).status === "Job Uploading" ||
          decodeJobStatus(job.status).status === "Collecting Results"
      );
    }
    if (tab === "Queued") {
      jobList = allJobs.filter(
        (job: JobModel) => decodeJobStatus(job.status).status === "Queued"
      );
    }
    if (tab === "Past Jobs") {
      jobList = allJobs.filter(
        (job: JobModel) =>
          decodeJobStatus(job.status).status === "Completed" ||
          decodeJobStatus(job.status).status === "Job Cancelled" ||
          decodeJobStatus(job.status).status.includes("Error")
      );
    }
  }
  return (
    <>
      <div
        className="section-header station-jobs-header-collapsed"
        onClick={setMode("Jobs")}
      >
        <Header
          icon="list_alt"
          title="Station Activity"
          titleVariant="h4"
          textColor={darkGrey.main}
        />
      </div>
      <div className="station-jobs">
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          <Tab label="Running Jobs" />
          <Tab label="Queued Jobs" />
          <Tab label="Past Jobs" />
        </Tabs>
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sent to</TableCell>
                <TableCell>Sent by</TableCell>
                <TableCell>Name of project</TableCell>
                <TableCell align="center">Time taken</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobList
                .sort((a: JobModel, b: JobModel) => {
                  if (a.upload_time < b.upload_time) return 1;
                  if (a.upload_time > b.upload_time) return -1;
                  return 0;
                })
                .map((job: JobModel) => {
                  let hasPerms = false;
                  if (currentUser.mids.includes(job.landing_zone)) {
                    hasPerms = true;
                  }
                  if (job.launch_pad === currentUser.user_id) {
                    hasPerms = true;
                  }
                  if (station.owner.includes(currentUser.user_id)) {
                    hasPerms = true;
                  }
                  return (
                    <Job
                      key={job.id}
                      job={job}
                      isSentJob={job.landing_zone !== currentUser.user_id}
                      hasPerms={hasPerms}
                    />
                  );
                })}
            </TableBody>
          </Table>
          {
            // <Pagination
            //  limit={10}
            //  offset={this.state.offset}
            //  total={100}
            //  onClick={(e, offset) => this.handleClick(offset)}
            //  />
          }
        </TableContainer>
      </div>
    </>
  );
};

export default StationJobsExpanded;
