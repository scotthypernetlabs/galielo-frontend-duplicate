import {
  Box,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography
} from "@material-ui/core";
import { Station } from "../../../business/objects/station";
import { User } from "../../../business/objects/user";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import Header from "../../Core/Header";
import React from "react";
import StationBox from "../StationBox/StationBox";

export enum StationsSortOptions {
  created = "Date Created",
  name = "Name",
  launchers = "# of Launchers",
  machines = "# of Machines",
  last_used = "Last Used"
}

interface StationsViewProps {
  slice: boolean;
  numberOfStations?: number;
  openCreateStation: any;
  history: any;
  stations: Station[];
  currentUser: User;
  sortStations: any;
  setOrder: any;
}

const StationsView: React.SFC<StationsViewProps> = (
  props: StationsViewProps
) => {
  const {
    openCreateStation,
    history,
    stations,
    currentUser,
    numberOfStations,
    sortStations,
    setOrder
  } = props;

  const pendingStations: Station[] = [];
  const activeStations: Station[] = [];
  const [selected, setSelected] = React.useState(false);
  stations.map((station: Station) => {
    if (station.invited_list.includes(currentUser.user_id)) {
      pendingStations.push(station);
    } else {
      activeStations.push(station);
    }
  });

  const handleSortStations = (e: any) => {
    sortStations(e.target.value, selected ? "asc" : "desc");
  };

  return (
    <div>
      <Header
        title={`${props.slice ? "Recently Used" : ""} Stations`}
        titleVariant="h3"
        showButton={!props.slice}
        onClickButton={openCreateStation}
        buttonText="Add Station"
      />
      {!props.slice && (
        <Box
          display="flex"
          flexDirection="row-reverse"
          alignItems="center"
          mt={2}
          mb={2}
        >
          <Box>
            <IconButton
              size="small"
              onClick={() => {
                setOrder(selected ? "desc" : "asc");
                setSelected(!selected);
              }}
            >
              {selected ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Box>
          <Box mr={1}>
            <FormControl>
              <Select
                defaultValue={StationsSortOptions.name}
                onChange={handleSortStations}
              >
                {/* <MenuItem value={StationsSortOptions.created}>*/}
                {/*  {StationsSortOptions.created}*/}
                {/* </MenuItem>*/}
                <MenuItem value={StationsSortOptions.name}>
                  {StationsSortOptions.name}
                </MenuItem>
                <MenuItem value={StationsSortOptions.launchers}>
                  {StationsSortOptions.launchers}
                </MenuItem>
                <MenuItem value={StationsSortOptions.machines}>
                  {StationsSortOptions.machines}
                </MenuItem>
                {/* <MenuItem value={StationsSortOptions.last_used}>*/}
                {/*  {StationsSortOptions.last_used}*/}
                {/* </MenuItem>*/}
              </Select>
            </FormControl>
          </Box>
          <Box mr={1}>{"Sort By: "}</Box>
        </Box>
      )}
      <Grid container>
        {activeStations
          .slice(0, numberOfStations)
          .map((station: Station, idx: number) => {
            if (
              !station.machines ||
              !station.members ||
              !Object.keys(station.volumes)
            ) {
              return <React.Fragment key={`station-${idx}`} />;
            }
            return (
              <StationBox
                key={`station-${idx}`}
                pending={false}
                station={station}
                history={history}
              />
            );
          })}
        {!props.slice && (
          <Grid container style={{ paddingTop: 50 }}>
            <Grid item>
              <Typography>
                Pending Invitations ({pendingStations.length})
              </Typography>
            </Grid>
            <Grid container>
              {pendingStations.map((station: Station, idx: number) => {
                if (
                  !station.machines ||
                  !station.members ||
                  !Object.keys(station.volumes)
                ) {
                  return <React.Fragment key={`pending-station-${idx}`} />;
                }
                return (
                  <StationBox
                    key={`pending-station-${idx}`}
                    pending={true}
                    station={station}
                    history={history}
                  />
                );
              })}
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};
export default StationsView;
