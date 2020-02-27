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
import Job from "../../../Jobs/Job";
import React from "react";
import StationJobsHeader from "./StationJobsHeader";

interface StationJobsExpandedProps {
  setMode: Function;
  stationJobs: any[];
  currentUser: User;
  match: any;
}

const StationJobsExpanded: React.SFC<StationJobsExpandedProps> = (
  props: StationJobsExpandedProps
) => {
  const { setMode, currentUser, stationJobs, match } = props;
  let jobList: any[] = [];
  if (stationJobs[match.params.id]) {
    jobList = Object.keys(stationJobs[match.params.id])
      .map(key => stationJobs[match.params.id][key])
      .filter((job: JobModel) => job.status === EJobStatus.running);
  }
  return (
    <>
      <StationJobsHeader setMode={setMode} />
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
              {jobList
                .sort((a: JobModel, b: JobModel) => {
                  if (a.upload_time < b.upload_time) return 1;
                  if (a.upload_time > b.upload_time) return -1;
                  return 0;
                })
                .map((job: any) => {
                  return (
                    <Job
                      key={job.id}
                      job={job}
                      isSentJob={job.landing_zone !== currentUser.user_id}
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
