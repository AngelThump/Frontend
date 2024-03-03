import logo from "../assets/logo.png";
import client from "../auth/feathers";
import { TextField, Button, Typography, InputAdornment, IconButton, Box, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export default function PasswordChange(props) {
  const { user, oldPassword, closeModal } = props;
  const [password, setPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const handlePasswordChange = (evt) => {
    const passwordInput = evt.target.value;
    setPassword(passwordInput);

    if (passwordInput.length < 8) {
      setPasswordError(true);
      setPasswordMsg("Your password must have a minimum of eight characters");
      return;
    }

    if (!/(?=.*?[a-z])/.test(passwordInput)) {
      setPasswordError(true);
      setPasswordMsg("Your password must contain at least one lower case letter");
      return;
    }

    if (!/(?=.*?[0-9])/.test(passwordInput)) {
      setPasswordError(true);
      setPasswordMsg("Your password must contain at least one number");
      return;
    }

    if (passwordInput === oldPassword) {
      setPasswordError(true);
      setPasswordMsg("Your password is the same as your old password");
      return;
    }

    setPasswordError(false);
    setPasswordMsg("Your password is valid!");

    if (confirmPassword.length > 0) {
      setConfirmPasswordError(confirmPassword !== passwordInput);
    }
  };

  const handleConfirmPassword = (evt) => {
    setConfirmPassword(evt.target.value);
    setConfirmPasswordError(evt.target.value !== password);
  };

  const changePassword = async (evt) => {
    if (evt) evt.preventDefault();

    await client
      .service("authManagement")
      .create({
        action: "passwordChange",
        value: {
          user: {
            email: user.email,
          },
          oldPassword: oldPassword,
          password: password,
        },
      })
      .then(() => {
        closeModal();
      })
      .catch((e) => {
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
        {`Change your password, ${user.display_name}?`}
      </Typography>
      <Typography sx={{ alignSelf: "center", fontWeight: 550, mt: 1 }} color="text.secondary" variant="caption">
        {`Your stream key will be reset when changing your password!`}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
        <TextField
          variant="outlined"
          margin="dense"
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
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {typeof passwordError !== "undefined" && passwordError !== null && <Alert severity={passwordError ? "error" : !passwordError ? "success" : null}>{passwordMsg}</Alert>}
        <TextField
          variant="outlined"
          margin="dense"
          required
          fullWidth
          name="confirm password"
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          onChange={handleConfirmPassword}
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
        {typeof confirmPasswordError !== "undefined" && confirmPasswordError !== null && (
          <Alert severity={confirmPasswordError ? "error" : !confirmPasswordError ? "success" : null}>{confirmPasswordError ? "Your passwords do not match" : "Your passwords match!"}</Alert>
        )}
        <Button sx={{ mt: 1 }} fullWidth variant="contained" color="primary" onClick={changePassword} disabled={passwordError || confirmPasswordError}>
          Change
        </Button>
      </Box>
    </Box>
  );
}
