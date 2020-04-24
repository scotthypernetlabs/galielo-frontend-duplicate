import { Autocomplete } from "@material-ui/lab"; // we need this to make JSX compile
import {
  Box,
  Typography,
  Button,
  Icon,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Field, FieldArray, Form, Formik } from "formik";
import { Select } from "formik-material-ui";
import { TextFieldProps, fieldToTextField } from "formik-material-ui";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Dependency from "./Dependency";
import React, { useCallback, useState } from "react";
import TextField from "@material-ui/core/TextField";

const listOfDependencies = [
  "",
  "Enter to add",
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
  toggleDependenciesSelected: any;
}

const SelectDependencies: React.SFC<SelectDependenciesProps> = (
  props: SelectDependenciesProps
) => {
  let {
    dependencies,
    dependency,
    initialValues,
    toggleDependenciesSelected,
  } = props;
  const [value, setValue] = useState("");
  const [addingDependency, setAddingDependency] = useState(false);
  const [dependenciesList, setDependenciesList] = useState([]);
  const [showTextField, setShowTextField] = useState(false);
  const [enteredDependencies, setEnteredDependencies] = useState("");
  const removeDependency = (index: number) => {
    const temp = [...dependenciesList];
    console.log(temp);
    if (index > -1) {
      const value = temp[index].name;
      temp.splice(index, 1);
      console.log(temp);
      setDependenciesList(temp);
      dependencies.splice(index, 1);
      listOfDependencies.splice(index, 0, value);
    }
  };
  const updateDependency = (index: number, value: string) => {
    const tempList = [...dependenciesList];
    tempList[index].version = value;
    setDependenciesList(tempList);
    dependencies = tempList;
  };
  const handleEnteredDependencies = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setEnteredDependencies(e.target.value)
  } 

  const addDependency = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (value === "" || value == null) {
      return;
    }
    if (value === "Enter to add") {
      setShowTextField(true);
      return;
    }
    const result = dependencies.find(({ name }) => name === value);
    if (result === undefined) {
      toggleDependenciesSelected();
      setDependenciesList([
        { name: value, version: "latest version" },
        ...dependenciesList,
      ]);
      event.target.value = "";
      dependencies.unshift({ name: value, version: "latest version" });
      const indexOfValue = listOfDependencies.indexOf(value);
      listOfDependencies.splice(indexOfValue, 1);
    } else {
      alert("This dependency already added");
    }
    setValue("");
    setAddingDependency(false);
  };

  return (
    <>
      <Typography color="primary" id="depndencies-header">
        <Box m={1} fontSize="h2.fontSize">
          Add dependencies for your {initialValues.projectType} project
        </Box>
      </Typography>
      <Typography id="dependencies-helper-text">
        <Box m={1}>
          Things you normally need to install for your project via pkg.add()
        </Box>
      </Typography>
      <Box mt={3} mb={1}></Box>

      <FieldArray
        name="dependencies"
        render={({ remove }) => (
          <div>
            <Box display="flex" flexDirection="row">
              <Box style={{ height: 100 }} flexGrow={2} my={1}>
                <Autocomplete
                  options={listOfDependencies}
                  style={{ width: 500 }}
                  onChange={addDependency}
                  value=""
                  onKeyPress={(event: React.KeyboardEvent) => {
                    if (event.key == "Enter") {
                      event.preventDefault();
                      addDependency;
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      value={value}
                      label="Select dependency"
                      variant="outlined"
                      defaultValue={[listOfDependencies[0]]}
                      fullWidth
                    />
                  )}
                />
              </Box>
              {showTextField && (
                <Box flexGrow={2} my={1}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Enter the dependencies here space seperated"
                    multiline
                    value = {enteredDependencies}
                    onChange = {handleEnteredDependencies}
                    rows={4}
                    defaultValue="Default Value"
                    variant="outlined"
                  />
                  <p>{enteredDependencies}</p>
                  {/* <Field
                    required
                    component={TextField}
                    style={{ width: 500 }}
                    // onChange={ hadleChange(event.target as HTMLInputElement)}
                    // label={`Name of your ${extension} file eg. project for project ${extension} file`}
                    name=""
                    multiline
                    label="Enter your dependencies"
                    variant="outlined"
                    // value = {}
                    inputProps={{
                      id: "framework",
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {}}
                          edge="end"
                        >
                          <AddIcon fontSize = "small"/>
                        </IconButton>
                      </InputAdornment>
                    }
                  ></Field> */}
                </Box>
              )}
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
