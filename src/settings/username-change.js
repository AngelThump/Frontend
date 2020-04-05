import React, { Component } from "react";
import LazyLoad, { forceCheck } from "react-lazyload";
import logo from "../assets/logo.png";
import RESERVED_USERNAMES from "../json/reserved_usernames.json";
import client from "../feathers";

class UsernameChange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      usernameError: false,
      isUsernameValid: false,
      errorMessage: "",
      usernameSuccess: false
    };
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

  handleUsernameInput = async (evt) => {
    const username = evt.target.value.toLowerCase();
    this.setState({
      username: username,
      usernameError: false
    });

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
        if(username.length < 4 || username.length > 25) {
            this.setState({
                usernameError: true,
                errorMessage: "Username must be between 4 and 25 characters",
                isUsernameValid: false,
                usernameSuccess: false
            });
            return forceCheck();
        }

        const regex = /^\w+$/;
        if (!regex.test(username)) {
            this.setState({
                usernameError: true,
                errorMessage:
                "Only Alphanumeric Characters! 'A-Z','0-9' and '_'",
                isUsernameValid: false,
                usernameSuccess: false
            });
            return forceCheck();
        }

        if (
            RESERVED_USERNAMES.includes(username) ||
            this.DISABLED_USERNAMES.includes(username)
        ) {
            this.setState({
                usernameError: true,
                errorMessage: "Username is taken!",
                isUsernameValid: false,
                usernameSuccess: false
            });
            return forceCheck();
        }

        await fetch("https://sso.angelthump.com:8080/v1/validation/username", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        username: username,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
        if (typeof data.available === "undefined") {
            return this.setState({
                usernameError: false,
                errorMessage: "Username validation broken. Contact Discord",
                isUsernameValid: false,
                usernameSuccess: false
            });
        }
        if (data.available) {
            this.setState({
                usernameError: false,
                errorMessage: "",
                isUsernameValid: true,
                usernameSuccess: true
            });
            return forceCheck();
        } else {
            this.setState({
                usernameError: true,
                errorMessage: "Username is taken!",
                isUsernameValid: false,
                usernameSuccess: false
            });
            return forceCheck();
        }
        })
        .catch((e) => {
            console.error(e);
            this.setState({
                usernameError: true,
                errorMessage:
                "Username validation broken. Contact Discord",
                isUsernameValid: false,
                usernameSuccess: false
            });
            return forceCheck();
        });
    }, 500)
  };

  changeUsername = async (evt) => {
    if(evt) {
        evt.preventDefault();
    }

    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com:8080/v1/user/username", {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            username: this.state.username,
        }),
    }).then(data=>{
        if(data.error) {
            return console.error(data);
        }
        window.location.reload();
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
                          Change your username, {user.display_name}?
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={this.state.usernameError ? "server-message-alert at-border-radius-large at-c-background-alt-2 at-full-width at-mg-t-2 at-mg-x-auto at-pd-l-1 at-pd-r-2 at-pd-y-1 at-relative" : "server-message-success at-border-radius-large at-c-background-alt-2 at-full-width at-mg-t-2 at-mg-x-auto at-pd-l-1 at-pd-r-2 at-pd-y-1 at-relative"}
                  style={{
                    display: this.state.usernameError || this.state.usernameSuccess ? "flex" : "none",
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
                          style={{display: this.state.usernameError ? 'block' : 'none'}}
                        >
                          <g>
                            <path
                              fillRule="evenodd"
                              d="M2 10a8 8 0 1016 0 8 8 0 00-16 0zm12 1V9H6v2h8z"
                              clipRule="evenodd"
                            ></path>
                          </g>
                        </svg>
                        <svg className="at-svg__asset at-svg__asset--notificationsuccess at-svg__asset--success" style={{display: this.state.usernameSuccess ? 'block' : 'none'}} width="30px" height="30px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm3 5l1.5 1.5L9 14l-3.5-3.5L7 9l2 2 4-4z" clipRule="evenodd"></path></g></svg>
                      </LazyLoad>
                    </figure>
                  </div>
                  <div className="at-flex at-flex-column at-pd-l-05">
                    <strong className="at-font-size-6">
                        {this.state.usernameError ? this.state.errorMessage : "Username is available!" }
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
                              <label className="at-form-label">New Username</label>
                            </div>
                            <div className="password-input__container at-relative">
                              <div className="at-relative">
                                <input
                                  autoFocus={true}
                                  onChange={this.handleUsernameInput}
                                  aria-label="Enter your new username"
                                  type="text"
                                  className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-input--password at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                  autoCapitalize="off"
                                  autoCorrect="off"
                                  autoComplete="off"
                                  id="new-username-input"
                                ></input>
                              </div>
                            </div>
                          </div>
                          <div className="at-mg-t-1">
                            <strong className="at-font-size-6">
                                New Channel Url
                            </strong>
                          </div>
                          <div className="at-mg-t-1">
                            <strong className="at-font-size-5">
                                https://angelthump.com/{this.state.username}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div className="at-mg-t-2">
                        <button
                          onClick={this.changeUsername}
                          onSubmit={this.changeUsername}
                          disabled={
                            this.state.isUsernameValid ? null : "disabled"
                          }
                          className={
                            this.state.isUsernameValid
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

export default UsernameChange;
