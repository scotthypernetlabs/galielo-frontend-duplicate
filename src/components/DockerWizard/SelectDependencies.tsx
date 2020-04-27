import { Autocomplete } from "@material-ui/lab"; // we need this to make JSX compile
import {
  Box,
  Typography,
  Button,
  Icon,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Field, FieldArray } from "formik";
import AddIcon from "@material-ui/icons/Add";
import Dependency from "./Dependency";
import React, { useState } from "react";
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
  dependenciesEmpty: any;
  props: any;
}

const SelectDependencies: React.SFC<SelectDependenciesProps> = (
  props: SelectDependenciesProps
) => {
  let {
    dependencies,
    dependency,
    initialValues,
    dependenciesEmpty,
  } = props;
  const [value, setValue] = useState("");
  const [dependenciesList, setDependenciesList] = useState([]);
  const [showTextField, setShowTextField] = useState(false);
  const [enteredDependencies, setEnteredDependencies] = useState("");
  const [addEnteredDependencies, SetAddEnteredDependencies] = useState(false)
  const [enteredDependeciesError, setEnteredDependenciesError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const removeDependency = (index: number) => {
    dependenciesEmpty(dependenciesList.length>1);
    const temp = [...dependenciesList];
    console.log(temp)
    if (index > -1) {
      const value = temp[index].name;
      console.log(value)
      setDependenciesList(temp);
      if(!temp[index].manuallyEntered){
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
    setEnteredDependencies(e.target.value);
    if(e.target.value.includes(',')){
      setEnteredDependenciesError(true);
      setErrorMessage('Enter the dependencies space seperated')
    } else {
      setEnteredDependenciesError(false);
      setErrorMessage('')
    }
  
  };
  const addDependencies = (dependencies: string)=> {
    if (dependencies.includes(" ")){
      let dependeciesList2:Array<string> = [];
      let dependeciesList3:any = [];
      dependeciesList2 = dependencies.split(/\s+/);
      dependeciesList2.forEach((item)=>dependeciesList3.unshift({ name: item, version: "latest version", manuallyEntered: true }))
      setDependenciesList(dependenciesList.concat(dependeciesList3));
    } else {
      let dependeciesList2 = [];
      dependeciesList2.unshift({ name: dependencies, version: "latest version", manuallyEntered: true })
      setDependenciesList(dependenciesList.concat(dependeciesList2));
    }
    dependenciesEmpty(true);
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
    const result = dependenciesList.find(({ name }) => name === value);
    if (result === undefined) {
      setDependenciesList([
        { name: value, version: "latest version", manuallyEntered: false  },
        ...dependenciesList,
      ]);
      const indexOfValue = listOfDependencies.indexOf(value);
      listOfDependencies.splice(indexOfValue, 1);
    } else {
      alert("This dependency already added");
    }
    dependenciesEmpty(true);
    setValue("");
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
            {showTextField && (
              <Box flexGrow={2} my={1}>
                <TextField
                    error = {enteredDependeciesError}
                    id="outlined-multiline-static"
                    label="Enter the dependencies here space seperated"
                    multiline
                    value = {enteredDependencies}
                    onChange = {validateEnteredDependencies}
                    rows={4}
                    defaultValue="Default Value"
                    helperText={errorMessage}
                    variant="outlined"
                  />
                {/* <Field
                  component={TextField}
                  multiline
                  style={{ width: 500 }}
                  onChange = {handleEnteredDependencies}
                  label="Enter the dependencies here space seperated"
                  variant="outlined"
                  // value = {}
                  inputProps={{
                    id: "framework",
                  }}
                ></Field> */}
                <Button 
                onClick={()=>addDependencies(enteredDependencies)}
                >Enter
                </Button>
                <p>{enteredDependencies}</p>
              </Box>
            )}
          </div>
        )}
      />
    </>
  );
};

export default SelectDependencies;
