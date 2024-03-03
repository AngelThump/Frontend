import React from "react";
import logo from "../assets/logo.png";
import client from "../auth/feathers";
import { TextField, Link, InputAdornment, IconButton, Button, Typography, Box, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function SecurityConfirmPassword(props) {
  const { setVerified, user } = props;
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [verifyPasswordError, setVerifyPasswordError] = React.useState(false);

  const handleVerifyPassword = async (evt) => {
    if (evt) evt.preventDefault();
    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/verify/password`, {
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
        setVerified();
        if (props.setPassword) {
          props.setPassword(password);
        }
      })
      .catch((e) => {
        setVerifyPasswordError(true);
        console.error(e);
      });
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column" }}>
      <img alt="logo" style={{ alignSelf: "center" }} src={logo} width="146px" height="auto" />
      <Typography sx={{ alignSelf: "center" }} variant="h6">
        {"Confirm your Password"}
      </Typography>
      <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
        <Box sx={{ position: "relative", maxHeight: "100%", width: "2.5rem", height: "2.5rem", mr: 1 }}>
          <img style={{ borderRadius: "9000px", width: "100%" }} alt="" src={user.profile_logo_url} />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 550 }}>
          {user.display_name}
        </Typography>
      </Box>
      <Typography sx={{ mt: 1 }} variant="body2">
        {`For security, please enter your password to continue.`}
      </Typography>
      {verifyPasswordError && (
        <Alert sx={{ mt: 1 }} severity="error">
          Incorrect Password!
        </Alert>
      )}
      <form noValidate style={{ display: "flex", flexDirection: "column", mt: 1 }}>
        <TextField
          variant="outlined"
          margin="dense"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          onChange={(evt) => setPassword(evt.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Link sx={{ mt: 1 }} href="/user/recovery" variant="body2">
          Forgot your password?
        </Link>
        <Button type="submit" sx={{ mt: 1 }} fullWidth variant="contained" color="primary" onClick={handleVerifyPassword} disabled={password.length === 0}>
          Verify
        </Button>
      </form>
    </Box>
  );
}
