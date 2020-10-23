import React, { Component } from "react";
import SimpleBar from "simplebar-react";
import logo from "./assets/logo.png";
import Register from "./auth/register";
import Login from "./auth/login";
import VerifyCode from "./auth/verify-code";
import { Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

export default function Auth(props) {
  const classes = useStyles();
  const [login, setLogin] = React.useState(true);
  const [register, setRegister] = React.useState(false);
  const [showVerifyCode, setVerifyCode] = React.useState(false);
  const [email, setEmail] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [password, setPassword] = React.useState(null);

  if (props.user) {
    setVerifyCode(!props.user.isVerified);
    setEmail(props.user.email);
  }

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
    <div>
      {showVerifyCode ? (
        <VerifyCode
          history={props.history}
          email={email}
          username={username}
          password={password}
        />
      ) : (
        <Container component="main" maxWidth="xs">
           <div className={classes.paper}>
             <img src={logo} width="146px" height="auto"></img>
           </div>
        </Container>
      )}
    </div>
  );
}