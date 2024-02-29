import React, { useEffect, useState, useRef, useMemo } from "react";
import { TextField, InputAdornment, IconButton, Button, Link, Typography, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ReCAPTCHA from "react-google-recaptcha";
import RESERVED_USERNAMES from "../json/reserved_usernames.json";
import debounce from "lodash.debounce";

export default function Register(props) {
  const { user, showVerification } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const recaptcha = useRef();

  useEffect(() => {
    document.title = "AngelThump - Register";
    return;
  }, []);

  const handleUsernameChange = useMemo(
    () =>
      debounce(async (evt) => {
        const usernameInput = evt.target.value.toLowerCase();
        setUsername(usernameInput);

        if (usernameInput.length < 4 || usernameInput.length > 26) {
          setUsernameError(true);
          setUsernameMsg("Username must be between 4 and 25 characters");
          return;
        }

        const regex = /^\w+$/;
        if (!regex.test(usernameInput)) {
          setUsernameError(true);
          setUsernameMsg("Only Alphanumeric Characters! 'A-Z','0-9' and '_'");
          return;
        }

        if (RESERVED_USERNAMES.includes(usernameInput)) {
          setUsernameError(true);
          setUsernameMsg("Username is Taken!");
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
          setUsernameMsg("Server encountered an error...");
          return;
        }

        if (!available) {
          setUsernameError(true);
          setUsernameMsg("Username is taken!");
          return;
        }

        setUsernameError(false);
        setUsernameMsg("This is how people will view your channel");
        return;
      }, 300),
    [setUsername]
  );

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

  const handleEmail = useMemo(
    () =>
      debounce(async (evt) => {
        if (evt.target.value.length === 0) return;
        const emailInput = evt.target.value.toLowerCase();
        setEmail(emailInput);

        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test(emailInput)) {
          setEmailError(true);
          setEmailMsg("This is not a valid email!");
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
          setEmailMsg("Email validation broken. Contact Discord");
          return;
        }

        if (!available) {
          setEmailError(true);
          setEmailMsg("Email is taken!");
          return;
        }

        setEmailError(false);
        setEmailMsg("You will need to verify your email & wait (7) days or become a patron on our Patreon before broadcasting!");
      }, 300),
    [setEmail]
  );

  const handleRegister = (evt) => {
    evt.preventDefault();
    fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        "g-recaptcha-response": captcha,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400) {
          recaptcha.current.reset();
          return console.error(data.errorMsg);
        }
        showVerification(email, username, password, true);
      })
      .catch((e) => {
        recaptcha.current.reset();
        console.error(e);
      });
  };

  if (user) return (window.location.href = "/");

  return (
    <form style={{ width: "100%" }} noValidate>
      <Alert severity="warning" sx={{ display: "flex", alignItems: "center" }}>
        There is a 7 day waiting period before you can stream! Or become a
        <Link href="https://patreon.com/join/angelthump" rel="noopener noreferrer" target="_blank">
          {` patron `}
        </Link>
        today!
      </Alert>
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
      {typeof usernameError !== "undefined" && usernameError !== null && <Alert severity={usernameError ? "error" : !usernameError ? "success" : null}>{usernameMsg}</Alert>}
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
      <TextField variant="outlined" margin="dense" required fullWidth label="Email" name="email" autoComplete="off" autoCapitalize="off" autoCorrect="off" autoFocus onChange={handleEmail} />
      {typeof emailError !== "undefined" && emailError !== null && <Alert severity={emailError ? "error" : !emailError ? "success" : null}>{emailMsg}</Alert>}
      <Typography variant="body2" sx={{ mt: "0.5rem", textAlign: "center", color: "#868686" }}>
        {`By clicking Sign Up, you are indicating that you have read and
        acknowledge the `}
        <Link variant="body2" href="/p/tos">
          Terms of Service
        </Link>
        {` and `}
        <Link variant="body2" href="/p/privacy">
          Privacy Policy
        </Link>
      </Typography>
      <div style={{ textAlign: "center" }}>
        <ReCAPTCHA
          ref={(ref) => (recaptcha.current = ref)}
          style={{ display: "inline-block", marginTop: "0.3rem" }}
          sitekey="6Lf6TVgUAAAAAFfSioc-cykEjZnF7_ol0eXp2wKG"
          onChange={(value) => setCaptcha(value)}
          theme="dark"
        />
      </div>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleRegister}
        disabled={
          usernameError === null ||
          usernameError ||
          passwordError === null ||
          passwordError ||
          confirmPasswordError === null ||
          confirmPasswordError ||
          emailError === null ||
          emailError ||
          captcha === null
        }
        sx={{ mt: 1 }}
      >
        Sign Up
      </Button>
    </form>
  );
}
