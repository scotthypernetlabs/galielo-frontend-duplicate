import { Box, FormGroup, Switch, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-material-ui";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React, { useState } from "react";

interface SelectVersionProps {}
const SelectAdvancedSettings: React.SFC<SelectVersionProps> = (
  props: SelectVersionProps
) => {
  const [argumentChecked, setArgumentChecked] = React.useState(false);
  const [cpuChecked, setCpuChecked] = React.useState(false);
  const toggleArgumentChecked = () => {
    setArgumentChecked(prev => !prev);
  };
  const toggleCpuChecked = () => {
    setCpuChecked(prev => !prev);
  };
  return (
    <>
      <Typography color="primary" id="depndencies-header">
        <Box fontSize="h2.fontSize" mb={1}>
          You are almost there
        </Box>
      </Typography>
      <Typography id="dependencies-helper-text">
        <Box mb={3}>
          A few advanced settings. Leave as deafult you are not familar with
          them
        </Box>
      </Typography>
      <Box id="first-raw">
        <Box display="flex">
          <Box id="arguments-text" flexGrow={1}>
            <Typography id="project-arguments">
              <Box fontSize="h3.fontSize" mb={1}>
                Pass arguments to project
              </Box>
            </Typography>
            <Typography id="project-arguments-helper-text">
              <Box fontSize="h6.fontSize" mb={3}>

                {
                  "If normally would run your project with a command line like: 'julia project.jl data.csv graph.gph.' The arguments to your project are: 'data.csv graph.gph'"
                }

              </Box>
            </Typography>
          </Box>
          <Box id="arguments-switch">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={argumentChecked}
                    onChange={toggleArgumentChecked}
                  />
                }
                label=""
              />
            </FormGroup>
          </Box>
        </Box>
        <Box>
          {argumentChecked && (
            <Field
              component={TextField}
              name="projectArguments"
              variant="outlined"
              placeholer="eg. small.csv autputgraph.gph"

            ></Field>

          )}
        </Box>
      </Box>
      <Box id="second-row">
        <Box id="CPU-usage" display="flex">
          <Box flexGrow={1}>
            <Typography id="CPU-usage-title">
              <Box fontSize="h3.fontSize" mb={1}>
                Customize CPU usage
              </Box>
            </Typography>
            <Typography id="CPU-usage-helper-text">
              <Box fontSize="h6.fontSize" mb={3}>
                {`You can set the number of cores to use for your project. By
                default, we will use what we think is the best suited for your
                project`}
              </Box>
            </Typography>
          </Box>
          <Box id="CPU-usage-switch">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch checked={cpuChecked} onChange={toggleCpuChecked} />
                }
                label=""
              />
            </FormGroup>
          </Box>
        </Box>
        <Box>
          {cpuChecked && (
            <Field
              component={TextField}
              name="cpuUsage"
              type="number"
              variant="outlined"
              size="small"
              inputProps={{ min: "0", max: "100", step: "1" }}
              placeholer="eg. small.csv autputgraph.gph"

            ></Field>

          )}
        </Box>
      </Box>
    </>
  );
};

export default SelectAdvancedSettings;
