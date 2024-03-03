import { useState, useMemo } from "react";
import logo from "../assets/logo.png";
import client from "../auth/feathers";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import debounce from "lodash.debounce";

export default function EmailChange(props) {
  const { user, password, emailChanged, confirmEmailChanges } = props;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [changeEmailError, setChangeEmailError] = useState(false);

  const handleEmailInput = useMemo(
    () =>
      debounce(async (evt) => {
        if (evt.target.value.length === 0) return;
        const emailInput = evt.target.value.toLowerCase();
        setEmail(emailInput);
        setEmailError(null);
        setEmailSuccess(null);
        setIsEmailValid(false);

        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test(emailInput)) {
          setEmailError(true);
          setMessage("This is not a valid email!");
          return;
        }

        const available = await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/validation/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput,
          }),
        })
          .then((response) => response.json())
          .then((data) => data.available)
          .catch((e) => {
            console.error(e);
            return null;
          });

        if (typeof available === "undefined" || available === null) {
          setEmailError(true);
          setMessage("Email validation broken. Contact Discord");
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
        setMessage("Email is available!");
      }, 300),
    [setEmail]
  );

  const changeEmail = async (evt) => {
    if (evt) evt.preventDefault();
    const { accessToken } = await client.get("authentication");

    if (!user.isVerified) {
      await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((data) => {
          if (data.error || data.code > 400 || data.status > 400) {
            setChangeEmailError(true);
            setMessage("Server encountered an error...");
            return;
          }
          emailChanged();
        })
        .catch((e) => {
          setChangeEmailError(true);
          setMessage("Server encountered an error...");
          console.error(e);
        });
      return;
    }

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/change/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email: user.email,
        password: password,
        newEmail: email,
      }),
    })
      .then((data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          setChangeEmailError(true);
          setMessage("Server encountered an error...");
          return;
        }
        confirmEmailChanges();
      })
      .catch((e) => {
        setChangeEmailError(true);
        setMessage("Server encountered an error...");
        console.error(e);
      });
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column" }}>
      <img alt="logo" style={{ alignSelf: "center" }} src={logo} width="146px" height="auto" />
      <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
        <Box sx={{ position: "relative", maxHeight: "100%", width: "2.5rem", height: "2.5rem", mr: 1 }}>
          <img style={{ borderRadius: "9000px", width: "100%" }} alt="" src={user.profile_logo_url} />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 550 }}>
          {user.display_name}
        </Typography>
      </Box>
      <Typography sx={{ alignSelf: "center", fontWeight: 550, mt: 1 }} variant="h6">
        {`Change your email, ${user.display_name}?`}
      </Typography>
      {emailError || changeEmailError ? (
        <Alert sx={{ mt: 1 }} severity="error">
          {message}
        </Alert>
      ) : emailSuccess ? (
        <Alert sx={{ mt: 1 }} severity="success">
          {message}
        </Alert>
      ) : (
        <></>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
        <TextField variant="outlined" margin="dense" required fullWidth autoFocus label="New Email" type="text" onChange={handleEmailInput} autoComplete="off" autoCapitalize="off" autoCorrect="off" />
        <Button sx={{ mt: 1 }} fullWidth variant="contained" color="primary" onClick={changeEmail} disabled={!isEmailValid}>
          Change
        </Button>
      </Box>
    </Box>
  );
}
