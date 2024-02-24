import React from "react";
import { TextField, InputAdornment, IconButton, Button, Link, Alert } from "@mui/material";
import client from "./feathers";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect } from "react";

export default function Login(props) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);

  useEffect(() => {
    document.title = "AngelThump - Login";
    return;
  }, []);

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

    if (username.length === 0 || !password.length === 0) return;

    fetch("https://sso.angelthump.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then(async (res) => {
        await client.authentication.setAccessToken(res.accessToken);
        window.location.reload();
      })
      .catch((e) => {
        setError(true);
        console.error(e);
      });
  };

  return (
    <>
      {error && (
        <Alert style={{ marginTop: "0.5rem" }} severity="error">
          Incorrect Login Details!
        </Alert>
      )}
      <form style={{ width: "100%" }} noValidate>
        <TextField
          variant="outlined"
          margin="dense"
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
          variant="outlined"
          margin="dense"
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
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="Toggle password visibility" onClick={showPassword}>
                  {passwordVisibility ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Link href="/user/recovery" variant="body2">
          Forgot your password?
        </Link>
        <Button type="submit" fullWidth variant="contained" color="primary" onClick={handleLogin} disabled={username.length === 0 || password.length === 0} sx={{ color: "#fff", mt: 1 }}>
          Sign In
        </Button>
      </form>
    </>
  );
}
