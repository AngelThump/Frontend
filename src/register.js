import React, { Component } from "react";
import { ReactComponent as ShowPasswordSVG } from "./assets/showpassword.svg";
import { ReactComponent as HidePasswordSVG } from "./assets/hidepassword.svg";
import { ReactComponent as RegError } from "./assets/reg-error.svg";
import { ReactComponent as RegSuccess } from "./assets/reg-success.svg";
import ReactPasswordStrength from "react-password-strength";
import ReCAPTCHA from "react-google-recaptcha";
import RESERVED_USERNAMES from "./json/reserved_usernames.json";

//KEYUPPRESS FOR ENTER TO SUBMIT

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regUsername: "",
      regPassword: "",
      regEmail: "",
      regConfirmPassword: "",
      showRegPassword: false,
      showRegConfirmPassword: false,
      showRegConfirmPasswordError: false,
      showRegConfirmPasswordSuccess: false,
      showRegEmailError: false,
      showRegEmailSuccess: false,
      showRegEmailIcon: false,
      showRegistrationUsernameText: false,
      showRegUsernameSpinner: false,
      showRegEmailSpinner: false,
      errorRegUsernameMsg: "",
      showRegUsernameError: false,
      showRegUsernameSuccess: false,
      errorRegEmailMsg: "",
      successRegEmailMsg: "",
      isPasswordValid: false,
      captcha: null,
      passLength: 0,
    };
    this.usernameInput = {};
    this.recaptcha = {};
    this.DISABLED_USERNAMES = [
      "recovery",
      "help",
      "register",
      "signup",
      "login",
      "angelthump",
      "god",
      "dashboard",
      "admin",
      "settings",
      "password",
      "reset",
      "embed",
      "popout",
      "email",
      "username",
    ];
  }

  componentDidMount() {}

  showRegPassword = (evt) => {
    evt.preventDefault();
    this.setState({ showRegPassword: !this.state.showRegPassword });
  };

  showRegConfirmPassword = (evt) => {
    evt.preventDefault();
    this.setState({
      showRegConfirmPassword: !this.state.showRegConfirmPassword,
    });
  };

  andleRegUsernameFocus = (evt) => {
    if (!this.state.showRegUsernameError) {
      this.setState({ showRegistrationUsernameText: true });
    }
  };

  handleRegUsernameBlur = (evt) => {
    this.setState({ showRegistrationUsernameText: false });
  };

  handleRegUsernameChange = (evt) => {
    this.setState({
      regUsername: evt.target.value.toLowerCase(),
      showRegUsernameSpinner: true,
      showRegUsernameSuccess: false,
      showRegUsernameError: false,
    });

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      if (
        this.state.regUsername.length > 3 &&
        this.state.regUsername.length < 26
      ) {
        const regex = /^\w+$/;
        if (!regex.test(this.state.regUsername)) {
          return this.setState({
            showRegUsernameError: true,
            showRegUsernameSuccess: false,
            showRegUsernameSpinner: false,
            showRegistrationUsernameText: false,
            errorRegUsernameMsg:
              "Only Alphanumeric Characters! 'A-Z','0-9' and '_'",
          });
        }
        if (
          RESERVED_USERNAMES.includes(this.state.regUsername) ||
          this.DISABLED_USERNAMES.includes(this.state.regUsername)
        ) {
          return this.setState({
            showRegUsernameError: true,
            showRegUsernameSuccess: false,
            showRegUsernameSpinner: false,
            showRegistrationUsernameText: false,
            errorRegUsernameMsg: "Username is taken!",
          });
        }
        await fetch("https://sso.angelthump.com:8080/v1/validation/username", {
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
            if (typeof data.available === "undefined") {
              return this.setState({
                showRegUsernameError: true,
                showRegUsernameSuccess: false,
                showRegUsernameSpinner: false,
                showRegistrationUsernameText: false,
                errorRegUsernameMsg:
                  "Username validation broken. Contact Discord",
              });
            }
            if (data.available) {
              this.setState({
                showRegistrationUsernameText: true,
                showRegUsernameSpinner: false,
                showRegUsernameSuccess: true,
              });
            } else {
              this.setState({
                showRegUsernameError: true,
                showRegUsernameSuccess: false,
                showRegUsernameSpinner: false,
                showRegistrationUsernameText: false,
                errorRegUsernameMsg: "Username is taken!",
              });
            }
          })
          .catch((e) => {
            console.error(e);
            this.setState({
              showRegUsernameError: true,
              showRegUsernameSuccess: false,
              showRegUsernameSpinner: false,
              showRegistrationUsernameText: false,
              errorRegUsernameMsg:
                "Username validation broken. Contact Discord",
            });
          });
      } else {
        this.setState({
          showRegUsernameError: true,
          showRegUsernameSuccess: false,
          showRegUsernameSpinner: false,
          showRegistrationUsernameText: false,
          errorRegUsernameMsg: "Username must be between 4 and 25 characters",
        });
      }
    }, 500);
  };

  handleRegPassword = (state) => {
    this.setState({
      regPassword: state.password,
      passLength: state.password.length,
      isPasswordValid: state.isValid,
    });

    if (this.state.regConfirmPassword.length > 0) {
      this.setState({
        showRegConfirmPasswordSuccess:
          this.state.regConfirmPassword === state.password,
        showRegConfirmPasswordError:
          this.state.regConfirmPassword !== state.password,
      });
    }
  };

  handleRegConfirmPassword = (evt) => {
    this.setState({
      showRegConfirmPasswordSuccess: false,
      showRegConfirmPasswordError: false,
      regConfirmPassword: evt.target.value,
    });
    if (evt.target.value.length > 0) {
      if (evt.target.value === this.state.regPassword) {
        this.setState({
          showRegConfirmPasswordSuccess: true,
          showRegConfirmPasswordError: false,
        });
      } else {
        this.setState({
          showRegConfirmPasswordSuccess: false,
          showRegConfirmPasswordError: true,
          errorRegConfirmPasswordMsg: "Passwords do not match",
        });
      }
    }
  };

  handleEmail = (evt) => {
    this.setState({
      regEmail: evt.target.value.toLowerCase(),
      showRegEmailSpinner: true,
      showRegEmailSuccess: false,
      showRegEmailError: false,
    });

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (regex.test(this.state.regEmail)) {
        await fetch("https://sso.angelthump.com:8080/v1/validation/email", {
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
            if (typeof data.available === "undefined") {
              return this.setState({
                showRegEmailError: true,
                showRegEmailSuccess: false,
                showRegEmailSpinner: false,
                errorRegEmailMsg: "Email validation broken. Contact Discord",
              });
            }
            if (data.available) {
              this.setState({
                showRegEmailError: false,
                showRegEmailSuccess: true,
                showRegEmailSpinner: false,
                successRegEmailMsg:
                  "You will need to verify your email to broadcast!",
              });
            } else {
              this.setState({
                showRegEmailError: true,
                showRegEmailSuccess: false,
                showRegEmailSpinner: false,
                errorRegEmailMsg: "Email is taken!",
              });
            }
          })
          .catch((e) => {
            this.setState({
              showRegEmailError: true,
              showRegEmailSuccess: false,
              showRegEmailSpinner: false,
              errorRegEmailMsg: "Email validation broken. Contact Discord",
            });
            console.error(e);
          });
      } else {
        this.setState({
          showRegEmailError: true,
          showRegEmailSuccess: false,
          showRegEmailSpinner: false,
          errorRegEmailMsg: "This is not a valid email",
        });
      }
    }, 500);
  };

  handleRegister = (evt) => {
    evt.preventDefault();
    const { regUsername, regPassword, regEmail, captcha } = this.state;

    fetch("https://sso.angelthump.com:8080/v1/signup", {
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
        if (data.error) {
          this.recaptcha.reset();
          return console.error(data.errorMsg);
        }
        this.props.showVerification(regEmail, regUsername, regPassword);
      })
      .catch((e) => {
        this.recaptcha.reset();
        console.error(e);
      });
  };

  handleRecaptcha = (value) => {
    this.setState({ captcha: value });
  };

  handleRegUsernameFocus = (evt) => {
    if (!this.state.showRegUsernameError) {
      this.setState({ showRegistrationUsernameText: true });
    }
  };

  render() {
    if (this.props.user !== undefined) {
      window.location.href = "/";
    }
    return (
      <div className="at-mg-b-1">
        <form noValidate>
          <div className="at-c-background-base at-flex at-flex-column at-full-width">
            <div className="at-mg-t-2">
              <div>
                <div className="at-align-items-center at-flex at-mg-b-05">
                  <div className="at-flex-grow-1">
                    <label className="at-form-label" htmlFor="signup-username">
                      Username
                    </label>
                  </div>
                  <div
                    className="at-loading-spinner"
                    style={{
                      animationDelay: "0ms",
                      display: this.state.showRegUsernameSpinner
                        ? "block"
                        : "none",
                    }}
                  >
                    <div className="at-loading-spinner__circle at-loading-spinner__circle--small"></div>
                  </div>
                  <figure
                    className="at-svg"
                    style={{
                      display: this.state.showRegUsernameError
                        ? "block"
                        : "none",
                    }}
                  >
                    <RegError></RegError>
                  </figure>
                  <figure
                    className="at-svg"
                    style={{
                      display: this.state.showRegUsernameSuccess
                        ? "block"
                        : "none",
                    }}
                  >
                    <RegSuccess></RegSuccess>
                  </figure>
                </div>
                <div className="at-relative">
                  <input
                    ref={(ref) => {
                      this.usernameInput = ref;
                    }}
                    autoFocus={true}
                    onFocus={this.handleRegUsernameFocus}
                    onBlur={this.handleRegUsernameBlur}
                    onChange={this.handleRegUsernameChange}
                    aria-label="Enter a username"
                    type="text"
                    className={
                      this.state.showRegUsernameError
                        ? "at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-input--error at-input--password at-pd-l-1 at-pd-r-1 at-pd-y-05"
                        : "at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05"
                    }
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    id="signup-username"
                  ></input>
                </div>
                <div
                  className="form-group-auth__animated-text"
                  style={{
                    height: this.state.showRegistrationUsernameText
                      ? "37px"
                      : "21px",
                  }}
                >
                  <div
                    className={
                      this.state.showRegistrationUsernameText
                        ? "at-animation at-animation--animate at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease"
                        : "at-animation at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease"
                    }
                  >
                    <div
                      className="at-pd-t-05"
                      style={{
                        display: this.state.showRegistrationUsernameText
                          ? "block"
                          : "none",
                      }}
                    >
                      <p className="at-c-text-alt-2 at-font-size-7">
                        This is how people will view your channel
                      </p>
                    </div>
                    <div
                      className="at-pd-t-05"
                      style={{
                        display: this.state.showRegUsernameError
                          ? "block"
                          : "none",
                      }}
                    >
                      <p className="at-c-text-error at-font-size-7">
                        {this.state.errorRegUsernameMsg}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="at-mg-t-2">
              <div>
                <div className="at-align-items-center at-flex at-mg-b-05">
                  <div className="at-flex-grow-1">
                    <label className="at-form-label" htmlFor="password-input">
                      Password
                    </label>
                  </div>
                </div>
                <div className="at-relative">
                  <ReactPasswordStrength
                    style={{ border: "0" }}
                    minLength={6}
                    minScore={2}
                    scoreWords={["weak", "fair", "good", "strong"]}
                    changeCallback={this.handleRegPassword}
                    inputProps={{
                      "aria-label": "Enter a secure password",
                      type: this.state.showRegPassword ? "text" : "password",
                      id: "signup-password",
                      name: "password_input",
                      autoComplete: "off",
                      autoCapitalize: "off",
                      autoCorrect: "off",
                      className:
                        "at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05",
                    }}
                  />
                  <div className="password-input--manager-present at-absolute at-align-items-center at-bottom-0 at-c-text-overlay-alt at-flex at-top-0">
                    <button
                      onClick={this.showRegPassword}
                      className="at-align-items-center at-align-middle at-border-bottom-left-radius-small at-border-bottom-right-radius-small at-border-top-left-radius-small at-border-top-right-radius-small at-button-icon at-button-icon--secondary at-button-icon--small at-core-button at-core-button--small at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                      tabIndex="-1"
                      aria-label="Show Password"
                    >
                      <span className="at-button-icon__icon">
                        <div style={{ width: "1rem", height: "1.6rem" }}>
                          <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                            <div className="at-aspect at-aspect--align-top">
                              <div
                                className="at-aspect__spacer"
                                style={{ paddingBottom: "100%" }}
                              ></div>
                              {this.state.showRegPassword ? (
                                <HidePasswordSVG />
                              ) : (
                                <ShowPasswordSVG />
                              )}
                            </div>
                          </div>
                        </div>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="form-group-auth__animated-text"
              style={{ height: "21px" }}
            ></div>
            <div className="at-mg-t-2">
              <div>
                <div className="password-input__label at-align-items-center at-flex at-mg-b-05">
                  <div className="at-flex-grow-1">
                    <label
                      className="at-form-label"
                      htmlFor="password-input-confirmation"
                    >
                      Confirm Password
                    </label>
                  </div>
                  <figure
                    className="at-svg"
                    style={{
                      display: this.state.showRegConfirmPasswordError
                        ? "block"
                        : "none",
                    }}
                  >
                    <RegError></RegError>
                  </figure>
                  <figure
                    className="at-svg"
                    style={{
                      display: this.state.showRegConfirmPasswordSuccess
                        ? "block"
                        : "none",
                    }}
                  >
                    <RegSuccess></RegSuccess>
                  </figure>
                </div>

                <div className="password-input__container at-relative">
                  <div className="at-relative">
                    <input
                      onChange={this.handleRegConfirmPassword}
                      aria-label="Confirm your password"
                      type={
                        this.state.showRegConfirmPassword ? "text" : "password"
                      }
                      className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-input--password at-pd-l-1 at-pd-r-1 at-pd-y-05"
                      autoCapitalize="off"
                      autoComplete="current-password"
                      autoCorrect="off"
                      id="password-input-confirmation"
                    ></input>
                  </div>
                  <div className="password-input--manager-present at-absolute at-align-items-center at-bottom-0 at-c-text-overlay-alt at-flex at-top-0">
                    <button
                      onClick={this.showRegConfirmPassword}
                      className="at-align-items-center at-align-middle at-border-bottom-left-radius-small at-border-bottom-right-radius-small at-border-top-left-radius-small at-border-top-right-radius-small at-button-icon at-button-icon--secondary at-button-icon--small at-core-button at-core-button--small at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                      tabIndex="-1"
                      aria-label="Show Password"
                    >
                      <span className="at-button-icon__icon">
                        <div style={{ width: "1rem", height: "1.6rem" }}>
                          <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                            <div className="at-aspect at-aspect--align-top">
                              <div
                                className="at-aspect__spacer"
                                style={{ paddingBottom: "100%" }}
                              ></div>
                              {this.state.showRegConfirmPassword ? (
                                <HidePasswordSVG />
                              ) : (
                                <ShowPasswordSVG />
                              )}
                            </div>
                          </div>
                        </div>
                      </span>
                    </button>
                  </div>
                  <div
                    className="form-group-auth__animated-text"
                    style={{
                      height: this.state.showRegConfirmPasswordError
                        ? "21px"
                        : "0px",
                    }}
                  >
                    <div
                      className={
                        this.state.showRegConfirmPasswordError
                          ? "at-animation at-animation--animate at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease"
                          : "at-animation at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease"
                      }
                    >
                      <div
                        className="at-pd-t-05"
                        style={{
                          display: this.state.showRegConfirmPasswordError
                            ? "block"
                            : "none",
                        }}
                      >
                        <p className="at-c-text-error at-font-size-7">
                          {this.state.errorRegConfirmPasswordMsg}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="at-mg-t-2">
              <div>
                <div className="at-align-items-center at-flex at-mg-b-05">
                  <div className="at-flex-grow-1">
                    <label className="at-form-label" htmlFor="email-input">
                      Email
                    </label>
                  </div>
                  <div
                    className="at-loading-spinner"
                    style={{
                      animationDelay: "0ms",
                      display: this.state.showRegEmailSpinner
                        ? "block"
                        : "none",
                    }}
                  >
                    <div className="at-loading-spinner__circle at-loading-spinner__circle--small"></div>
                  </div>
                  <figure
                    className="at-svg"
                    style={{
                      display: this.state.showRegEmailError ? "block" : "none",
                    }}
                  >
                    <RegError></RegError>
                  </figure>
                  <figure
                    className="at-svg"
                    style={{
                      display: this.state.showRegEmailSuccess
                        ? "block"
                        : "none",
                    }}
                  >
                    <RegSuccess></RegSuccess>
                  </figure>
                </div>
              </div>

              <div className="at-relative">
                <input
                  onChange={this.handleEmail}
                  aria-label="Enter your email address"
                  type="email"
                  className={
                    !this.state.showRegEmailError
                      ? "at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05"
                      : "at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-input--error at-pd-l-1 at-pd-r-1 at-pd-y-05"
                  }
                  autoCapitalize="off"
                  autoCorrect="off"
                  id="email-input"
                ></input>
              </div>

              <div
                className="form-group-auth__animated-text"
                style={{ height: "21px" }}
              >
                <div
                  className={
                    this.state.showRegEmailSuccess
                      ? "at-animation at-animation--animate at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease"
                      : "at-animation at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease"
                  }
                >
                  <div
                    className="at-pd-t-05"
                    style={{
                      display: this.state.showRegEmailSuccess
                        ? "block"
                        : "none",
                    }}
                  >
                    <p className="at-c-text-alt-2 at-font-size-7">
                      {this.state.successRegEmailMsg}
                    </p>
                  </div>
                  <div
                    className="at-pd-t-05"
                    style={{
                      display: this.state.showRegEmailError ? "block" : "none",
                    }}
                  >
                    <p className="at-c-text-error at-font-size-7">
                      {this.state.errorRegEmailMsg}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="at-mg-t-2">
              <div
                className="at-align-center at-mg-b-1"
                style={{ textAlign: "center" }}
              >
                <ReCAPTCHA
                  ref={(ref) => (this.recaptcha = ref)}
                  style={{ display: "inline-block" }}
                  sitekey="6Lf6TVgUAAAAAFfSioc-cykEjZnF7_ol0eXp2wKG"
                  onChange={this.handleRecaptcha}
                  theme="dark"
                />
              </div>
            </div>

            <div className="at-mg-t-1">
              <div className="at-align-center at-mg-b-2">
                <p
                  className="at-c-text-alt-2 at-font-size-7"
                  style={{ textAlign: "center" }}
                >
                  By clicking Sign Up, you are indicating that you have read and
                  acknowledge the&nbsp;
                  <a
                    href="/p/tos"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="at-interactive at-link at-link--button"
                  >
                    Terms of Service
                  </a>
                  &nbsp;and&nbsp;
                  <a
                    href="/p/privacy"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="at-interactive at-link at-link--button"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
              <button
                onClick={this.handleRegister}
                disabled={
                  this.state.showRegUsernameSuccess &&
                  this.state.isPasswordValid &&
                  this.state.showRegConfirmPasswordSuccess &&
                  this.state.showRegEmailSuccess &&
                  this.state.captcha != null
                    ? null
                    : "disabled"
                }
                className={
                  this.state.showRegUsernameSuccess &&
                  this.state.isPasswordValid &&
                  this.state.showRegConfirmPasswordSuccess &&
                  this.state.showRegEmailSuccess &&
                  this.state.captcha != null
                    ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                }
              >
                <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                  <div className="at-flex-grow-0">Register</div>
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
