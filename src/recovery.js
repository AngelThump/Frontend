import { Typography, TextField, Button, IconButton, Box, Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import EditIcon from "@mui/icons-material/Edit";
import logo from "./assets/logo.png";

const initalState = {
  email: "",
  validEmail: false,
  doneWithEmail: false,
  username: "",
  validUsername: false,
  captcha: null,
  message: "",
  doneWithUsername: false,
};

export default function Recovery() {
  const [state, setState] = useState(initalState);
  const recaptchaRef = useRef();

  useEffect(() => {
    document.title = "AngelThump - Account Recovery";
    return;
  }, []);

  const handleRecaptcha = (value) => {
    setState({ ...state, captcha: value });
  };

  const handleEmailInput = (evt) => {
    const tmpEmail = evt.target.value;
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setState({ ...state, email: tmpEmail, validEmail: regex.test(tmpEmail) });
  };

  const handleEmailClick = (evt) => {
    if (evt) evt.preventDefault();
    setState({ ...state, doneWithEmail: true });
  };

  const handleEditButton = (evt) => {
    if (evt) evt.preventDefault();
    setState({ ...state, doneWithEmail: false });
  };

  const handleUsernameInput = (evt) => {
    const tmpUsername = evt.target.value;
    const regex = /^\w+$/;
    setState({ ...state, username: tmpUsername, validUsername: regex.test(tmpUsername) && tmpUsername.length > 0 && tmpUsername.length < 26 });
  };

  const sendPasswordReset = (evt) => {
    if (evt) evt.preventDefault();

    fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.email,
        "g-recaptcha-response": state.captcha,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          recaptchaRef.current.reset();
          return console.error(data.errorMsg);
        }
        setState({ ...state, doneWithUsername: true, message: `password reset link` });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const sendUsernameEmail = (evt) => {
    evt.preventDefault();

    fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.email,
        "g-recaptcha-response": state.captcha,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          recaptchaRef.current.reset();
          return console.error(data.errorMsg);
        }
        setState({ ...state, doneWithUsername: true, message: `username` });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleRestart = (evt) => {
    evt.preventDefault();
    setState(initalState);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", flexDirection: "column" }}>
      <Paper sx={{ display: "flex", flexDirection: "column", maxWidth: "400px", p: 2 }}>
        <img alt="logo" style={{ alignSelf: "center" }} src={logo} width="146px" height="auto" />
        {state.doneWithUsername ? (
          <Box sx={{ maxWidth: "46rem" }}>
            <Typography style={{ fontWeight: "600" }} variant="h5">
              {`Check your email`}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontWeight: "500",
              }}
              variant="subtitle2"
            >
              {`Please go to your email: ${state.email} to retrieve your ${state.message}`}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontWeight: "500",
              }}
              variant="subtitle2"
            >
              {`It could take a few minutes to appear, and be sure to check the spam folder!`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Button type="submit" variant="contained" color="primary" href="/">
                Done
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                onClick={handleRestart}
                sx={{
                  ml: 1,
                }}
              >
                Start Over
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ maxWidth: "46rem" }}>
            <Typography sx={{ fontWeight: "600" }} variant="h5">
              {`AngelThump Account Recovery`}
            </Typography>
            {!state.doneWithEmail ? (
              <>
                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: "500",
                  }}
                  variant="subtitle2"
                >
                  {`To get started, give us your AngelThump Email.`}
                </Typography>
                <form style={{ width: "100%" }} noValidate>
                  <TextField
                    key="email"
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    label="Enter your email address"
                    name="Email"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoFocus
                    onChange={handleEmailInput}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleEmailClick}
                    disabled={!state.validEmail}
                    sx={{
                      mt: 1,
                    }}
                  >
                    Continue
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: "500",
                  }}
                  variant="subtitle2"
                >
                  {`Okay, now give us your AngelThump Username`}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: "500",
                  }}
                  variant="body2"
                >
                  {`Email:`}
                </Typography>
                <Typography
                  sx={{
                    color: "#868686",
                  }}
                  variant="body1"
                >
                  {state.email}
                  <IconButton onClick={handleEditButton}>
                    <EditIcon color="primary" />
                  </IconButton>
                </Typography>
                <form style={{ width: "100%" }} noValidate>
                  <TextField
                    key="username"
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    label="Enter your username"
                    name="Username"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoFocus
                    onChange={handleUsernameInput}
                  />
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 1 }}>
                    <ReCAPTCHA
                      ref={(ref) => (recaptchaRef.current = ref)}
                      style={{ display: "inline-block" }}
                      sitekey="6Lf6TVgUAAAAAFfSioc-cykEjZnF7_ol0eXp2wKG"
                      onChange={handleRecaptcha}
                      theme="dark"
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      mt: "1rem",
                    }}
                  >
                    <Button size="small" type="submit" variant="contained" color="primary" onClick={sendPasswordReset} disabled={!state.validUsername || state.captcha === null} sx={{ m: 0.3 }}>
                      Reset my Password
                    </Button>
                    <Button size="small" type="submit" variant="contained" color="primary" onClick={sendUsernameEmail} disabled={state.captcha === null} sx={{ m: 0.3 }}>
                      What's my Username?
                    </Button>
                  </Box>
                </form>
              </>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
