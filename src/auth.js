import React from "react";
import logo from "./assets/logo.png";
import Register from "./auth/register";
import Login from "./auth/login";
import VerifyCode from "./auth/verify-code";
import { Typography, Button, Box, Paper } from "@mui/material";
import SimpleBar from "simplebar-react";

export default function Auth(props) {
  const { user } = props;
  const [login, setLogin] = React.useState(props.login);
  const [register, setRegister] = React.useState(props.register);
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
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", flexDirection: "column", minHeight: 0 }}>
      <SimpleBar style={{ height: "100%" }}>
        <Paper sx={{ display: "flex", flexDirection: "column", maxWidth: "400px", p: 2 }}>
          <img alt="logo" style={{ alignSelf: "center" }} src={logo} width="146px" height="auto" />
          {showVerifyCode ? (
            <>
              <Typography sx={{ alignSelf: "center", color: "#efeff1", fontWeight: 600 }} variant="h5">
                {`Verify your Email Address`}
              </Typography>
              <VerifyCode email={email} username={username} password={password} />
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

              {login ? <Login user={user} /> : register ? <Register user={user} showVerification={showVerification} /> : <></>}
            </>
          )}
        </Paper>
      </SimpleBar>
    </Box>
  );
}
