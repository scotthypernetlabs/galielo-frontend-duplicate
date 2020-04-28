import { Autocomplete, Alert } from "@material-ui/lab"; // we need this to make JSX compile
import {
  Box,
  Typography,
  Button,
  Icon,
  InputAdornment,
  IconButton,
  Collapse,
} from "@material-ui/core";
import { Field, FieldArray } from "formik";
import AddIcon from "@material-ui/icons/Add";
import Dependency from "./Dependency";
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";

const listOfDependencies = [
  "",
  "Other",
  "tidyr",
  "ggplot2",
  "ggraph",
  "dplyr",
  "tidyquant",
  "dygraphs",
  "glue",
  "leaflet",
  "shiny",
];

interface SelectDependenciesProps {
  dependencies: Array<any>;
  dependency: string;
  initialValues: any;
  dependenciesEmpty: any;
  props: any;
}

const SelectDependencies: React.SFC<SelectDependenciesProps> = (
  props: SelectDependenciesProps
) => {
  let { dependencies, dependency, initialValues, dependenciesEmpty } = props;
  const [option, setOption] = useState("");
  const [dependenciesList, setDependenciesList] = useState([]);
  const [showTextField, setShowTextField] = useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);

  const [enteredDependencies, setEnteredDependencies] = useState("");
  const [addEnteredDependencies, SetAddEnteredDependencies] = useState(false);
  const [enteredDependeciesError, setEnteredDependenciesError] = useState(
    false
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [
    addDependenciesButtonActive,
    setAddDependenciesButtonActive,
  ] = useState(false);

  const dependencyHelerText = (projectType: string) => {
    switch (projectType) {
      case "Python":
        return "pip install";
        break;
      case "R":
        return "install.packages()";
        break;
      case "Stata":
        return "ssc install";
        break;
      default:
        "";
    }
  };

  const removeDependency = (index: number) => {
    dependenciesEmpty(dependenciesList.length > 1);
    const temp = [...dependenciesList];
    console.log(temp);
    if (index > -1) {
      const value = temp[index].name;
      console.log(value);
      setDependenciesList(temp);
      if (!temp[index].manuallyEntered) {
        listOfDependencies.splice(index, 0, value);
      }
      temp.splice(index, 1);
    }
  };
  const updateDependency = (index: number, value: string) => {
    const tempList = [...dependenciesList];
    tempList[index].version = value;
    setDependenciesList(tempList);
    dependencies = tempList;
  };
  const validateEnteredDependencies = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value.length > 0) {
      setAddDependenciesButtonActive(true);
    } else {
      setAddDependenciesButtonActive(false);
    }
    setEnteredDependencies(e.target.value);
    if (e.target.value.includes(",")) {
      setEnteredDependenciesError(true);
      setErrorMessage("Enter the dependencies space seperated");
    } else {
      setEnteredDependenciesError(false);
      setErrorMessage("");
    }
  };
  const addDependencies = (dependencies: string) => {
    if (dependencies === "" || dependencies == null) {
      return;
    }
    if (dependencies.includes(" ")) {
      let dependeciesList2: Array<string> = [];
      let dependeciesList3: any = [];
      dependeciesList2 = dependencies.split(/\s+/);
      dependeciesList2.forEach((item) =>
        dependeciesList3.unshift({
          name: item,
          version: "latest version",
          manuallyEntered: true,
        })
      );
      setDependenciesList(dependenciesList.concat(dependeciesList3));
    } else {
      let dependeciesList2 = [];
      dependeciesList2.unshift({
        name: dependencies,
        version: "latest version",
        manuallyEntered: true,
      });
      setDependenciesList(dependenciesList.concat(dependeciesList2));
    }
    dependenciesEmpty(true);
    setShowTextField(false);
  };

  const onDependencyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setOption(value);
  };
  const addDependency = (option: string) => {
    if (option === "" || option == null) {
      return;
    }
    if (option === "Other") {
      setShowTextField(true);
      return;
    }
    const result = dependenciesList.find(({ name }) => name === option);
    if (result === undefined) {
      setDependenciesList([
        { name: option, version: "latest version", manuallyEntered: false },
        ...dependenciesList,
      ]);
      const indexOfValue = listOfDependencies.indexOf(option);
      listOfDependencies.splice(indexOfValue, 1);
    } else {
      setOpenAlert(true);
    }
    dependenciesEmpty(true);
    setOption("");
  };

  return (
    <>
      <Typography color="primary" id="depndencies-header">
        <Box m={1} fontSize="h2.fontSize">
          Add dependencies for your {initialValues.projectType} project
        </Box>
      </Typography>
      <Typography id="dependencies-helper-text">
        <Box mb={7}>
          {`Things you normally need to install for your project via ${dependencyHelerText(
            initialValues.projectType
          )}`}
        </Box>
      </Typography>

      <FieldArray
        name="dependencies"
        render={({ remove }) => (
          <div>
            <Box display="flex" flexDirection="row">
              <Box style={{ height: 100 }} flexGrow={2} my={1}>
                {!showTextField && (
                  <>
                    <Box
                      mb={2}
                      className="center-vertically"
                      style={{ width: 500 }}
                    >
                      <Collapse in={openAlert}>
                        <Alert
                          severity="error"
                          action={
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                              onClick={() => {
                                setOpenAlert(false);
                              }}
                            >
                              <CloseIcon fontSize="inherit" />
                            </IconButton>
                          }
                        >
                          This dependency has alredy been added.
                        </Alert>
                      </Collapse>
                    </Box>
                    <Box className="center-vertically">
                      <Autocomplete
                        disabled={openAlert}
                        options={listOfDependencies.sort()}
                        style={{ width: 500 }}
                        onChange={onDependencyChange}
                        value={option}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            value={option}
                            label="Select dependency"
                            variant="outlined"
                            defaultValue={[listOfDependencies[0]]}
                            fullWidth
                          />
                        )}
                      />
                      <Button
                        color="primary"
                        onClick={() => {
                          addDependency(option);
                        }}
                      >
                        {option === "Other"
                          ? "Add Dependencies Manually"
                          : "Add Dependency"}
                      </Button>
                    </Box>
                  </>
                )}
                {showTextField && (
                  <Box
                    className="center-vertically"
                    style={{ width: 500 }}
                    my={1}
                  >
                    <TextField
                      error={enteredDependeciesError}
                      id="outlined-multiline-static"
                      label="Enter the dependencies here space seperated"
                      multiline
                      onChange={validateEnteredDependencies}
                      rows={4}
                      helperText={errorMessage}
                      variant="outlined"
                    />
                    <Button
                      disabled={!addDependenciesButtonActive}
                      color="primary"
                      onClick={() => addDependencies(enteredDependencies)}
                    >
                      Add Dependencies
                    </Button>
                    <Button onClick={() => setShowTextField(false)}>
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              className="dependency-list"
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
            >
              {dependenciesList.map((item: "srting", index: number) => {
                return (
                  <div key={index}>
                    <Dependency
                      updateDependency={updateDependency}
                      item={item}
                      index={index}
                      onDelete={() => removeDependency(index)}
                    />
                  </div>
                );
              })}
            </Box>
          </div>
        )}
      />
    </>
  );
};

export default SelectDependencies;
