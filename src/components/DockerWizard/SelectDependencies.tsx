import { Autocomplete } from "@material-ui/lab"; // we need this to make JSX compile
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Typography
} from "@material-ui/core";
import { Field, FieldArray, Form, Formik } from "formik";
import { Select } from "formik-material-ui";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Dependency from "./Dependency";
import React, { useCallback, useState } from "react";
import TextField from "@material-ui/core/TextField";

const listOfDependencies = [
  "tidyr",
  "ggplot2",
  "ggraph",
  "dplyr",
  "tidyquant",
  "dygraphs",
  "glue",
  "leaflet",
  "shiny"
];

interface SelectDependenciesProps {
  dependencies: Array<any>;
  dependency: string;
  initialValues: any;
}

const SelectDependencies: React.SFC<SelectDependenciesProps> = (
  props: SelectDependenciesProps
) => {
  let { dependencies, dependency, initialValues } = props;
  const [value, setValue] = useState(null);

  const [dependenciesList, setDependenciesList] = useState([]);
  const removeDependency = (index: number) => {
    const temp = [...dependenciesList];
    if (index > -1) {
      temp.splice(index, 1);
      setDependenciesList(temp);
      dependencies.splice(index, 1);
    }
  };
  const updateDependency = (index: number, value: string) => {
    const tempList = [...dependenciesList];
    tempList[index].version = value;
    setDependenciesList(tempList);
    dependencies = tempList;
  };

  // const addDependency = (dependency: string, version: string) =>{
  //   console.log(dependency)
  //   setDependenciesList([...dependenciesList, dependency]);
  //   console.log(dependenciesList)
  //   dependencies.push({name: dependency, version: initialValues.version})
  //   }

  const addDependency = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    console.log(value);
    const result = dependencies.find(({ name }) => name === value);
    if (result === undefined) {
      setDependenciesList([
        { name: value, version: "latest version" },
        ...dependenciesList
      ]);
      dependencies.unshift({ name: value, version: "latest version" });
    } else {
      alert("This dependency already added");
    }
  };
  // const updateDependency = (index: number) => {
  //   const temp = [...dependenciesList];
  //   if (index > -1) {
  //     temp.splice(index, 1);
  //     setDependenciesList(temp);
  //     dependencies.splice(index, 1);
  //   }
  // };
  return (
    <>
      <Typography color="primary" id="depndencies-header">
        <Box fontSize="h2.fontSize" m={1}>
          Add dependencies for your {initialValues.projectType} project
        </Box>
      </Typography>
      <Typography id="dependencies-helper-text">
        <Box m={1}>
          Things you normally need to install for your project via pkg.add()
        </Box>
      </Typography>
      <FieldArray
        name="dependencies"
        render={({ remove }) => (
          <div>
            <Box display="flex">
              <Box my={1}>
                <Autocomplete
                  options={listOfDependencies}
                  freeSolo
                  value={value}
                  style={{ width: 300 }}
                  onChange={addDependency}
                  onKeyPress={(event: React.KeyboardEvent) => {
                    if (event.key == "Enter") event.preventDefault();
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Select dependency"
                      variant="outlined"
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
            {/* <Button
                            variant="outlined"
                            size= "large"
                            color="primary"
                            onClick={() => removeDependency(dependencies, dependency)}
                            startIcon={<DeleteIcon />}
                        ></Button> */}
          </div>
        )}
      />
    </>
  );
};

export default SelectDependencies;
