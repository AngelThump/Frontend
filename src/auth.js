import React from "react";
import logo from "./assets/logo.png";
import Register from "./auth/register";
import Login from "./auth/login";
import VerifyCode from "./auth/verify-code";
import { Typography, Button, Box } from "@mui/material";

export default function Auth(props) {
  const { history, user } = props;
  const [login, setLogin] = React.useState(true);
  const [register, setRegister] = React.useState(false);
  const [showVerifyCode, setVerifyCode] = React.useState(false);
  const [email, setEmail] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [password, setPassword] = React.useState(null);

  if (user) return (window.location.href = "/");

  const showLogin = () => {
    setLogin(true);
    setRegister(false);
  };

  const showRegister = () => {
    setLogin(false);
    setRegister(true);
  };

  const showVerification = (email, username, password) => {
    setEmail(email);
    setUsername(username);
    setPassword(password);
    setVerifyCode(true);
    setLogin(false);
    setRegister(false);
  };

  return (
    <Box sx={{ m: 2, display: "flex", flexDirection: "column" }}>
      <img alt="logo" style={{ alignSelf: "center" }} src={logo} width="146px" height="auto" />
      {showVerifyCode ? (
        <>
          <Typography sx={{ alignSelf: "center", color: "#efeff1", fontWeight: 600 }} variant="h5">
            {`Verify your Email Address`}
          </Typography>
          <VerifyCode history={history} email={email} username={username} password={password} />
        </>
      ) : (
        <>
          <Typography sx={{ alignSelf: "center", color: "#efeff1", fontWeight: 600 }} variant="h5">
            {login ? `Login to AngelThump` : `Join AngelThump Today`}
          </Typography>

          <Box sx={{ display: `flex`, justifyContent: "start" }}>
            <Button disabled={login} onClick={showLogin} sx={{ color: !login ? "#fff!important" : "#03a9f4!important" }}>
              Log In
            </Button>
            <Button sx={{ ml: 1, color: !register ? "#fff!important" : "#03a9f4!important" }} disabled={!login} onClick={showRegister}>
              Register
            </Button>
          </Box>

          {login ? <Login user={user} history={history} /> : register ? <Register user={user} showVerification={showVerification} /> : <></>}
        </>
      )}
    </Box>
  );
}
