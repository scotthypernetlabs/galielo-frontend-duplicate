import { Box, Typography } from "@material-ui/core";
import { FrameworkBoxHover } from "./FrameworkBoxHover";
import { startScreenBackgroundStyle, startupContainer } from "../StartUpScreen";
import Button from "@material-ui/core/Button";
import React from "react";

type Props = {};
type State = {
  hover: boolean;
};

type Framework = {
  name: string;
  onClick: any;
};

class SelectFramework extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hover: false
    };
    this.setHover = this.setHover.bind(this);
  }

  setHover() {
    this.setState({ hover: true });
  }

  render() {
    const { hover } = this.state;
    const frameworks = [
      [
        { name: "Julia", onClick: () => {} },
        { name: "Python", onClick: () => {} },
        { name: "R", onClick: () => {} }
      ],
      [
        { name: "HEC-RAS", onClick: () => {} },
        { name: "SWMM", onClick: () => {} },
        { name: "Other", onClick: () => {} }
      ]
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
          {frameworks.map((row: Framework[], idx: number) => {
            return (
              <Box key={`framework-${idx}`} display="flex">
                {row.map((framework: Framework) => {
                  return (
                    <FrameworkBoxHover
                      handleHover={this.setHover}
                      onClick={framework.onClick}
                      hover={hover}
                      key={framework.name}
                      text={framework.name}
                    />
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
