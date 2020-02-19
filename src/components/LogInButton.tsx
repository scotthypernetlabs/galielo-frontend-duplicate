import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import {Button} from "@material-ui/core";
interface LoginProps {
  passHandleLogin: () => void
}

const LogInButton: React.SFC<LoginProps> = (props) => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  console.log("user",user);
  return (
    <div>
      {!isAuthenticated && (
        <Button variant="contained" color="primary" onClick={() => {loginWithRedirect({}); props.passHandleLogin()}}>LOG IN</Button>
      )}
      {isAuthenticated && <Button variant="contained" color="primary" onClick={() => logout()}>LOG OUT</Button>}
    </div>
  );
};
export default LogInButton;