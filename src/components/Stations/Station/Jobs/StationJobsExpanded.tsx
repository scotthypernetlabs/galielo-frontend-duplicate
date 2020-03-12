import { EJobStatus, Job as JobModel } from "../../../../business/objects/job";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import { User } from "../../../../business/objects/user";
import { darkGrey } from "../../../theme";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../Core/Header";
import Job from "../../../Jobs/Job";
import React from "react";
import { Station } from "../../../../business/objects/station";

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
  const { setMode, currentUser, stationJobs, match, station } = props;
  let runningJobList: any[] = [];
  if (stationJobs[match.params.id]) {
    runningJobList = Object.keys(stationJobs[match.params.id])
      .map(key => stationJobs[match.params.id][key])
      .filter((job: JobModel) => job.status === EJobStatus.running);
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
              {runningJobList
                .sort((a: JobModel, b: JobModel) => {
                  if (a.upload_time < b.upload_time) return 1;
                  if (a.upload_time > b.upload_time) return -1;
                  return 0;
                })
                .map((job: JobModel) => {
                  let hasPerms = false; 
                  if(currentUser.mids.includes(job.landing_zone)){
                    hasPerms = true; 
                  }
                  if(job.launch_pad === currentUser.user_id){
                    hasPerms = true; 
                  }
                  if(station.owner.includes(currentUser.user_id)){
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
