import { Box, MenuItem, Typography } from "@material-ui/core"; // we need this to make JSX compile
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-material-ui";
import React from "react";

const HecRasFileSystem: React.SFC = () => {
  return (
    <>
      <Typography color="primary" id="depndencies-header">
        <Box fontSize="h2.fontSize" m={1}>
          Set your Network File System paths
        </Box>
      </Typography>
      <Typography id="dependencies-helper-text">
        <Box m={1}>
          SoGalilieo nkows where to look for your project and relevant data
        </Box>
      </Typography>
      <Box mt={5}>
        <label htmlFor="sourcePath">
          Enter the system path of your RAS project folder
        </label>
        <Field
          required
          component={TextField}
          placeHolder="Ras Model Path"
          name="sourcePath"
          variant="outlined"
          inputProps={{
            id: "framework"
          }}
        ></Field>
        <label htmlFor="destinationPath">
          Enter where you would like Galileo to output your results to
        </label>
        <Field
          required
          component={TextField}
          placeHolder="Ras Model Path"
          name="destinationPath"
          variant="outlined"
          inputProps={{
            id: "framework"
          }}
        ></Field>
      </Box>
    </>
  );
};

export default HecRasFileSystem;
