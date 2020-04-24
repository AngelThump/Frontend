import React, { Component } from "react";
import client from "../feathers";
import LazyLoad, { forceCheck } from "react-lazyload";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: false,
      showPassword: false
    };
  }

  componentDidMount() {
    document.title = "AngelThump - Login"
  }

  showPassword = (evt) => {
    if(evt) {
      evt.preventDefault();
    }
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleUsernameChange = (evt) => {
    this.setState({ username: evt.target.value });
  };

  handlePasswordChange = (evt) => {
    this.setState({ password: evt.target.value });
  };

  handleLogin = (evt) => {
    if(evt) {
      evt.preventDefault();
    }
    let { username, password } = this.state;
    return client
      .authenticate({
        strategy: "local",
        username: username,
        password,
      })
      .then((user) => {
        this.user = user;
        window.location.href = "/";
      })
      .catch((e) => {
        this.setState({ error: true }, () => {
          forceCheck();
        });
        console.error(e);
      });
  };

  render() {
    if (this.props.user !== undefined) {
      window.location.href = "/";
    }
    return (
      <div>
        <div
          className="server-message-alert at-border-radius-large at-c-background-alt-2 at-full-width at-mg-t-2 at-mg-x-auto at-pd-l-1 at-pd-r-2 at-pd-y-05 at-relative"
          style={{ display: this.state.error ? "flex" : "none" }}
        >
          <div className="server-message-alert__icon at-align-items-start at-flex">
            <div className="at-svg">
              <svg className="at-svg__asset at-svg__asset--alert at-svg__asset--notificationerror" width="25px" height="25px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fillRule="evenodd" d="M2 10a8 8 0 1016 0 8 8 0 00-16 0zm12 1V9H6v2h8z" clipRule="evenodd"></path></g></svg>
            </div>
          </div>
          <div className="at-flex at-flex-column at-pd-l-05">
            <strong className="at-font-size-6">
              Incorrect login details. Please try again.
            </strong>
          </div>
        </div>
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
                      onKeyPress={this.handleLoginPress}
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
                        <label
                          className="at-form-label"
                          htmlFor="password-input"
                        >
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
                          type="button"
                          onClick={this.showPassword}
                          className="at-align-items-center at-align-middle at-border-bottom-left-radius-small at-border-bottom-right-radius-small at-border-top-left-radius-small at-border-top-right-radius-small at-button-icon at-button-icon--secondary at-button-icon--small at-core-button at-core-button--small at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                          tabIndex="-1"
                          aria-label="Show Password"
                        >
                          <span className="at-button-icon__icon">
                            <div style={{ width: "1.6rem", height: "1.6rem" }}>
                              <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                <div className="at-aspect at-aspect--align-top">
                                  <div
                                    className="at-aspect__spacer"
                                    style={{ paddingBottom: "100%" }}
                                  ></div>
                                  {this.state.showPassword ? (
                                    <LazyLoad>
                                    <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M16.5 18l1.5-1.5-2.876-2.876a9.99 9.99 0 001.051-1.191L18 10l-1.825-2.433a9.992 9.992 0 00-2.855-2.575 35.993 35.993 0 01-.232-.14 6 6 0 00-6.175 0 35.993 35.993 0 01-.35.211L3.5 2 2 3.5 16.5 18zm-2.79-5.79a8 8 0 00.865-.977L15.5 10l-.924-1.233a7.996 7.996 0 00-2.281-2.058 37.22 37.22 0 01-.24-.144 4 4 0 00-4.034-.044l1.53 1.53a2 2 0 012.397 2.397l1.762 1.762z" fillRule="evenodd" clipRule="evenodd"></path><path d="M11.35 15.85l-1.883-1.883a3.996 3.996 0 01-1.522-.532 38.552 38.552 0 00-.239-.144 7.994 7.994 0 01-2.28-2.058L4.5 10l.428-.571L3.5 8 2 10l1.825 2.433a9.992 9.992 0 002.855 2.575c.077.045.155.092.233.14a6 6 0 004.437.702z"></path></g></svg>
                                  </LazyLoad>    
                                ) : (
                                  <LazyLoad>
                                    <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M11.998 10a2 2 0 11-4 0 2 2 0 014 0z"></path><path fillRule="evenodd" d="M16.175 7.567L18 10l-1.825 2.433a9.992 9.992 0 01-2.855 2.575l-.232.14a6 6 0 01-6.175 0 35.993 35.993 0 00-.233-.14 9.992 9.992 0 01-2.855-2.575L2 10l1.825-2.433A9.992 9.992 0 016.68 4.992l.233-.14a6 6 0 016.175 0l.232.14a9.992 9.992 0 012.855 2.575zm-1.6 3.666a7.99 7.99 0 01-2.28 2.058l-.24.144a4 4 0 01-4.11 0 38.552 38.552 0 00-.239-.144 7.994 7.994 0 01-2.28-2.058L4.5 10l.925-1.233a7.992 7.992 0 012.28-2.058 37.9 37.9 0 00.24-.144 4 4 0 014.11 0l.239.144a7.996 7.996 0 012.28 2.058L15.5 10l-.925 1.233z" clipRule="evenodd"></path></g></svg>
                                  </LazyLoad>
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
      </div>
    );
  }
}

export default Login;
