import {
  ClickAwayListener,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import React from "react";

export interface IFilterIconButtonProps {
  list: any[];
  onClick: (value: any) => any;
}

const FilterMenu: React.SFC<IFilterIconButtonProps> = (
  props: IFilterIconButtonProps
) => {
  const { list, onClick } = props;
  const [open, setOpen] = React.useState(false);
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
              <MenuItem key={value} onClick={() => onClick(value)}>
                {value}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    </ClickAwayListener>
  );
};

export default FilterMenu;
