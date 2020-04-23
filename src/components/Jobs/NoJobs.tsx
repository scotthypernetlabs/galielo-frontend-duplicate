import { Box, Typography } from "@material-ui/core";
import React from "react";
import galileoRocket from "../../images/rocket-gray.png";

export interface NoJobsProps {}

const NoJobs: React.SFC<NoJobsProps> = (props: NoJobsProps) => {
  return (
    <Box
      display="flex"
      mt={3}
      mb={3}
      justifyContent="center"
      alignItems="center"
    >
      <Box mr={5}>
        <img src={galileoRocket} alt="Empty Inbox" width="100" height="100" />
      </Box>
      <Typography>
        {" "}
        You have no jobs.{" "}
        <a
          href="https://github.com/GoHypernet/Galileo-examples/archive/master.zip"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download some sample jobs to run.
        </a>{" "}
      </Typography>
    </Box>
  );
};

export default NoJobs;
