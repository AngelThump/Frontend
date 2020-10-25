import React from "react";
import logo from "../assets/logo.png";
import client from "../feathers";
import {
  makeStyles,
  TextField,
  Link,
  InputAdornment,
  IconButton,
  Button,
  Container,
  Typography,
  Box
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

export default function SecurityConfirmPassword(props) {
  const classes = useStyles();
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [verifyPasswordError, setVerifyPasswordError] = React.useState(false);

  const handleShowPassword = (evt) => {
    if (evt) evt.preventDefault();
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (evt) => {
    setPassword(evt.target.value);
  };

  const handleVerifyPassword = async (evt) => {
    if (evt) evt.preventDefault();
    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/verify/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        password: password,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          setVerifyPasswordError(true);
          return console.error(data);
        }
        props.verified(password);
      })
      .catch((e) => {
        setVerifyPasswordError(true);
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
          {"Confirm your Password"}
        </Typography>
        <Box display="flex" alignItems="center" marginTop="0.5rem">
          <div
            style={{ marginRight: "0.5rem", height: "2.6rem", width: "2.6rem" }}
          >
            <img
              alt=""
              className={classes.avatar}
              src={props.user.profile_logo_url}
            />
          </div>
          <Typography variant="body2" className={classes.text}>
            {props.user.display_name}
          </Typography>
        </Box>
        <Typography style={{marginTop: "0.3rem"}} variant="body2" className={classes.text}>
          {`For security, please enter your password to continue.`}
        </Typography>
        {verifyPasswordError ? (
          <Alert style={{ marginTop: "0.5rem" }} severity="error">
            Incorrect Password!
          </Alert>
        ) : (
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
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            onChange={handlePasswordChange}
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
          <Link href="/user/recovery" variant="body2">
            Forgot your password?
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleVerifyPassword}
            disabled={password.length === 0}
            style={{ color: "#fff" }}
          >
            Verify
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
  avatar: {
    borderRadius: "25px",
    borderCollapse: "separate",
    width: "100%"
  },
  text: {
    color: "#efeff1"
  }
}));