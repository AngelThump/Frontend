import React, { useRef } from "react";
import logo from "../assets/logo.png";
import client from "../feathers";
import { Alert } from "@material-ui/lab";
import {
  makeStyles,
  TextField,
  Button,
  Container,
  Typography,
} from "@material-ui/core";

export default function SecurityConfirmPassword(props) {
  const classes = useStyles();
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [isEmailValid, setIsEmailValid] = React.useState(false);
  const [emailSuccess, setEmailSuccess] = React.useState(false);
  const [changeEmailError, setChangeEmailError] = React.useState(false);
  let timeout = useRef(null);

  const handleEmailInput = (evt) => {
    const email = evt.target.value.toLowerCase();
    setEmail(email);
    setEmailError(null);
    setEmailSuccess(null);
    setIsEmailValid(false);

    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regex.test(email)) {
        setEmailError(true);
        setMessage("This is not a valid email");
        return;
      }

      let available;
      await fetch("https://sso.angelthump.com/v1/validation/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          available = data.available;
        })
        .catch((e) => {
          console.error(e);
        });

      if (typeof available === "undefined" || available === null) {
        setEmailError(true);
        setMessage("Server encountered an error...");
        return;
      }

      if (!available) {
        setEmailError(true);
        setMessage("Email is taken!");
        return;
      }

      setEmailError(false);
      setEmailSuccess(true);
      setIsEmailValid(true);
      setMessage('Email is available!');
    }, 500);
  };

  const changeEmail = async (evt) => {
    if (evt) evt.preventDefault();
    const { accessToken } = await client.get("authentication");

    if(!props.user.isVerified) {
      await fetch("https://sso.angelthump.com/v1/user/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      }).then(data=>{
        if (data.error || data.code > 400 || data.status > 400) {
          setChangeEmailError(true);
          setMessage("Server encountered an error...");
          return console.error(data);
        }
        props.emailChanged();
      }).catch(e=>{
        setChangeEmailError(true);
        setMessage("Server encountered an error...");
        console.error(e);
      });
      return;
    }

    await fetch("https://sso.angelthump.com/v1/user/change/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: props.user.email,
          password: props.password,
          newEmail: email
        }),
      }).then(data=>{
        if (data.error || data.code > 400 || data.status > 400) {
          setChangeEmailError(true);
          setMessage("Server encountered an error...");
          return console.error(data);
        }
        props.confirmEmailChanges();
      }).catch(e=>{
        setChangeEmailError(true);
        setMessage("Server encountered an error...");
        console.error(e);
      });

  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <img
          alt="logo"
          style={{ alignSelf: "center" }}
          src={logo}
          width="146px"
          height="auto"
        />
        <Typography
          style={{ alignSelf: "center" }}
          className={classes.header}
          variant="h6"
        >
          {`Change your Email, ${props.user.display_name}?`}
        </Typography>
        {emailError || changeEmailError ? (
          <Alert style={{ marginTop: "0.5rem" }} severity="error">
            {message}
          </Alert>
        ) : emailSuccess ? <Alert style={{ marginTop: "0.5rem" }} severity="success">
        {message}
      </Alert> : (
          <></>
        )}
        <form className={classes.form} noValidate>
          <TextField
            inputProps={{
              style: { color: "#fff" },
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            InputProps={{
              style: { backgroundColor: "hsla(0,0%,100%,.15)" },
            }}
            variant="outlined"
            margin="normal"
            autoFocus
            required
            fullWidth
            name="email"
            label="Change your Email"
            type="text"
            onChange={handleEmailInput}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={changeEmail}
            disabled={!isEmailValid}
            style={{ color: "#fff" }}
          >
            Change
          </Button>
        </form>
      </div>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  header: {
    color: "#efeff1"
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 4),
  },
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  text: {
    color: "#efeff1"
  }
}));
