import { Box, Link } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React from "react";

interface GalileoAlertProps {
  message: string;
  onClickAccept: any;
  onClickDecline: any;
}

const GalileoAlert: React.SFC<GalileoAlertProps> = (
  props: GalileoAlertProps
) => {
  const { message, onClickAccept, onClickDecline } = props;
  return (
    <div
      style={{
        marginLeft: 250,
        width: "calc(100% - 250px)",
        position: "absolute"
      }}
    >
      <Alert severity="info" icon={false}>
        <Box display="flex" flexDirection="row" justifyContent="flex-start">
          <Box flexGrow={1}>{message}</Box>
          <Box>
            <Link
              style={{ margin: 10, color: "white" }}
              onClick={onClickAccept}
            >
              Accept
            </Link>
          </Box>
          <Box>
            <Link
              style={{ margin: 10, color: "white" }}
              onClick={onClickDecline}
            >
              Decline
            </Link>
          </Box>
        </Box>
      </Alert>
    </div>
  );
};

export default GalileoAlert;
