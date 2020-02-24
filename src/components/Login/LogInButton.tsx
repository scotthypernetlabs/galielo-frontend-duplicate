import React from "react";
import { useAuth0 } from "../../react-auth0-spa";
import {Button} from "@material-ui/core";
interface ILoginProps {
  passHandleLogin: () => void
}

const LogInButton: React.SFC<ILoginProps> = (props) => {
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