import React, { useState } from "react";
import client from "./feathers";
import { Typography, TextField, Button, Link, Alert } from "@mui/material";

export default function VerifyCode(props) {
  const { username, email, password } = props;
  const [emailSent, setEmailSent] = useState(false);
  const [verifyError, setVerifyError] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const handleResendCode = (evt) => {
    evt.preventDefault();
    const authManagement = client.service("authManagement");
    authManagement
      .create({
        action: "resendVerifySignup",
        value: { email: email },
      })
      .then(() => setEmailSent(true))
      .catch((error) => {
        console.error(error);
      });
  };

  const handleVerifyClick = (evt) => {
    if (evt) evt.preventDefault();
    if (verifyCode.length !== 6) {
      setVerifyError(true);
      return;
    }
    const authManagement = client.service("authManagement");
    authManagement
      .create({
        action: "verifySignupShort",
        value: {
          user: {
            email: email,
          },
          token: verifyCode,
        },
      })
      .then(() => {
        if (!username || !password) return window.location.reload();
        login(username, password);
      })
      .catch((error) => {
        console.error(error);
        setVerifyError(true);
      });
  };

  const login = async (username, password) => {
    await client.authenticate({
      strategy: "local",
      username: username,
      password: password,
    });
    window.location.href = "/";
  };

  return (
    <>
      {verifyError && (
        <Alert sx={{ mt: 1 }} severity="error">
          Invalid Verification Code
        </Alert>
      )}
      <Typography sx={{ mt: 1, fontWeight: "600" }} variant="h6">
        {`Enter your verification code`}
      </Typography>
      <Typography sx={{ color: "#b6b6b6" }} variant="subtitle2">
        {`We sent a 6 digit code to ${email}. By confirming your email, you will be able to keep your account secure and use all of the site's funcationality.`}
      </Typography>
      <form style={{ width: "100%" }} noValidate>
        <TextField
          variant="outlined"
          margin="dense"
          required
          fullWidth
          label="Your Verification Code"
          name="VerifyCode"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus
          onChange={(evt) => setVerifyCode(evt.target.value)}
        />
        {emailSent && <Alert severity="success">Email Sent!</Alert>}
        <Button onClick={handleResendCode} disabled={emailSent} color="secondary" sx={{ padding: 0, whiteSpace: "nowrap", textTransform: "none" }}>
          Resend code
        </Button>
        <Typography sx={{ mt: 0.3 }} variant="subtitle2">
          {`Update Email? `}
          <Link href="/settings/security" variant="body2" color="secondary">
            Settings
          </Link>
        </Typography>
        <Typography sx={{ mt: 0.3, color: "#b6b6b6" }} variant="subtitle2">
          {`You may also use the link in the email we sent you to verify your email.`}
        </Typography>
        <Button sx={{ mt: 1 }} type="submit" fullWidth variant="contained" color="primary" onClick={handleVerifyClick} disabled={verifyCode.length < 6 || verifyCode.length > 6}>
          Submit
        </Button>
      </form>
    </>
  );
}
