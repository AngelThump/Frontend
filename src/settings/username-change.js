import React, { useRef } from "react";
import logo from "../assets/logo.png";
import RESERVED_USERNAMES from "../json/reserved_usernames.json";
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
  const [username, setUsername] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [usernameError, setUsernameError] = React.useState(false);
  const [isUsernameValid, setIsUsernameValid] = React.useState(false);
  const [usernameSuccess, setUsernameSuccess] = React.useState(false);
  const [changeUsernameError, setChangeUsernameError] = React.useState(false);
  let timeout = useRef(null);

  const handleUsernameInput = (evt) => {
    const username = evt.target.value.toLowerCase();
    setUsername(username);
    setUsernameError(null);
    setUsernameSuccess(null);
    setIsUsernameValid(false);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      if (username.length < 4 || username.length > 26) {
        setUsernameError(true);
        setMessage("Username must be between 4 and 25 characters");
        return;
      }

      const regex = /^\w+$/;
      if (!regex.test(username)) {
        setUsernameError(true);
        setMessage("Only Alphanumeric Characters! 'A-Z','0-9' and '_'");
        return;
      }

      if (RESERVED_USERNAMES.includes(username)) {
        setUsernameError(true);
        setMessage("Username is taken!");
        return;
      }

      let available;
      await fetch("https://sso.angelthump.com/v1/validation/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
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
        setUsernameError(true);
        setMessage("Server encountered an error...");
        return;
      }

      if (!available) {
        setUsernameError(true);
        setMessage("Username is taken!");
        return;
      }

      setUsernameError(false);
      setUsernameSuccess(true);
      setIsUsernameValid(true);
      setMessage('Username is available!');
    }, 500);
  };

  const changeUsername = async (evt) => {
    if (evt) evt.preventDefault();

    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/username", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          setChangeUsernameError(true);
          setMessage("Server encountered an error...");
          return console.error(data);
        }
        window.location.reload();
      })
      .catch((e) => {
        setChangeUsernameError(true);
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
          {`Change your username, ${props.user.display_name}?`}
        </Typography>
        {usernameError || changeUsernameError ? (
          <Alert style={{ marginTop: "0.5rem" }} severity="error">
            {message}
          </Alert>
        ) : usernameSuccess ? <Alert style={{ marginTop: "0.5rem" }} severity="success">
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
            required
            fullWidth
            autoFocus
            name="username"
            label="Change your Username"
            type="text"
            onChange={handleUsernameInput}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
          />
          <Typography className={classes.text} variant="body2">
            New Channel Link
          </Typography>
          <Typography className={classes.text} variant="body1">
            {`https://angelthump.com/${username}`}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={changeUsername}
            disabled={!isUsernameValid}
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
