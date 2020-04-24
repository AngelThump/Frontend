import React, { Component } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

const initalState = {
    email: "",
    validEmail: false,
    doneWithEmail: false,
    username: "",
    validUsername: false,
    captcha: null,
    message: "",
    doneWithUsername: false
}

class Recovery extends Component {
  constructor(props) {
    super(props);

    this.usernameInput = {};
    this.emailInput = {};
    this.recaptcha = {};

    this.state = initalState;
  }

  componentDidMount() {
    document.title = "AngelThump - Account Recovery"
  }

  handleRecaptcha = (value) => {
    this.setState({captcha: value})
  }

  EmailKeyPressed = evt => {
    if (evt.key === "Enter" && this.state.validEmail) {
      this.handleEmailClick()
    }
  }

  UsernameKeyPressed = evt => {
    if (evt.key === "Enter" && this.state.validUsername && this.state.captcha !== null) {
      this.sendPasswordReset()
    }
  }

  handleEmailInput = evt => {
    this.setState({email: evt.target.value}, () => {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regex.test(this.state.email)) {
            this.setState({validEmail: true})
        }
    })
  }

  handleEmailClick = evt => {
    if(evt) {
        evt.preventDefault();
    }
    this.setState({doneWithEmail: true}, () => {
        this.usernameInput.focus();
    });
  }

  handleEditButton = evt => {
    if(evt) {
        evt.preventDefault();
    }
    this.setState({doneWithEmail: false}, () => {
        this.emailInput.focus();
    });
  }

  handleUsernameInput = evt => {
    this.setState({username: evt.target.value}, () => {
        const regex = /^\w+$/;
        this.setState({validUsername: regex.test(this.state.username) && this.state.username.length > 3 && this.state.username.length < 26})
    })
  }

  sendPasswordReset = evt => {
    if(evt) {
        evt.preventDefault();
    }

    fetch('https://sso.angelthump.com/v1/user/password',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: this.state.email,
            "g-recaptcha-response": this.state.captcha
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error || data.code > 400 || data.status > 400) {
            this.recaptcha.reset();
            return console.error(data.errorMsg);
        }
        return this.setState({doneWithUsername: true, message:`password reset link`});
    }).catch(e => {
        console.error(e);
    })
  }

  sendUsernameEmail = evt => {
    evt.preventDefault();

    fetch('https://sso.angelthump.com/v1/user/username',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: this.state.email,
            "g-recaptcha-response": this.state.captcha
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error || data.code > 400 || data.status > 400) {
            this.recaptcha.reset();
            return console.error(data.errorMsg);
        }
        return this.setState({doneWithUsername: true, message:`username`});
    }).catch(e => {
        console.error(e);
    })
  }

  handleRestart = evt => {
    evt.preventDefault();
    this.setState(initalState);
    this.recaptcha.reset();
  }

  render() {
    return (
      <div className="at-absolute at-bottom-0 at-left-0 at-overflow-hidden at-right-0 at-top-0">
            <div className="at-flex at-justify-content-center at-pd-x-2 at-pd-y-5">
                <div className="account-recovery__body">
                    <p className="at-font-size-3 at-strong">{this.state.doneWithEmail && this.state.doneWithUsername ? "Check your email" : "AngelThump Account Recovery"}</p>
                    <div className="at-mg-b-2 at-mg-t-1" style={{display: this.state.doneWithEmail ? 'none' : 'block'}}>
                        <p className="at-font-size-4">To get started, give us your AngelThump Email.</p>
                    </div>
                    <div className="at-mg-y-05" style={{display: this.state.doneWithEmail ? 'none' : 'block'}}>
                        <div className="at-inline-flex at-mg-b-05">
                            <label className="at-form-label" htmlFor="account-recovery-label">Enter your email</label>
                        </div>
                        <div className="at-relative">
                            <input ref={ref => this.emailInput=ref} autoFocus={true} value={this.state.email} onChange={this.handleEmailInput} onKeyPress={this.EmailKeyPressed} aria-label="Enter your email" 
                            className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05"
                            autoCapitalize='off' autoCorrect='off' id='account-recovery-label'></input>
                        </div>
                        <div className="at-mg-y-2">
                            <button onClick={this.handleEmailClick} disabled={this.state.validEmail ? null : 'disabled'} 
                            className={this.state.validEmail ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative" 
                            : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}>
                                <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                                    <div className="at-core-button-label-text">Continue</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="at-mg-b-2 at-mg-t-1" style={{display: !this.state.doneWithEmail || this.state.doneWithUsername ? 'none' : 'block'}}>
                        <p className="at-font-size-4">Okay, now give us your AngelThump Username</p>
                    </div>

                    <div className="at-mg-y-2" style={{display: !this.state.doneWithEmail || this.state.doneWithUsername ? 'none' : 'block'}}>
                        <div className="at-flex-grow-1 at-font-size-6 at-form-group at-relative">
                            <div>
                                <div className="at-mg-b-05">
                                    <label className="at-form-label">Email</label>
                                </div>
                                <div className="at-align-items-center at-flex">
                                    <div className="at-mg-r-05">
                                        <p className="at-c-text-alt-2 at-font-size-4 at-strong">{this.state.email}</p>
                                    </div>
                                    <button onClick={this.handleEditButton} aria-label="Edit" 
                                    className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-button-icon at-core-button at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                                        <span className="at-button-icon__icon">
                                            <div style={{width: "2rem", height: "2rem"}}>
                                                <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                                    <div className="at-aspect at-aspect--align-top">
                                                        <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                                        <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fillRule="evenodd" d="M17.303 4.303l-1.606-1.606a2.4 2.4 0 00-3.394 0L2 13v5h5L17.303 7.697a2.4 2.4 0 000-3.394zM4 16v-2.171l7.207-7.208 2.172 2.172L6.172 16H4zm10.793-8.621l1.096-1.096a.4.4 0 000-.566l-1.606-1.606a.4.4 0 00-.566 0l-1.096 1.096 2.172 2.172z" clipRule="evenodd"></path></g></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                    </button>
                                </div>
                            </div>
                    </div>
                </div>

                <div className="at-mg-y-05" style={{display: !this.state.doneWithEmail || this.state.doneWithUsername ? 'none' : 'block'}}>
                    <div className="at-inline-flex at-mg-b-05">
                        <label className="at-form-label" htmlFor="username-label">Enter your username</label>
                    </div>
                    <div className="at-relative">
                        <input ref={ref => this.usernameInput=ref} value={this.state.username} onChange={this.handleUsernameInput} onKeyPress={this.UsernameKeyPressed} aria-label="Enter your username" 
                        className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05"
                        autoCapitalize='off' autoCorrect='off' id='username-label'></input>
                    </div>
                </div>

                <div className="at-mg-t-2" style={{display: !this.state.doneWithEmail || this.state.doneWithUsername ? 'none' : 'block'}}>
                    <div className="at-align-center at-mg-b-1">
                        <ReCAPTCHA
                            ref={ref => this.recaptcha=ref}
                            style={{display: "inline-block"}}
                            sitekey="6Lf6TVgUAAAAAFfSioc-cykEjZnF7_ol0eXp2wKG"
                            onChange={this.handleRecaptcha}
                            theme="dark"
                        />
                    </div>
                </div>

                <div className="at-responsive-wrapper" style={{display: !this.state.doneWithEmail || this.state.doneWithUsername ? 'none' : 'block'}}>
                    <div className="at-inline-flex at-mg-r-1 at-mg-y-1">
                        <button onClick={this.sendPasswordReset} disabled={this.state.validUsername && this.state.captcha !== null ? null : 'disabled'} 
                        className={this.state.validUsername && this.state.captcha !== null ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative" 
                        : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}>
                            <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                                <div className="at-core-button-label-text">Reset my Password</div>
                            </div>
                        </button>
                    </div>
                    <button onClick={this.sendUsernameEmail} disabled={this.state.captcha !== null ? null : 'disabled'}
                    className={this.state.captcha !== null ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}>
                        <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                            <div className="at-core-button-label-text">What's my Username?</div>
                        </div>
                    </button>
                </div>

                <div className="at-mg-b-2 at-mg-t-1" style={{display: this.state.doneWithEmail && this.state.doneWithUsername ? 'block' : 'none'}}>
                    <p className="at-font-size-4">Please go to your <span className="at-strong">{this.state.email}</span> email to retrieve your {this.state.message}</p>
                    <div className="at-mg-y-2">
                        <p className="at-font-size-4">It could take a few minutes to appear, and be sure to check the spam folder!</p>
                    </div>
                </div>

                <div className="at-mg-y-2" style={{display: this.state.doneWithEmail && this.state.doneWithUsername ? 'flex' : 'none'}}>
                    <div className="at-mg-r-1">
                        <a href="/" className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                            <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                                <div className="at-flex-grow-0">Done</div>
                            </div>
                        </a>
                    </div>

                    <button onClick={this.handleRestart}
                    className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                        <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                            <div className="at-core-button-label-text">Start Over</div>
                        </div>
                    </button>
                </div>
            </div>
          </div>
      </div>
    )
  }
}
  
export default Recovery;