import React from "react";
import logo from "./assets/logo.png";
import Register from "./auth/register";
import Login from "./auth/login";
import VerifyCode from "./auth/verify-code";
import { Container, makeStyles, Typography, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  navDisplayFlex: {
    display: `flex`,
    justifyContent: "start",
  },
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  button: {
    display: 'inline-block',
    padding: 0,
    minHeight: 0,
    minWidth: 0,
    marginTop: "1rem",
    color: `#fff`,
    "&:hover": {
      opacity: "50%",
    },
    textTransform: "none"
  },
  buttonActive: {
    color: `#84dcff!important`,
    "&:hover": {
      opacity: "100%!important",
    },
  },
  text: {
    color: "#efeff1",
    fontWeight: "600",
  },
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
            <img
              style={{ alignSelf: "center" }}
              src={logo}
              width="146px"
              height="auto"
            ></img>

            <Typography
              style={{ alignSelf: "center" }}
              className={classes.text}
              component="h1"
              variant="h5"
            >
              {login ? `Login to AngelThump` : `Join AngelThump Today`}
            </Typography>

            <div className={classes.navDisplayFlex}>
              <Button
                className={
                  login
                    ? `${classes.button} ${classes.buttonActive}`
                    : classes.button
                }
                disabled={login}
                onClick={showLogin}
              >
                Log In
              </Button>
              <Button
                className={
                  !login
                    ? `${classes.button} ${classes.buttonActive}`
                    : classes.button
                }
                style={{marginLeft: "1rem"}}
                disabled={!login}
                onClick={showRegister}
              >
                Register
              </Button>
            </div>

            {login ? (
              <Login user={props.user} history={props.history} />
            ) : register ? (
              <Register user={props.user} showVerification={showVerification} />
            ) : (
              <></>
            )}
          </div>
        </Container>
      )}
    </div>
  );
}
