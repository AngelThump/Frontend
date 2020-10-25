import React from "react";
import logo from "../assets/logo.png";
import client from "../feathers";
import { Alert } from "@material-ui/lab";
import {
  makeStyles,
  TextField,
  Button,
  Container,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

export default function PasswordChange(props) {
  const classes = useStyles();
  const [password, setPassword] = React.useState("");
  const [passwordMessage, setPasswordMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isPasswordValid, setIsPasswordValid] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmPasswordSuccess, setConfirmPasswordSuccess] = React.useState(
    false
  );

  const handleShowPassword = (evt) => {
    if (evt) evt.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = (evt) => {
    if (evt) evt.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordInput = (evt) => {
    setPassword(evt.target.value);
    setPasswordError(null);
    setPasswordSuccess(null);
    setIsPasswordValid(false);

    if (confirmPassword.length > 0) {
      setConfirmPasswordError(confirmPassword !== evt.target.value);
      setConfirmPasswordSuccess(confirmPassword === evt.target.value);
    }

    if (evt.target.value.length < 8) {
      setPasswordError(true);
      return setPasswordMessage(
        "Your password must have a minimum of eight characters"
      );
    }

    if (!/(?=.*?[a-z])/.test(evt.target.value)) {
      setPasswordError(true);
      return setPasswordMessage(
        "Your password must contain at least one lower case letter"
      );
    }

    if (!/(?=.*?[0-9])/.test(evt.target.value)) {
      setPasswordError(true);
      return setPasswordMessage(
        "Your password must contain at least one number"
      );
    }

    setPasswordError(false);
    setPasswordSuccess(true);
    setIsPasswordValid(true);
    setPasswordMessage("Your password is valid!");
  };

  const handleConfirmPasswordInput = (evt) => {
    setConfirmPassword(evt.target.value);
    setConfirmPasswordError(evt.target.value !== password);
    setConfirmPasswordSuccess(evt.target.value === password);
  };

  const changePassword = async (evt) => {
    if (evt) evt.preventDefault();

    await client.service('authManagement')
    .create({
      action: 'passwordChange',
      value: {
        user: {
          email: props.user.email
        },
        oldPassword: props.oldPassword,
        password: password
      }
    })
    .then(() => {
      props.closeModal();
    })
    .catch(e => {
      console.error(e);
    })
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
          {`Change your Password, ${props.user.display_name}?`}
        </Typography>
        <Typography
          style={{ alignSelf: "center", color: "#868686" }}
          variant="caption"
        >
          {`Your stream key will be reset when changing your password!`}
        </Typography>
        <form className={classes.form} noValidate>
          {passwordError ? (
            <Alert severity="error">{passwordMessage}</Alert>
          ) : passwordSuccess ? (
            <Alert severity="success">{passwordMessage}</Alert>
          ) : null}
          <TextField
            inputProps={{
              style: { color: "#fff" },
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
            type={showPassword ? "text" : "password"}
            onChange={handlePasswordInput}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            InputProps={{
              style: { backgroundColor: "hsla(0,0%,100%,.15)" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <Visibility style={{ color: "#fff" }} />
                    ) : (
                      <VisibilityOff style={{ color: "#fff" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {confirmPasswordError ? (
            <Alert severity="error">Your passwords do not match!</Alert>
          ) : confirmPasswordSuccess ? (
            <Alert severity="success">Your passwords match!</Alert>
          ) : null}
          <TextField
            inputProps={{
              style: { color: "#fff" },
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
            type={showConfirmPassword ? "text" : "password"}
            onChange={handleConfirmPasswordInput}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            InputProps={{
              style: { backgroundColor: "hsla(0,0%,100%,.15)" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={handleShowConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <Visibility style={{ color: "#fff" }} />
                    ) : (
                      <VisibilityOff style={{ color: "#fff" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={changePassword}
            disabled={!isPasswordValid}
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
    color: "#efeff1",
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
    color: "#efeff1",
  },
}));
