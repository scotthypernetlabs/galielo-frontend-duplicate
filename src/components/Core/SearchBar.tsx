import { InputBase } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import React from "react";
import SearchIcon from "@material-ui/icons/Search";

export interface SearchBarProps {
  placeholder: string;
  onInputChange: any;
}
export const SearchBar: React.SFC<SearchBarProps> = (props: SearchBarProps) => {
  const { placeholder, onInputChange } = props;
  return (
    <Paper component="form" variant="outlined" style={{ width: "40%" }}>
      <InputBase
        fullWidth={true}
        startAdornment={<SearchIcon />}
        placeholder={placeholder}
        inputProps={{ "aria-label": "search" }}
        onChange={onInputChange}
        onKeyPress={(event: React.KeyboardEvent) => {
          if (event.key == "Enter") event.preventDefault();
        }}
      />
    </Paper>
  );
};
