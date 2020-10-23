import React, { Component } from "react";
import SimpleBar from 'simplebar-react';
import logo from "./assets/logo.png";
import LazyLoad from "react-lazyload";
import Register from './auth/register';
import Login from './auth/login';
import VerifyCode from './auth/verify-code';

class AuthModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: this.props.login,
      register: this.props.register,
      verification: false,
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.setState({
        verification: !this.props.user.isVerified,
        email: this.props.user.email,
      });
    }
  }

  showLogin = () => {
    this.setState({ login: true, register: false });
  };

  showRegister = () => {
    this.setState({ register: true, login: false });
  };

  showVerification = (email, username, password) => {
    this.setState({
      verification: true,
      email: email,
      username: username,
      password: password,
      login: false
    });
  };

  showVerificationLogin = (email) => {
    this.setState({
      verification: true,
      email: email,
      login: true
    });
  }

  render() {
    return (
      <SimpleBar className="scrollable-area">
        <div style={{ maxWidth: "36em", margin: "0px auto" }}>
            <LazyLoad>
              {this.state.verification ? (
                <VerifyCode
                  email={this.state.email}
                  username={this.state.username}
                  password={this.state.password}
                  login={this.state.login}
                />
              ) : (
                <div className="at-c-background-base at-flex at-flex-column at-pd-x-2 at-pd-y-3">
                  <div>
                    <div className="at-flex at-flex-column">
                      <div className="at-align-items-center at-inline-flex at-justify-content-center">
                        <figure className="at-svg">
                          <img
                            className="at-logo__img"
                            width="110px"
                            height="40px"
                            src={logo}
                            alt=""
                          ></img>
                        </figure>
                        <div className="at-mg-l-05">
                          <h4 className="at-font-size-4 at-strong">
                            {this.state.login
                              ? "Log in to AngelThump"
                              : "Join AngelThump Today!"}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="at-mg-t-1">
                    <div className="at-font-size-5">
                      <div className="at-border-b at-flex at-full-width at-relative at-tabs">
                        <ul
                          role="tablist"
                          className="at-align-items-center at-flex at-flex-grow-1 at-flex-wrap at-font-size-4 at-full-height at-justify-content-start"
                        >
                          <li
                            className={
                              this.state.login
                                ? "at-align-items-center at-c-text-link at-flex-grow-0 at-full-height at-justify-content-center at-tabs__tab"
                                : "at-align-items-center at-c-text-base at-flex-grow-0 at-full-height at-justify-content-center at-tabs__tab"
                            }
                            role="presentation"
                          >
                            <button
                              onClick={this.showLogin}
                              role="tab"
                              className="at-block at-c-text-inherit at-full-height at-full-width at-interactive at-pd-r-2 at-tab-item"
                            >
                              <div className="at-align-left at-flex at-flex-column at-full-height">
                                <div className="at-flex-grow-0">
                                  <div className="at-font-size-5 at-regular">
                                    Log In
                                  </div>
                                </div>
                                <div className="at-flex-grow-1"></div>
                                <div className="at-flex-grow-0">
                                  <div
                                    className="at-tabs__active-indicator"
                                    style={{
                                      visibility: this.state.login
                                        ? "visible"
                                        : "hidden",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </button>
                          </li>

                          <li
                            className={
                              this.state.register
                                ? "at-align-items-center at-c-text-link at-flex-grow-0 at-full-height at-justify-content-center at-tabs__tab"
                                : "at-align-items-center at-c-text-base at-flex-grow-0 at-full-height at-justify-content-center at-tabs__tab"
                            }
                            role="presentation"
                          >
                            <button
                              onClick={this.showRegister}
                              role="tab"
                              className="at-block at-c-text-inherit at-full-height at-full-width at-interactive at-pd-r-2 at-tab-item"
                            >
                              <div className="at-align-left at-flex at-flex-column at-full-height">
                                <div className="at-flex-grow-0">
                                  <div className="at-font-size-5 at-regular">
                                    Register
                                  </div>
                                </div>
                                <div className="at-flex-grow-1"></div>
                                <div className="at-flex-grow-0">
                                  <div
                                    className="at-tabs__active-indicator"
                                    style={{
                                      visibility: this.state.register
                                        ? "visible"
                                        : "hidden",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <LazyLoad>
                    {this.state.login ? (
                      <Login user={this.props.user} history={this.props.history} showVerificationLogin={this.showVerificationLogin} />
                    ) : this.state.register ? (
                      <Register
                        user={this.props.user}
                        showVerification={this.showVerification}
                      />
                    ) : (
                      <></>
                    )}
                  </LazyLoad>
                </div>
              )}
            </LazyLoad>
        </div>
      </SimpleBar>
    );
  }
}

export default AuthModal;
