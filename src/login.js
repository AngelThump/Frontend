import React, { Component } from "react";
import { ReactComponent as ShowPasswordSVG } from "./assets/showpassword.svg";
import { ReactComponent as HidePasswordSVG } from "./assets/hidepassword.svg";
import client from "./feathers";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };
  }

  componentDidMount() {}

  showPassword = (evt) => {
    evt.preventDefault();
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleUsernameChange = (evt) => {
    this.setState({ username: evt.target.value });
  };

  handlePasswordChange = (evt) => {
    this.setState({ password: evt.target.value });
  };

  handleLogin = (evt) => {
    evt.preventDefault();
    const { username, password } = this.state;
    return client
      .authenticate({
        strategy: "local",
        username,
        password,
      })
      .then((user) => {
        this.user = user;
        window.location.href = "/";
      })
      .catch((error) => console.error(error));
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
                    <label className="at-form-label" htmlFor="login-username">
                      Username
                    </label>
                  </div>
                </div>
                <div className="at-relative">
                  <input
                    autoFocus={true}
                    onChange={this.handleUsernameChange}
                    aria-label="Enter your username"
                    type="text"
                    className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    id="login-username"
                  ></input>
                </div>
              </div>
            </div>

            <div className="at-mg-t-2">
              <div className="login-password-input">
                <div>
                  <div className="password-input__label at-align-items-center at-flex at-mg-b-05">
                    <div className="at-flex-grow-1">
                      <label className="at-form-label" htmlFor="password-input">
                        Password
                      </label>
                    </div>
                  </div>
                  <div className="password-input__container at-relative">
                    <div className="at-relative">
                      <input
                        onChange={this.handlePasswordChange}
                        aria-label="Enter your password"
                        type={this.state.showPassword ? "text" : "password"}
                        className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-input--password at-pd-l-1 at-pd-r-1 at-pd-y-05"
                        autoCapitalize="off"
                        autoCorrect="off"
                        autoComplete="off"
                        id="password-input"
                      ></input>
                    </div>
                    <div className="password-input--manager-present at-absolute at-align-items-center at-bottom-0 at-c-text-overlay-alt at-flex at-top-0">
                      <button
                        onClick={this.showPassword}
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
                                {this.state.showPassword ? (
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

                <div className="at-mg-t-1">
                  <a
                    href="/user/recovery"
                    className="at-interactive at-link at-link--button"
                  >
                    <p className="at-font-size-7">Forgot your password?</p>
                  </a>
                </div>
              </div>
            </div>
            <div className="at-mg-t-2">
              <button
                onClick={this.handleLogin}
                disabled={
                  this.state.username.length > 0 &&
                  this.state.password.length > 0
                    ? null
                    : "disabled"
                }
                className={
                  this.state.username.length > 0 &&
                  this.state.password.length > 0
                    ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                }
              >
                <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                  <div className="at-flex-grow-0">Log In</div>
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
