import { useState, useMemo } from "react";
import logo from "../assets/logo.png";
import RESERVED_USERNAMES from "../json/reserved_usernames.json";
import client from "../auth/feathers";
import { TextField, Button, Typography, Alert, Box } from "@mui/material";
import debounce from "lodash.debounce";

export default function SecurityConfirmPassword(props) {
  const { user } = props;
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [changeUsernameError, setChangeUsernameError] = useState(false);

  const handleUsernameChange = useMemo(
    () =>
      debounce(async (evt) => {
        const usernameInput = evt.target.value.toLowerCase();
        setUsername(usernameInput);
        setUsernameError(null);
        setUsernameSuccess(null);
        setIsUsernameValid(false);

        if (usernameInput.length < 4 || usernameInput.length > 26) {
          setUsernameError(true);
          setMessage("Username must be between 4 and 25 characters");
          return;
        }

        const regex = /^\w+$/;
        if (!regex.test(usernameInput)) {
          setUsernameError(true);
          setMessage("Only Alphanumeric Characters! 'A-Z','0-9' and '_'");
          return;
        }

        if (RESERVED_USERNAMES.includes(usernameInput)) {
          setUsernameError(true);
          setMessage("Username is Taken!");
          return;
        }

        const available = await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/validation/username`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: usernameInput,
          }),
        })
          .then((response) => response.json())
          .then((data) => data.available)
          .catch((e) => {
            console.error(e);
            return null;
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
        setMessage("Username is available!");
        return;
      }, 300),
    [setUsername]
  );

  const changeUsername = async (evt) => {
    if (evt) evt.preventDefault();

    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/username`, {
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
        {`Change your username, ${user.display_name}?`}
      </Typography>
      {usernameError || changeUsernameError ? (
        <Alert sx={{ mt: 1 }} severity="error">
          {message}
        </Alert>
      ) : usernameSuccess ? (
        <Alert sx={{ mt: 1 }} severity="success">
          {message}
        </Alert>
      ) : (
        <></>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
        <TextField
          variant="outlined"
          margin="dense"
          required
          fullWidth
          autoFocus
          label="New Username"
          type="text"
          onChange={handleUsernameChange}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
        />
        <Box sx={{ display: "flex", mt: 1 }}>
          <Typography sx={{ mr: 0.3 }} variant="body2">
            New Channel Link:
          </Typography>
          <Typography variant="body2">{`https://angelthump.com/${username}`}</Typography>
        </Box>
        <Button sx={{ mt: 1 }} fullWidth variant="contained" color="primary" onClick={changeUsername} disabled={!isUsernameValid}>
          Change
        </Button>
      </Box>
    </Box>
  );
}
