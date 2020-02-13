import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { Dictionary } from '../../business/objects/dictionary';
import { Job as JobModel, GetJobFilters } from '../../business/objects/job';
import Pagination from "material-ui-flat-pagination";
import Job from './Job';
import { MyContext } from '../../MyContext';
import { context } from '../../context';
import { User } from '../../business/objects/user';
import {
  Button,
  ButtonGroup,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow, Typography
} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import JobsButtonGroup from "./JobsButtonGroup";

type Props = {
  sentJobs: Dictionary<JobModel>;
  receivedJobs: Dictionary<JobModel>;
  currentUser: User;
}
// True = sent jobs
type State = {
  mode: boolean;
  offset: number;
}

class Jobs extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      mode: true,
      offset: 0,
    }
    this.toggleMode = this.toggleMode.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount(){
    if(this.props.currentUser.user_id !== 'meme'){
      let filters = new GetJobFilters(null, null, [this.props.currentUser.user_id], null, null, 1, 25);
      this.context.jobService.getJobs(filters);
    }
  }
  componentDidUpdate(prevProps: Props, prevState: State){
    if(prevProps.currentUser.user_id === 'meme' && this.props.currentUser.user_id !== 'meme'){
      let filters = new GetJobFilters(null, null, [this.props.currentUser.user_id], null, null, 1, 25);
      this.context.jobService.getJobs(filters);
    }
  }
  toggleMode(){
    this.setState(prevState =>({
      mode: !prevState.mode
    }));
  }
  generateJobList(jobs:JobModel[]){
    if(jobs.length > 0){
      let jobs_reversed:JobModel[] = jobs.sort((a:JobModel, b:JobModel) => {
        if(a.upload_time < b.upload_time) return 1;
        if(a.upload_time > b.upload_time) return -1;
        return 0;
      });
      return(
        jobs_reversed.map((job, idx) => {
          return (
            <Job
              key={job.id}
              job={job}
              isSentJob={this.state.mode}
              />
          )
        })
      )
    }
  }
  handleClick(offset:number){
    this.setState({
      offset
    })
  }
  render(){
    const { mode } = this.state;
    let jobs:Dictionary<JobModel> = {};
    if(mode){
      jobs = Object.assign({}, this.props.sentJobs);
    }else{
      jobs = Object.assign({}, this.props.receivedJobs);
    }

    return(
      <div className="jobs-container">
          <Grid container justify="center">
            <Grid item>
              <JobsButtonGroup toggleMode={this.toggleMode} mode={this.state.mode} />
            </Grid>
          </Grid>
        <Typography
          variant="h4"
          style={{fontWeight: 500}}
          gutterBottom={true}
        >
          Your Recent {mode ? 'Sent' : 'Received'} Jobs
        </Typography>
        {Object.keys(jobs).length > 0 ?
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
                { this.generateJobList(Object.keys(jobs).map(job_id => jobs[job_id])) }
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
          </TableContainer> :
          <h4>No jobs</h4>
        }
      </div>
    );
  }
}

Jobs.contextType = context;

const mapStateToProps = (state:IStore) => ({
  sentJobs: state.jobs.sentJobs,
  receivedJobs: state.jobs.receivedJobs,
  currentUser: state.users.currentUser
});

export default connect(mapStateToProps)(Jobs);
