import { Box, Typography } from "@material-ui/core";
import { startScreenBackgroundStyle, startupContainer } from "./StartUpScreen";
import Button from "@material-ui/core/Button";
import React from "react";

type Props = {};
type State = {};

class SelectFramework extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const frameworks = [
      ["Julia", "Python", "R"],
      ["HEC-RAS", "SWMM", "Other"]
    ];
    return (
      <div style={startScreenBackgroundStyle}>
        <div style={startupContainer}>
          <Box>
            <Typography variant="h1" style={{ color: "white" }}>
              {"Welcome to Galileo"}
            </Typography>
          </Box>
          <Box mt={2} mb={1}>
            <Typography variant="h3" style={{ color: "white" }}>
              {"Please select a framework you use the most often"}
            </Typography>
          </Box>
          <Box mb={4}>
            <Typography variant="h3" style={{ color: "white" }}>
              {"This helps us provide a tailored experience for you"}
            </Typography>
          </Box>
          {frameworks.map((row: string[], idx: number) => {
            return (
              <Box key={`framework-${idx}`} display="flex">
                {row.map((framework: string) => {
                  return (
                    <Box
                      bgcolor="rgb(255, 255, 255, 0.2)"
                      minWidth="200px"
                      maxWidth="200px"
                      minHeight="130px"
                      maxHeight="130px"
                      key={framework}
                      m={1}
                    >
                      {framework}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
          <Box mt={8}>
            <Button variant="contained" color="primary">
              {"Let's Go"}
            </Button>
          </Box>
        </div>
      </div>
    );
  }
}

export default SelectFramework;
