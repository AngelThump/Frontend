import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@material-ui/core";
import React, { Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Edit } from "@material-ui/icons";

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

class Recovery extends Component {
  constructor(props) {
    super(props);

    this.state = initalState;
  }

  componentDidMount() {
    document.title = "AngelThump - Account Recovery";
  }

  handleRecaptcha = (value) => {
    this.setState({ captcha: value });
  };

  handleEmailInput = (evt) => {
    this.setState({ email: evt.target.value }, () => {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regex.test(this.state.email)) {
        this.setState({ validEmail: true });
      }
    });
  };

  handleEmailClick = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    this.setState({ doneWithEmail: true }, () => {
      this.usernameInput.focus();
    });
  };

  handleEditButton = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    this.setState({ doneWithEmail: false }, () => {
      this.emailInput.focus();
    });
  };

  handleUsernameInput = (evt) => {
    this.setState({ username: evt.target.value }, () => {
      const regex = /^\w+$/;
      this.setState({
        validUsername:
          regex.test(this.state.username) &&
          this.state.username.length > 0 &&
          this.state.username.length < 26,
      });
    });
  };

  sendPasswordReset = (evt) => {
    if (evt) {
      evt.preventDefault();
    }

    fetch("https://sso.angelthump.com/v1/user/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        "g-recaptcha-response": this.state.captcha,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          this.recaptcha.reset();
          return console.error(data.errorMsg);
        }
        return this.setState({
          doneWithUsername: true,
          message: `password reset link`,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  sendUsernameEmail = (evt) => {
    evt.preventDefault();

    fetch("https://sso.angelthump.com/v1/user/username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        "g-recaptcha-response": this.state.captcha,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          this.recaptcha.reset();
          return console.error(data.errorMsg);
        }
        return this.setState({ doneWithUsername: true, message: `username` });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  handleRestart = (evt) => {
    evt.preventDefault();
    this.setState(initalState);
  };

  render() {
    return (
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "5rem",
            paddingTop: "5rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          {this.state.doneWithUsername ? (
            <div style={{ maxWidth: "46rem" }}>
              <Typography
                style={{ color: "#fff", fontWeight: "600" }}
                variant="h5"
              >
                {`Check your email`}
              </Typography>
              <Typography
                style={{
                  marginTop: "1rem",
                  color: "#fff",
                  fontWeight: "500",
                }}
                variant="subtitle2"
              >
                {`Please go to your email: ${this.state.email} to retrieve your ${this.state.message}`}
              </Typography>
              <Typography
                style={{
                  marginTop: "1rem",
                  color: "#fff",
                  fontWeight: "500",
                }}
                variant="subtitle2"
              >
                {`It could take a few minutes to appear, and be sure to check the spam folder!`}
              </Typography>
              <div
                style={{
                  display: "flex",
                  marginTop: "1rem",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  href="/"
                  style={{
                    color: "#fff",
                  }}
                >
                  Done
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  onClick={this.handleRestart}
                  style={{
                    color: "#fff",
                    marginLeft: "1rem",
                  }}
                >
                  Start Over
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: "46rem" }}>
              <Typography
                style={{ color: "#fff", fontWeight: "600" }}
                variant="h5"
              >
                {`AngelThump Account Recovery`}
              </Typography>
              {!this.state.doneWithEmail ? (
                <>
                  <Typography
                    style={{
                      marginTop: "1rem",
                      color: "#fff",
                      fontWeight: "500",
                    }}
                    variant="subtitle2"
                  >
                    {`To get started, give us your AngelThump Email.`}
                  </Typography>
                  <form style={{ width: "100%" }} noValidate>
                    <TextField
                      key="email"
                      ref={(ref) => (this.emailInput = ref)}
                      inputProps={{
                        style: {
                          backgroundColor: "hsla(0,0%,100%,.15)",
                          color: "#fff",
                        },
                      }}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      label="Enter your email address"
                      name="Email"
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      autoFocus
                      onChange={this.handleEmailInput}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={this.handleEmailClick}
                      disabled={!this.state.validEmail}
                      style={{
                        color: "#fff",
                        marginTop: "1rem",
                        marginBottom: "2rem",
                      }}
                    >
                      Continue
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Typography
                    style={{
                      marginTop: "1rem",
                      color: "#fff",
                      fontWeight: "500",
                    }}
                    variant="subtitle2"
                  >
                    {`Okay, now give us your AngelThump Username`}
                  </Typography>
                  <Typography
                    style={{
                      marginTop: "1rem",
                      color: "#fff",
                    }}
                    variant="body2"
                  >
                    {`Email:`}
                  </Typography>
                  <Typography
                    style={{
                      color: "#868686",
                    }}
                    variant="body1"
                  >
                    {this.state.email}
                    <IconButton
                      onClick={this.handleEditButton}
                      style={{ color: "#efeff1" }}
                    >
                      <Edit />
                    </IconButton>
                  </Typography>
                  <form style={{ width: "100%" }} noValidate>
                    <TextField
                      key="username"
                      ref={(ref) => (this.usernameInput = ref)}
                      inputProps={{
                        style: {
                          backgroundColor: "hsla(0,0%,100%,.15)",
                          color: "#fff",
                        },
                      }}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      label="Enter your username"
                      name="Username"
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      autoFocus
                      onChange={this.handleUsernameInput}
                    />
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                      <ReCAPTCHA
                        ref={(ref) => (this.recaptcha = ref)}
                        style={{ display: "inline-block" }}
                        sitekey="6Lf6TVgUAAAAAFfSioc-cykEjZnF7_ol0eXp2wKG"
                        onChange={this.handleRecaptcha}
                        theme="dark"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "1rem",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={this.sendPasswordReset}
                        disabled={
                          !this.state.validUsername ||
                          this.state.captcha === null
                        }
                        style={{
                          color: "#fff",
                        }}
                      >
                        Reset my Password
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={this.sendUsernameEmail}
                        disabled={this.state.captcha === null}
                        style={{
                          color: "#fff",
                          marginLeft: "1rem",
                        }}
                      >
                        What's my Username?
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default Recovery;
