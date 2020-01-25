import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IStore } from '../../business/objects/store';
import { Dictionary } from '../../business/objects/dictionary';
import { Job as JobModel, GetJobFilters } from '../../business/objects/job';
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

type Props = {
  sentJobs: Dictionary<JobModel>;
  receivedJobs: Dictionary<JobModel>;
  currentUser: User;
}
// True = sent jobs
type State = {
  mode: boolean;
}

class Jobs extends React.Component<Props, State> {
  context!: MyContext;
  constructor(props: Props){
    super(props);
    this.state = {
      mode: true
    }
    this.toggleMode = this.toggleMode.bind(this);
  }
  componentDidMount(){
    if(this.props.currentUser.user_id !== 'meme'){
      let filters = new GetJobFilters(null, null, [this.props.currentUser.user_id], null, null, null, null);
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
    }else{
      return(
        <h3>No jobs</h3>
      )
    }
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
              <ToggleButtonGroup>
                <ToggleButton
                  value="Sent"
                  selected={mode}
                  onClick={this.toggleMode}
                >
                  Sent
                </ToggleButton>
                <ToggleButton
                  value="Received"
                  selected={!mode}
                  onClick={this.toggleMode}
                >
                  Received
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        <Typography
          variant="h4"
          style={{fontWeight: 500}}
          gutterBottom={true}
        >
          Your Recent {mode ? 'Sent' : 'Received'} Jobs
        </Typography>
        {Object.keys(jobs).length > 0 &&
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
          </TableContainer>}
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
