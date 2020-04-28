import { Box, MenuItem, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-material-ui";
import React from "react";

const HecRasFileSystem: React.SFC = () => {
  return (
    <>
      <Typography color="primary" id="dependencies-header">
        <Box fontSize="h2.fontSize" m={1}>
          Set your Network File System paths
        </Box>
      </Typography>
      <Typography id="dependencies-helper-text">
        <Box m={1}>
          So Galileo knows where to look for your project and relevant data
        </Box>
      </Typography>
      <Box mt={7}>
        <Field
          style={{ width: 500 }}
          required
          className="center-vertically"
          label={"Enter the system path of your RAS project folder"}
          component={TextField}
          placeholder="Ras Model Path"
          name="sourcePath"
          // defaultValue = {"C:\\Users\\Public\\Output"}
          variant="outlined"
          inputProps={{
            id: "framework"
          }}
        />
        <Box mt={3}>
          <Field
            required
            className="center-vertically"
            style={{ width: 500 }}
            label={
              "Enter where you would like Galileo to output your results to"
            }
            component={TextField}
            placeholder="Ras Model Path"
            name="destinationPath"
            variant="outlined"
            defaultValue={"C:\\Users\\Public\\Output"}
            helperText={"C:\\Users\\Public\\Output"}
            inputProps={{
              id: "framework"
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default HecRasFileSystem;
