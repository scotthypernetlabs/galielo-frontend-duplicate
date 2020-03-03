import { Button, TextField } from "@material-ui/core";
import React from "react";

interface EditTextFormProps {
  name: string;
  handleChange: any;
  handleEditName: any;
}

const EditTextForm: React.SFC<EditTextFormProps> = (
  props: EditTextFormProps
) => {
  const { name, handleChange, handleEditName } = props;
  return (
    <div>
      <TextField
        value={name}
        variant="outlined"
        size="small"
        onChange={handleChange}
      />
      <div>
        <Button variant="contained" onClick={handleEditName(true)}>
          Save
        </Button>
        <Button variant="contained" onClick={handleEditName(false)}>
          Discard
        </Button>
      </div>
    </div>
  );
};

export default EditTextForm;
