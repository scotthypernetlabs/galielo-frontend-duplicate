import {
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import React from "react";

export interface IFilterIconButtonProps {
  list: any[];
  onClick: (value: string[]) => any;
}

const FilterMenu: React.SFC<IFilterIconButtonProps> = (
  props: IFilterIconButtonProps
) => {
  const { list, onClick } = props;
  const [open, setOpen] = React.useState(false);
  const initialCheckedState: { [key: string]: boolean } = {};
  list.forEach(value => {
    initialCheckedState[value] = false;
  });
  const [checked, setChecked] = React.useState(initialCheckedState);
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpen(false);
      }}
    >
      <div>
        <IconButton
          size="small"
          onClick={event => {
            setOpen(true);
            setAnchorEl(event.currentTarget);
          }}
        >
          <FilterListIcon />
        </IconButton>
        <Menu open={open} anchorEl={anchorEl}>
          {list.map((value: any) => {
            return (
              <MenuItem key={value}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked[value]}
                      onChange={() => {
                        checked[value] = !checked[value];
                        setChecked(checked);
                        onClick(
                          Object.keys(checked).filter(
                            (key: string) => checked[key] == true
                          )
                        );
                      }}
                      name={value}
                    />
                  }
                  label={value}
                />
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    </ClickAwayListener>
  );
};

export default FilterMenu;
