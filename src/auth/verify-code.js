import React, { Component } from "react";
import client from "./feathers";
import { Typography, TextField, Button, Link, Alert } from "@mui/material";

class VerifyCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showVerifySubmit: false,
      showEmailSent: false,
      showVerifyError: false,
      verifyCode: "",
    };
  }

  componentDidMount() {}

  handleResendCode = (evt) => {
    evt.preventDefault();
    const authManagement = client.service("authManagement");
    authManagement
      .create({
        action: "resendVerifySignup",
        value: { email: this.props.email },
      })
      .then(() => {
        this.setState({ showEmailSent: true });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleVerifyClick = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    if (this.state.verifyCode.length !== 6) return this.setState({ showVerifyError: true });
    const authManagement = client.service("authManagement");
    authManagement
      .create({
        action: "verifySignupShort",
        value: {
          user: {
            email: this.props.email,
          },
          token: this.state.verifyCode,
        },
      })
      .then((data) => {
        if (!this.props.username || !this.props.password) {
          return (window.location.href = "/");
        }
        this.login(this.props.username, this.props.password);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ showVerifyError: true });
      });
  };

  login = (username, password) => {
    client
      .authenticate({
        strategy: "local",
        username: username,
        password: password,
      })
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => console.error(error));
  };

  handleVerifyCodeInput = (evt) => {
    this.setState({
      verifyCode: evt.target.value,
    });
  };

  render() {
    return (
      <>
        {this.state.showVerifyError ? (
          <Alert style={{ marginTop: "1rem" }} severity="error">
            Invalid Verification Code
          </Alert>
        ) : (
          <></>
        )}
        <Typography style={{ marginTop: "1rem", color: "#fff", fontWeight: "600" }} variant="h6">
          {`Enter your verification code`}
        </Typography>
        <Typography style={{ marginTop: "1rem", color: "#b6b6b6" }} variant="subtitle2">
          {`We sent a 6 digit code to ${this.props.email}. By confirming your email, you will be able to keep your account secure and use all of the site's funcationality.`}
        </Typography>
        <form style={{ width: "100%" }} noValidate>
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
            label="Your Verification Code"
            name="VerifyCode"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            autoFocus
            onChange={this.handleVerifyCodeInput}
          />
          {this.state.showEmailSent ? <Alert severity="success">Email Sent!</Alert> : <></>}
          <Button onClick={this.handleResendCode} disabled={this.showEmailSent} color="secondary" style={{ padding: 0, whiteSpace: "nowrap", textTransform: "none" }}>
            Resend code
          </Button>
          <Typography style={{ marginTop: "0.3rem", color: "#fff" }} variant="subtitle2">
            {`Update Email? `}
            <Link href="/settings/security" variant="body2" color="secondary">
              Settings
            </Link>
          </Typography>
          <Typography style={{ marginTop: "0.3rem", color: "#b6b6b6" }} variant="subtitle2">
            {`You may also use the link in the email we sent you to verify your email.`}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.handleVerifyClick}
            disabled={this.state.verifyCode.length < 6 || this.state.verifyCode.length > 6}
            style={{ color: "#fff", marginTop: "1rem", marginBottom: "2rem" }}
          >
            Submit
          </Button>
        </form>
      </>
    );
  }
}

export default VerifyCode;
