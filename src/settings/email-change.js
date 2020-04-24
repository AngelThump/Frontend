import React, { Component } from "react";
import LazyLoad, { forceCheck } from "react-lazyload";
import logo from "../assets/logo.png";
import client from "../feathers";

class EmailChange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      emailError: false,
      isEmailValid: false,
      errorMessage: "",
      EmailSuccess: false
    };
  }

  componentDidMount() {}

  handleEmailInput = async (evt) => {
    const email = evt.target.value.toLowerCase();
    this.setState({
      email: email,
      emailError: false,
      EmailSuccess: false,
      isEmailValid: false
    });

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regex.test(email)) {
          this.setState({
              emailError: true,
              errorMessage:
              "This is not a valid email.",
              isEmailValid: false,
              EmailSuccess: false
          });
          return forceCheck();
      }

      await fetch("https://sso.angelthump.com/v1/validation/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
        if (typeof data.available === "undefined") {
            return this.setState({
              emailError: true,
              errorMessage: "Email validation broken. Contact Discord",
              isEmailValid: false,
              EmailSuccess: false
            });
        }
        if (data.available) {
            this.setState({
              emailError: false,
              errorMessage: "",
              isEmailValid: true,
              EmailSuccess: true
            });
            return forceCheck();
        } else {
            this.setState({
              emailError: true,
              errorMessage: "Email already exists!",
              isEmailValid: false,
              EmailSuccess: false
            });
            return forceCheck();
        }
        })
        .catch((e) => {
            console.error(e);
            this.setState({
                emailError: true,
                errorMessage:
                "Email validation broken. Contact Discord",
                isEmailValid: false,
                EmailSuccess: false
            });
            return forceCheck();
        });
    }, 500)
  };

  changeEmail = async (evt) => {
    if(evt) {
      evt.preventDefault();
    }

    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/email", {
      method: "PUT",
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email: this.state.email,
      }),
    }).then(data=>{
      if (data.error || data.code > 400 || data.status > 400) {
        return console.error(data);
      }
      this.props.emailChanged();
    }).catch(e=>{
      console.error(e);
    });
  }

  render() {
    const user = this.props.user;
    return (
      <div className="auth-modal at-relative">
        <div className="at-border-radius-medium at-flex at-overflow-hidden">
          <div className="auth-modal__left-content at-overflow-auto">
            <div className="at-c-background-base at-flex at-flex-column at-pd-x-2 at-pd-y-3">
              <div className="at-c-background-base at-flex at-flex-column at-pd-x-2 at-pd-y-3">
                <div>
                  <div className="at-flex at-flex-column">
                    <div className="at-align-items-center at-inline-flex at-justify-content-center">
                      <figure className="at-inline-flex">
                        <LazyLoad once>
                          <img
                            className="at-logo__img"
                            width="130px"
                            height="47px"
                            src={logo}
                            alt=""
                          ></img>
                        </LazyLoad>
                      </figure>
                      <div className="at-mg-l-05">
                        <h4 className="at-font-size-4 at-strong">
                          Change your Email, {user.display_name}?
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={this.state.emailError ? "server-message-alert at-border-radius-large at-c-background-alt-2 at-full-width at-mg-t-2 at-mg-x-auto at-pd-l-1 at-pd-r-2 at-pd-y-1 at-relative" : "server-message-success at-border-radius-large at-c-background-alt-2 at-full-width at-mg-t-2 at-mg-x-auto at-pd-l-1 at-pd-r-2 at-pd-y-1 at-relative"}
                  style={{
                    display: this.state.emailError || this.state.EmailSuccess ? "flex" : "none",
                  }}
                >
                  <div className="server-message-alert__icon at-align-items-start at-flex">
                    <figure className="at-svg">
                      <LazyLoad once>
                        <svg
                          className="at-svg__asset at-svg__asset--inherit at-svg__asset--notificationerror"
                          width="30px"
                          height="30px"
                          version="1.1"
                          viewBox="0 0 20 20"
                          x="0px"
                          y="0px"
                          style={{display: this.state.emailError ? 'block' : 'none'}}
                        >
                          <g>
                            <path
                              fillRule="evenodd"
                              d="M2 10a8 8 0 1016 0 8 8 0 00-16 0zm12 1V9H6v2h8z"
                              clipRule="evenodd"
                            ></path>
                          </g>
                        </svg>
                        <svg className="at-svg__asset at-svg__asset--notificationsuccess at-svg__asset--success" style={{display: this.state.EmailSuccess ? 'block' : 'none'}} width="30px" height="30px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm3 5l1.5 1.5L9 14l-3.5-3.5L7 9l2 2 4-4z" clipRule="evenodd"></path></g></svg>
                      </LazyLoad>
                    </figure>
                  </div>
                  <div className="at-flex at-flex-column at-pd-l-05">
                    <strong className="at-font-size-6">
                        {this.state.emailError ? this.state.errorMessage : "Email is available!" }
                    </strong>
                  </div>
                </div>

                <div className="at-mg-b-1">
                  <form noValidate>
                    <div className="at-c-background-base at-flex at-flex-column at-full-width">
                      <div className="at-mg-t-2">
                        <div className="login-password-input">
                          <div>
                            <div className="password-input__label at-align-items-center at-flex at-mg-b-05">
                              <label className="at-form-label">New Email</label>
                            </div>
                            <div className="password-input__container at-relative">
                              <div className="at-relative">
                                <input
                                  autoFocus={true}
                                  onChange={this.handleEmailInput}
                                  aria-label="Enter your new email"
                                  type="text"
                                  className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-input--password at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                  autoCapitalize="off"
                                  autoCorrect="off"
                                  autoComplete="off"
                                  id="new-email-input"
                                ></input>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="at-mg-t-2">
                        <button
                          onClick={this.changeEmail}
                          onSubmit={this.changeEmail}
                          disabled={
                            this.state.isEmailValid ? null : "disabled"
                          }
                          className={
                            this.state.isEmailValid
                              ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                              : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                          }
                        >
                          <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                            <div className="at-flex-grow-0">Update</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EmailChange;
