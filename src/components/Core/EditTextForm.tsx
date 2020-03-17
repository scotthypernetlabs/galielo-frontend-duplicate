import { Button, TextField } from "@material-ui/core";
import React from "react";

interface EditTextFormProps {
  name: string;
  handleChange: any;
  handleEditText: any;
  handleDiscardText: any;
}

const EditTextForm: React.SFC<EditTextFormProps> = (
  props: EditTextFormProps
) => {
  const { name, handleChange, handleEditText, handleDiscardText } = props;
  return (
    <div>
      <TextField
        value={name}
        variant="outlined"
        size="small"
        onChange={handleChange}
      />
      <div>
        <Button variant="contained" onClick={handleEditText}>
          Save
        </Button>
        <Button variant="contained" onClick={handleDiscardText}>
          Discard
        </Button>
      </div>
    </div>
  );
};

export default EditTextForm;
