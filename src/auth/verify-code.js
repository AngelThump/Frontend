import React, { Component } from "react";
import client from "../feathers";
import { ReactComponent as RegError } from "../assets/error.svg";

class VerifyCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showVerifySubmit: false,
      showEmailSent: false,
      showVerifyError: false,
      verifyCode: "",
      verifyCode1: "",
      verifyCode2: "",
      verifyCode3: "",
      verifyCode4: "",
      verifyCode5: "",
      verifyCode6: "",
    };

    this.codeInput1 = {};
    this.codeInput2 = {};
    this.codeInput3 = {};
    this.codeInput4 = {};
    this.codeInput5 = {};
    this.codeInput6 = {};
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
      .then(() => {
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

  handleVerifyCode1 = (evt) => {
    this.setState({ verifyCode1: evt.target.value }, () => {
      this.setState(
        {
          verifyCode:
            this.state.verifyCode1 +
            this.state.verifyCode2 +
            this.state.verifyCode3 +
            this.state.verifyCode4 +
            this.state.verifyCode5 +
            this.state.verifyCode6,
        },
        () => {
          if (this.state.verifyCode.length === 6) {
            this.setState({ showVerifySubmit: true });
            this.handleVerifyClick();
          } else {
            this.setState({ showVerifySubmit: false });
          }
        }
      );
    });

    if (evt.target.value !== "") {
      this.codeInput2.focus();
    }
  };

  handleVerifyCode2 = (evt) => {
    this.setState({ verifyCode2: evt.target.value }, () => {
      this.setState(
        {
          verifyCode:
            this.state.verifyCode1 +
            this.state.verifyCode2 +
            this.state.verifyCode3 +
            this.state.verifyCode4 +
            this.state.verifyCode5 +
            this.state.verifyCode6,
        },
        () => {
          if (this.state.verifyCode.length === 6) {
            this.setState({ showVerifySubmit: true });
            this.handleVerifyClick();
          } else {
            this.setState({ showVerifySubmit: false });
          }
        }
      );
    });

    if (evt.target.value !== "") {
      this.codeInput3.focus();
    }
  };

  handleVerifyCode3 = (evt) => {
    this.setState({ verifyCode3: evt.target.value }, () => {
      this.setState(
        {
          verifyCode:
            this.state.verifyCode1 +
            this.state.verifyCode2 +
            this.state.verifyCode3 +
            this.state.verifyCode4 +
            this.state.verifyCode5 +
            this.state.verifyCode6,
        },
        () => {
          if (this.state.verifyCode.length === 6) {
            this.setState({ showVerifySubmit: true });
            this.handleVerifyClick();
          } else {
            this.setState({ showVerifySubmit: false });
          }
        }
      );
    });

    if (evt.target.value !== "") {
      this.codeInput4.focus();
    }
  };

  handleVerifyCode4 = (evt) => {
    this.setState({ verifyCode4: evt.target.value }, () => {
      this.setState(
        {
          verifyCode:
            this.state.verifyCode1 +
            this.state.verifyCode2 +
            this.state.verifyCode3 +
            this.state.verifyCode4 +
            this.state.verifyCode5 +
            this.state.verifyCode6,
        },
        () => {
          if (this.state.verifyCode.length === 6) {
            this.setState({ showVerifySubmit: true });
            this.handleVerifyClick();
          } else {
            this.setState({ showVerifySubmit: false });
          }
        }
      );
    });

    if (evt.target.value !== "") {
      this.codeInput5.focus();
    }
  };

  handleVerifyCode5 = (evt) => {
    this.setState({ verifyCode5: evt.target.value }, () => {
      this.setState(
        {
          verifyCode:
            this.state.verifyCode1 +
            this.state.verifyCode2 +
            this.state.verifyCode3 +
            this.state.verifyCode4 +
            this.state.verifyCode5 +
            this.state.verifyCode6,
        },
        () => {
          if (this.state.verifyCode.length === 6) {
            this.setState({ showVerifySubmit: true });
            this.handleVerifyClick();
          } else {
            this.setState({ showVerifySubmit: false });
          }
        }
      );
    });

    if (evt.target.value !== "") {
      this.codeInput6.focus();
    }
  };

  handleVerifyCode6 = (evt) => {
    this.setState({ verifyCode6: evt.target.value }, () => {
      this.setState(
        {
          verifyCode:
            this.state.verifyCode1 +
            this.state.verifyCode2 +
            this.state.verifyCode3 +
            this.state.verifyCode4 +
            this.state.verifyCode5 +
            this.state.verifyCode6,
        },
        () => {
          if (this.state.verifyCode.length === 6) {
            this.setState({ showVerifySubmit: true });
            this.handleVerifyClick();
          } else {
            this.setState({ showVerifySubmit: false });
          }
        }
      );
    });
  };

  handleVerifyCodeKeyUp = (index, evt) => {
    if (evt.key === "Backspace") {
      if (index === 1) {
        this.codeInput1.focus();
      } else if (index === 2) {
        this.codeInput2.focus();
      } else if (index === 3) {
        this.codeInput3.focus();
      } else if (index === 4) {
        this.codeInput4.focus();
      } else if (index === 5) {
        this.codeInput5.focus();
      }
    }
  };

  handleFocus = (evt) => evt.target.select();

  handlePasteCode = (evt) => {
    const codeArray = evt.clipboardData.getData("Text").split("");

    this.setState(
      {
        verifyCode1: codeArray[0],
        verifyCode2: codeArray[1],
        verifyCode3: codeArray[2],
        verifyCode4: codeArray[3],
        verifyCode5: codeArray[4],
        verifyCode6: codeArray[5],
      },
      () => {
        this.setState(
          {
            verifyCode:
              this.state.verifyCode1 +
              this.state.verifyCode2 +
              this.state.verifyCode3 +
              this.state.verifyCode4 +
              this.state.verifyCode5 +
              this.state.verifyCode6,
          },
          () => {
            if (this.state.verifyCode.length === 6) {
              this.setState({ showVerifySubmit: true });
              this.handleVerifyClick();
            } else {
              this.setState({ showVerifySubmit: false });
            }
          }
        );
      }
    );
  };

  render() {
    return (
      <div className="at-c-background-base at-flex at-flex-column at-pd-x-2 at-pd-y-3">
        <div className="at-mg-b-1">
          <div className="at-border-radius-medium at-overflow-hidden">
            <div className="at-align-items-center at-flex at-modal-header at-modal-header--md at-pd-05 at-relative">
              <div className="at-flex-grow-1 at-modal-header__title at-modal-header__title--md at-visible">
                <h2 className="at-font-size-3" id="modal-root-header">
                  Verify your Email Address
                </h2>
              </div>
            </div>

            <div className="at-pd-x-4 at-pd-y-1">
              <p className="at-font-size-4 at-strong">
                Enter your verification code
              </p>
              <div className="at-mg-b-2 at-mg-t-1">
                <p className="at-c-text-alt at-font-size-5">
                  We sent a 6-digit code to&nbsp;
                  <span className="at-strong">{this.props.email}</span>. By
                  Confirming your email, you will be able to keep your account
                  secure and use all of the sites funcationality.
                </p>
              </div>

              <div
                className="at-mg-b-2"
                style={{
                  display: this.state.showVerifyError ? "block" : "none",
                }}
              >
                <div className="at-border-radius-medium at-c-text-base at-in-feature-notification at-in-feature-notification--error at-relative">
                  <div className="at-border-radius-medium at-c-background-base">
                    <div className="at-flex">
                      <div className="at-flex at-full-width">
                        <div className="at-in-feature-notification__avatar at-in-feature-notification__avatar--adjusted at-pd-1">
                          <div className="at-align-items-center at-flex at-notification-figure at-notification-figure--error">
                            <div className="at-align-items-center at-icon at-inline-flex">
                              <div className="at-aspect at-aspect--align-top">
                                <div
                                  className="at-aspect__spacer"
                                  style={{ paddingBottom: "100%" }}
                                ></div>
                                <RegError></RegError>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="at-align-items-center at-flex at-full-width">
                          <div className="at-full-width at-pd-r-1 at-pd-y-1">
                            <div className="at-flex at-flex-column">
                              <div className="at-mg-r-0">
                                <p className="at-font-size-5 at-semibold">
                                  Verification Failed
                                </p>
                              </div>
                              <div className="at-mg-b-05 at-mg-r-0">
                                <p className="at-c-text-alt">
                                  Verification failed because provided code does
                                  not match.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="at-inline-flex"
                aria-label="Verification code input"
              >
                <div className="at-pd-r-1">
                  <div className="at-relative">
                    <input
                      ref={(ref) => (this.codeInput1 = ref)}
                      autoFocus={true}
                      value={this.state.verifyCode1}
                      style={{ textAlign: "center" }}
                      onPaste={this.handlePasteCode}
                      onFocus={this.handleFocus}
                      maxLength="1"
                      onChange={this.handleVerifyCode1}
                      onKeyUp={(e) => this.handleVerifyCodeKeyUp(0, e)}
                      type="text"
                      autoCapitalize="off"
                      autoCorrect="off"
                      className={
                        this.state.showVerifyError
                          ? "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                          : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                      }
                    ></input>
                  </div>
                </div>
                <div className="at-pd-r-1">
                  <div className="at-relative">
                    <input
                      ref={(ref) => (this.codeInput2 = ref)}
                      value={this.state.verifyCode2}
                      style={{ textAlign: "center" }}
                      onFocus={this.handleFocus}
                      maxLength="1"
                      onChange={this.handleVerifyCode2}
                      onKeyUp={(e) => this.handleVerifyCodeKeyUp(1, e)}
                      type="text"
                      autoCapitalize="off"
                      autoCorrect="off"
                      className={
                        this.state.showVerifyError
                          ? "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                          : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                      }
                    ></input>
                  </div>
                </div>
                <div className="at-pd-r-1">
                  <div className="at-relative">
                    <input
                      ref={(ref) => (this.codeInput3 = ref)}
                      value={this.state.verifyCode3}
                      style={{ textAlign: "center" }}
                      onFocus={this.handleFocus}
                      maxLength="1"
                      onChange={this.handleVerifyCode3}
                      onKeyUp={(e) => this.handleVerifyCodeKeyUp(2, e)}
                      type="text"
                      autoCapitalize="off"
                      autoCorrect="off"
                      className={
                        this.state.showVerifyError
                          ? "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                          : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                      }
                    ></input>
                  </div>
                </div>
                <div className="at-pd-r-1">
                  <div className="at-relative">
                    <input
                      ref={(ref) => (this.codeInput4 = ref)}
                      value={this.state.verifyCode4}
                      style={{ textAlign: "center" }}
                      onFocus={this.handleFocus}
                      maxLength="1"
                      onChange={this.handleVerifyCode4}
                      onKeyUp={(e) => this.handleVerifyCodeKeyUp(3, e)}
                      type="text"
                      autoCapitalize="off"
                      autoCorrect="off"
                      className={
                        this.state.showVerifyError
                          ? "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                          : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                      }
                    ></input>
                  </div>
                </div>
                <div className="at-pd-r-1">
                  <div className="at-relative">
                    <input
                      ref={(ref) => (this.codeInput5 = ref)}
                      value={this.state.verifyCode5}
                      style={{ textAlign: "center" }}
                      onFocus={this.handleFocus}
                      maxLength="1"
                      onChange={this.handleVerifyCode5}
                      onKeyUp={(e) => this.handleVerifyCodeKeyUp(4, e)}
                      type="text"
                      autoCapitalize="off"
                      autoCorrect="off"
                      className={
                        this.state.showVerifyError
                          ? "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                          : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                      }
                    ></input>
                  </div>
                </div>
                <div className="at-pd-r-0">
                  <div className="at-relative">
                    <input
                      ref={(ref) => (this.codeInput6 = ref)}
                      value={this.state.verifyCode6}
                      style={{ textAlign: "center" }}
                      onFocus={this.handleFocus}
                      maxLength="1"
                      onChange={this.handleVerifyCode6}
                      onKeyUp={(e) => this.handleVerifyCodeKeyUp(5, e)}
                      autoCapitalize="off"
                      autoCorrect="off"
                      className={
                        this.state.showVerifyError
                          ? "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                          : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                      }
                    ></input>
                  </div>
                </div>
              </div>
              <div className="at-mg-b-2 at-mg-t-1">
                <button
                  disabled={!this.state.showEmailSent ? null : "disabled"}
                  onClick={this.handleResendCode}
                  className={
                    this.state.showEmailSent
                      ? "at-interactive at-link at-link--button at-link--button--disabled"
                      : "at-interactive at-link at-link--button"
                  }
                >
                  {this.state.showEmailSent ? "Email Sent!" : "Resend Code"}
                </button>
                <div className="at-mg-t-1">
                  <p>
                    Update email?&nbsp;
                    <a
                      className="at-interactive at-link at-link--button"
                      href="/settings/security"
                    >
                      Settings
                    </a>
                  </p>
                </div>
              </div>
              <p className="at-c-text-alt-2 at-font-size-6">
                You may also use the link in the email we sent you to verify
                your email.
              </p>
              <div className="at-align-items-center at-flex at-flex-row-reverse at-justify-content-start at-pd-x-3 at-pd-y-2">
                <div>
                  <button
                    onClick={this.handleVerifyClick}
                    disabled={this.state.showVerifySubmit ? null : "disabled"}
                    className={
                      this.state.showVerifySubmit
                        ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                        : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    }
                  >
                    <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                      <div className="at-flex-grow-0">Submit</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerifyCode;
