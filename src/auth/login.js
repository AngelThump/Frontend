import React from "react";
import client from "../feathers";
import {
  TextField,
  InputAdornment,
  IconButton,
  makeStyles,
  Button,
  Link
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 4)
  },
}));

export default function Login(props) {
  const classes = useStyles();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);

  if (props.user) return (window.location.href = "/");

  document.title = "AngelThump - Login";

  const showPassword = (evt) => {
    if (evt) evt.preventDefault();
    setPasswordVisibility(!passwordVisibility);
  };

  const handleUsernameChange = (evt) => {
    setUsername(evt.target.value);
  };

  const handlePasswordChange = (evt) => {
    setPassword(evt.target.value);
  };

  const handleLogin = (evt) => {
    if (evt) evt.preventDefault();
    return client
      .authenticate({
        strategy: "local",
        username,
        password,
      })
      .then(() => {
        if (!props.history) return window.location.reload();
        props.history.goBack();
      })
      .catch((e) => {
        setError(true);
        console.error(e);
      });
  };

  return (
    <>
      {error ? <Alert style={{marginTop: "0.5rem"}} severity="error">Incorrect Login Details!</Alert> : <></>}
      <form className={classes.form} noValidate>
        <TextField
          inputProps={{
            style: { backgroundColor: "hsla(0,0%,100%,.15)", color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Username"
          name="username"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus
          onChange={handleUsernameChange}
        />
        <TextField
          inputProps={{
            style: {color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={passwordVisibility ? "text" : "password"}
          onChange={handlePasswordChange}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          InputProps={{
            style: {backgroundColor: "hsla(0,0%,100%,.15)"},
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={showPassword}
                >
                  {passwordVisibility ? (
                    <Visibility style={{ color: "#fff" }} />
                  ) : (
                    <VisibilityOff style={{ color: "#fff" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Link href="/user/recovery" variant="body2">
          Forgot your password?
        </Link>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleLogin}
          disabled={username.length === 0 || password.length === 0}
          style={{color: "#fff"}}
        >
          Sign In
        </Button>
      </form>
    </>
  );
}
