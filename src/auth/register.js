import React, { Component } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Link,
  Typography,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import ReCAPTCHA from "react-google-recaptcha";
import RESERVED_USERNAMES from "../json/reserved_usernames.json";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regUsername: "",
      regPassword: "",
      regEmail: "",
      regConfirmPassword: "",
      showPassword: false,
      regUsernameMessage: "",
      errorRegEmailMsg: "",
      successRegEmailMsg: "",
      captcha: null,
      showRegEmailError: null,
      showRegPasswordError: null,
      showRegUsernameError: null,
      showRegConfirmPasswordError: null,
    };
    this.usernameInput = {};
    this.recaptcha = {};
  }

  componentDidMount() {
    document.title = "AngelThump - Register";
  }

  showPassword = (evt) => {
    evt.preventDefault();
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleRegUsernameChange = (evt) => {
    const username = evt.target.value.toLowerCase();
    this.setState({
      regUsername: username,
      showRegUsernameError: null,
    });

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      if (username.length < 4 || username.length > 26)
        return this.setState({
          showRegUsernameError: true,
          regUsernameMessage: "Username must be between 4 and 25 characters",
        });

      const regex = /^\w+$/;
      if (!regex.test(this.state.regUsername)) {
        return this.setState({
          showRegUsernameError: true,
          regUsernameMessage:
            "Only Alphanumeric Characters! 'A-Z','0-9' and '_'",
        });
      }

      if (RESERVED_USERNAMES.includes(this.state.regUsername)) {
        return this.setState({
          showRegUsernameError: true,
          regUsernameMessage: "Username is taken!",
        });
      }

      let available;
      await fetch("https://sso.angelthump.com/v1/validation/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.regUsername,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          available = data.available;
        })
        .catch((e) => {
          console.error(e);
        });

      if (typeof available === "undefined" || available === null) {
        return this.setState({
          showRegUsernameError: true,
          regUsernameMessage: "Server encountered an error...",
        });
      }

      if (!available) {
        return this.setState({
          showRegUsernameError: true,
          regUsernameMessage: "Username is taken!",
        });
      }

      this.setState({
        showRegUsernameError: false,
        regUsernameMessage: "This is how people will view your channel",
      });
    }, 500);
  };

  handleRegPassword = (evt) => {
    const password = evt.target.value;
    this.setState({
      regPassword: password,
    });

    if(password.length < 8) {
      return this.setState({
        showRegPasswordError: true,
        regPasswordMessage:
          "Your password must have a minimum of eight characters",
      });
    }

    if (!/(?=.*?[a-z])/.test(password)) {
      return this.setState({
        showRegPasswordError: true,
        regPasswordMessage:
          "Your password must contain at least one lower case letter",
      });
    }

    if (!/(?=.*?[0-9])/.test(password)) {
      return this.setState({
        showRegPasswordError: true,
        regPasswordMessage:
          "Your password must contain at least one number",
      });
    }

    this.setState({
      regPasswordMessage: "Your password is valid!",
      showRegPasswordError: false,
    });

    if (this.state.regConfirmPassword.length > 0) {
      this.setState({
        showRegConfirmPasswordError:
          this.state.regConfirmPassword === this.state.regPassword,
      });
    }
  };

  handleRegConfirmPassword = (evt) => {
    this.setState({
      regConfirmPassword: evt.target.value,
    });

    if (evt.target.value === 0) return;
    if (evt.target.value !== this.state.regPassword)
      return this.setState({
        showRegConfirmPasswordError: true,
      });

    this.setState({
      showRegConfirmPasswordError: false,
    });
  };

  handleEmail = (evt) => {
    const email = evt.target.value.toLowerCase();
    this.setState({
      regEmail: evt.target.value.toLowerCase(),
    });

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!regex.test(email))
        return this.setState({
          showRegEmailError: true,
          regEmailMessage: "This is not a valid email",
        });

      let available;
      await fetch("https://sso.angelthump.com/v1/validation/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.regEmail,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          available = data.available;
        })
        .catch((e) => {
          console.error(e);
        });

      if (typeof available === "undefined" || available === null)
        return this.setState({
          showRegEmailError: true,
          regEmailMessage: "Email validation broken. Contact Discord",
        });

      if (!available)
        return this.setState({
          showRegEmailError: true,
          regEmailMessage: "Email is taken!",
        });

      this.setState({
        showRegEmailError: false,
        regEmailMessage:
          "You will need to verify your email to broadcast a stream!",
      });
    }, 500);
  };

  handleRegister = (evt) => {
    evt.preventDefault();
    const { regUsername, regPassword, regEmail, captcha } = this.state;

    fetch("https://sso.angelthump.com/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: regUsername,
        password: regPassword,
        email: regEmail,
        "g-recaptcha-response": captcha,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400) {
          this.recaptcha.reset();
          return console.error(data.errorMsg);
        }
        this.props.showVerification(regEmail, regUsername, regPassword, true);
      })
      .catch((e) => {
        this.recaptcha.reset();
        console.error(e);
      });
  };

  handleRecaptcha = (value) => {
    this.setState({ captcha: value });
  };

  render() {
    if (this.props.user) return (window.location.href = "/");
    return (
      <form style={{ marginTop: "0.5rem", width: "100%" }} noValidate>
        <TextField
          inputProps={{
            style: { backgroundColor: "hsla(0,0%,100%,.15)", color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Username"
          name="username"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus
          onChange={this.handleRegUsernameChange}
        />
        {typeof this.state.showRegUsernameError !== "undefined" &&
        this.state.showRegUsernameError !== null ? (
          <Alert
            severity={
              this.state.showRegUsernameError
                ? "error"
                : !this.state.showRegUsernameError
                ? "success"
                : null
            }
          >
            {this.state.regUsernameMessage}
          </Alert>
        ) : (
          <></>
        )}
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
          type={this.state.showPassword ? "text" : "password"}
          onChange={this.handleRegPassword}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          InputProps={{
            style: { backgroundColor: "hsla(0,0%,100%,.15)" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.showPassword}
                >
                  {this.state.showPassword ? (
                    <Visibility style={{ color: "#fff" }} />
                  ) : (
                    <VisibilityOff style={{ color: "#fff" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {typeof this.state.showRegPasswordError !== "undefined" &&
        this.state.showRegPasswordError !== null ? (
          <Alert
            severity={
              this.state.showRegPasswordError
                ? "error"
                : !this.state.showRegPasswordError
                ? "success"
                : null
            }
          >
            {this.state.regPasswordMessage}
          </Alert>
        ) : (
          <></>
        )}
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
          name="confirm password"
          label="Confirm Password"
          type={this.state.showPassword ? "text" : "password"}
          onChange={this.handleRegConfirmPassword}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          InputProps={{
            style: { backgroundColor: "hsla(0,0%,100%,.15)" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.showPassword}
                >
                  {this.state.showPassword ? (
                    <Visibility style={{ color: "#fff" }} />
                  ) : (
                    <VisibilityOff style={{ color: "#fff" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {typeof this.state.showRegConfirmPasswordError !== "undefined" &&
        this.state.showRegConfirmPasswordError !== null ? (
          <Alert
            severity={
              this.state.showRegConfirmPasswordError
                ? "error"
                : !this.state.showRegConfirmPasswordError
                ? "success"
                : null
            }
          >
            {this.state.showRegConfirmPasswordError
              ? "Your passwords do not match"
              : "Your passwords match!"}
          </Alert>
        ) : (
          <></>
        )}
        <TextField
          inputProps={{
            style: { backgroundColor: "hsla(0,0%,100%,.15)", color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
          name="email"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus
          onChange={this.handleEmail}
        />
        {typeof this.state.showRegEmailError !== "undefined" &&
        this.state.showRegEmailError !== null ? (
          <Alert
            severity={
              this.state.showRegEmailError
                ? "error"
                : !this.state.showRegEmailError
                ? "success"
                : null
            }
          >
            {this.state.regEmailMessage}
          </Alert>
        ) : (
          <></>
        )}
        <Typography
          variant="body2"
          style={{ marginTop: "1rem", textAlign: "center", color: "#868686" }}
        >
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
        <div style={{textAlign: "center"}}>
          <ReCAPTCHA
            ref={(ref) => (this.recaptcha = ref)}
            style={{ display: "inline-block", marginTop: "0.3rem" }}
            sitekey="6Lf6TVgUAAAAAFfSioc-cykEjZnF7_ol0eXp2wKG"
            onChange={this.handleRecaptcha}
            theme="dark"
          />
        </div>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={this.handleRegister}
          disabled={
            (this.state.showRegUsernameError === null || this.state.showRegUsernameError) ||
            (this.state.showRegPasswordError === null || this.state.showRegPasswordError) ||
            (this.state.showRegConfirmPasswordError === null || this.state.showRegConfirmPasswordError) ||
            (this.state.showRegEmailError === null || this.state.showRegEmailError) ||
            this.state.captcha === null
          }
          style={{ color: "#fff", marginTop: "1rem", marginBottom: "2rem" }}
        >
          Sign Up
        </Button>
      </form>
    );
  }
}

export default Register;
