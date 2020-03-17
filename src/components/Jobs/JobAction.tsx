import { Fab, Icon, Tooltip } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconColor } from "../theme";
import React from "react";

interface JobActionProps {
  id: string;
  action?: any;
  onMouseUp?: any;
  toolTipText: string;
  icon: any;
  iconSize?: any;
  color: IconColor;
}

const JobAction: React.SFC<JobActionProps> = (props: JobActionProps) => {
  const { id, action, toolTipText, icon, color, iconSize, onMouseUp } = props;
  return (
    <Tooltip disableFocusListener title={toolTipText}>
      <Fab
        size="small"
        onClick={action}
        onMouseUp={onMouseUp}
        style={{ backgroundColor: color.background }}
        className="add-cursor"
      >
        <Icon key={id} style={{ color: color.main }}>
          {icon}
        </Icon>
      </Fab>
    </Tooltip>
  );
};

export default JobAction;
