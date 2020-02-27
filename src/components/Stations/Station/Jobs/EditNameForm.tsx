import { Button, TextField } from "@material-ui/core";
import React from "react";

interface EditNameFormProps {
  name: string;
  handleChange: any;
  handleEditName: any;
}

const EditNameForm: React.SFC<EditNameFormProps> = (
  props: EditNameFormProps
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

export default EditNameForm;
