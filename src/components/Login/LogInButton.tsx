import React from "react";
import { useAuth0 } from "../../business/implementations/Auth0Service";
import {Button} from "@material-ui/core";
interface ILoginProps {
  passHandleLogin: () => void
}



// class export default LogInButton; extends React.Component<ILoginProps> {
//   state = { count: 0 };
//   const { isAuthenticated, loginWithRedirect, logout, user, getTokenSilently } = useAuth0();
//   console.log("user", user);
//   const getToken = async ()=> {
//     {
//       const accessToken = await getTokenSilently();
//       console.log(accessToken)
//       return accessToken;
//   } 
//   public render() {
//     return (
//       <div>
//         {!isAuthenticated && (
//           <Button variant="contained" color="primary" onClick={() => {loginWithRedirect({}); props.passHandleLogin()}}>LOG IN</Button>
//         )}
//         {isAuthenticated && <Button variant="contained" color="primary" onClick={() => logout()}>LOG OUT</Button>}
//       </div>
//     );

//   }
  
// };


// import * as React from 'react';


const LogInButton: React.SFC<ILoginProps> = (props) => { 
const auth0 = useAuth0();

  const getToken =  async ()=>  {
      const accessToken = await auth0.getTokenSilently();
      alert(accessToken)
      localStorage.setItem('token', accessToken);
      return accessToken;
  }   
    return (
        <div>
        {!auth0.isAuthenticated && (
          <Button variant="contained" color="primary" onClick={() => {auth0.loginWithRedirect({}); getToken(); props.passHandleLogin()}}>LOG IN</Button>
        )}
        {auth0.isAuthenticated && <Button variant="contained" color="primary" onClick={() => auth0.logout()}>LOG OUT</Button>}
      </div>
    );
}

export default LogInButton;
