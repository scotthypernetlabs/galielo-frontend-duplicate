import { Box, Card } from "@material-ui/core";
import { RouteComponentProps } from "react-router-dom";
import Jobs from "../components/Jobs/Jobs";
import Notifications from "../components/Notifications";
import React from "react";
import Stations from "../components/Stations/Stations/Stations";

interface Props extends RouteComponentProps<any> {}
const Dashboard: React.SFC<Props> = (props: Props) => {
  const { history, location, match } = props;
  return (
    <div className="jobs-container">
      <Box mb={3}>
        <Card>
          <Stations
            slice={true}
            numberOfStations={4}
            history={history}
            location={location}
            match={match}
          />
        </Card>
      </Box>
      <Box mb={3}>
        <Card>
          <Jobs history={history} showButtonGroup={false} numberOfJobs={5} />
        </Card>
      </Box>
      <Card>
        <Notifications
          numberOfNotifications={5}
          history={history}
          location={location}
          match={match}
        />
      </Card>
    </div>
  );
};
export default Dashboard;
