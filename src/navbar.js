import React, { Component,  } from 'react';
import logo from './assets/logo.png';
import patreonLogo from './assets/patreonlogo.png'
import discordLogo from './assets/discordlogo.png'
import { ReactComponent as Links } from './assets/links.svg';
import { ReactComponent as XMark } from './assets/x-mark.svg';
import { ReactComponent as ShowPasswordSVG } from './assets/showpassword.svg';
import { ReactComponent as HidePasswordSVG } from './assets/hidepassword.svg';
import { ReactComponent as RegError } from './assets/reg-error.svg';
import { ReactComponent as RegSuccess } from './assets/reg-success.svg';
import { NavLink, withRouter } from 'react-router-dom'
import Modal from 'react-modal';
import ReactPasswordStrength from 'react-password-strength';
import ReCAPTCHA from "react-google-recaptcha";
import client from './feathers';
import RESERVED_USERNAMES from './reserved_usernames.json';
import 'simplebar';

const NavItem = withRouter(props => {
    const { to, children, location } = props;
    return (
        <div className="at-flex at-flex-column at-full-height at-pd-x-1 at-xl-pd-x-2">
            <div className="at-align-self-center at-flex at-full-height">
                <NavLink className="navigation-link at-interactive" activeClassName="active" exact to={to}>{children}</NavLink>
            </div>
            <div className="navigation-link__indicator-container">
                <div className="navigation-link__active-indicator" style={{visibility: location.pathname === to ? "visible" : "hidden"}}></div>
            </div>
        </div>
    );
});

//KEYUPPRESS FOR ENTER TO SUBMIT.

Modal.setAppElement('#root')

const initialState = {
    showMenuLinks: false,
    showModal: false,
    loginModal: false,
    registerModal: false,
    showPassword: false,
    username: '',
    password: '',
    regUsername: '',
    regPassword: '',
    regEmail: '',
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
    errorRegUsernameMsg: '',
    showRegUsernameError: false,
    showRegUsernameSuccess: false,
    errorRegEmailMsg: '',
    successRegEmailMsg: '',
    isPasswordValid: false,
    captcha: null,
    showEmailVerification: false,
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
    passLength: 0
};

//TODO: EMAIL VALIDATION BECAUSE WE HAVE UNIQUE EMAIL ADDRESSES.
class NavBar extends Component {
    constructor(props) {
      super(props);
  
      this.timeout = 0;
      this.user = this.props.user;
      this.state = initialState;
      this.codeInput1 = {};
      this.codeInput2 = {};
      this.codeInput3 = {};
      this.codeInput4 = {};
      this.codeInput5 = {};
      this.codeInput6 = {};
      this.recaptcha = {};
      this.DISABLED_USERNAMES = ['recovery', 'help', 'register', 'signup', 'login', 'angelthump', 'god', 'dashboard', 'admin', 'settings', 'password', 'reset', 'embed', 'popout', 'email', 'username'];
    }
  
    componentDidMount = () => {
        if(this.user === undefined) {
            this.setState({ anon: true })
        } else if(this.user) {
            this.setState({ anon: false})
        }
    }

    menuLinkButton = () => {
        if (!this.state.showMenuLinks) {
            document.addEventListener('click', this.handleMenuOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleMenuOutsideClick, false);
        }

		this.setState({showMenuLinks: !this.state.showMenuLinks});
    }

    handleMenuOutsideClick = (e) => {
        this.menuLinkButton();
    }

    showLoginModal = () => {
        this.setState({showModal: true, loginModal: true, registerModal: false});
    }

    showRegisterModal = () => {
        this.setState({showModal: true, registerModal: true, loginModal: false});
    }

    showPassword = (evt) => {
        evt.preventDefault();
        this.setState({showPassword: !this.state.showPassword});
    }

    showRegPassword = (evt) => {
        evt.preventDefault();
        this.setState({showRegPassword: !this.state.showRegPassword});
    }

    showRegConfirmPassword = (evt) => {
        evt.preventDefault();
        this.setState({showRegConfirmPassword: !this.state.showRegConfirmPassword});
    }

    closeModal = () => {
        this.setState(initialState);
    }

    handleUsernameChange = (evt) => {
        this.setState({ username: evt.target.value });
    }
      
    handlePasswordChange = (evt) => {
        this.setState({ password: evt.target.value });
    }

    handleRegUsernameFocus = (evt) => {
        if(!this.state.showRegUsernameError) {
            this.setState({ showRegistrationUsernameText: true })
        }
    }

    handleRegUsernameBlur = (evt) => {
        this.setState({ showRegistrationUsernameText: false })
    }

    handleRegUsernameChange = (evt) => {
        this.setState({ regUsername: evt.target.value.toLowerCase(), showRegUsernameSpinner: true, showRegUsernameSuccess: false, showRegUsernameError: false});

        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
            if(this.state.regUsername.length > 3 && this.state.regUsername.length < 26) {
                const regex = /^\w+$/;
                if(!regex.test(this.state.regUsername)) {
                    return this.setState({showRegUsernameError: true, showRegUsernameSuccess: false, showRegUsernameSpinner: false, showRegistrationUsernameText: false, errorRegUsernameMsg: "Only Alphanumeric Characters! 'A-Z','0-9' and '_'"})
                }
                if(RESERVED_USERNAMES.includes(this.state.regUsername) || this.DISABLED_USERNAMES.includes(this.state.regUsername)) {
                    return this.setState({showRegUsernameError: true, showRegUsernameSuccess: false, showRegUsernameSpinner: false, showRegistrationUsernameText: false, errorRegUsernameMsg: "Username is taken!"})
                }
                await fetch('https://sso.angelthump.com:8080/v1/validation/username',{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: this.state.regUsername
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if(typeof data.available === 'undefined') {
                        return this.setState({showRegUsernameError: true, showRegUsernameSuccess: false, showRegUsernameSpinner: false, showRegistrationUsernameText: false, errorRegUsernameMsg: "Username validation broken. Contact Discord"})
                    }
                    if(data.available) {
                        this.setState({showRegistrationUsernameText: true, showRegUsernameSpinner: false, showRegUsernameSuccess: true})
                    } else {
                        this.setState({showRegUsernameError: true, showRegUsernameSuccess: false, showRegUsernameSpinner: false, showRegistrationUsernameText: false, errorRegUsernameMsg: "Username is taken!"})
                    }
                }).catch(e => {
                    console.error(e);
                    this.setState({showRegUsernameError: true, showRegUsernameSuccess: false, showRegUsernameSpinner: false, showRegistrationUsernameText: false, errorRegUsernameMsg: "Username validation broken. Contact Discord"})
                })
            } else {
                this.setState({showRegUsernameError: true, showRegUsernameSuccess: false, showRegUsernameSpinner: false, showRegistrationUsernameText: false, errorRegUsernameMsg: "Username must be between 4 and 25 characters"})
            }
        }, 500);
    }

    handleRegPassword = (state) => {
        this.setState({ regPassword: state.password, passLength: state.password.length, isPasswordValid: state.isValid })
    }

    handleRegConfirmPassword = (evt) => {
        this.setState({ showRegConfirmPasswordSuccess: false, showRegConfirmPasswordError: false})
        if(evt.target.value.length > 0) {
            if(evt.target.value === this.state.regPassword) {
                this.setState({ showRegConfirmPasswordSuccess: true, showRegConfirmPasswordError: false })
            } else {
                this.setState({ showRegConfirmPasswordSuccess: false, showRegConfirmPasswordError: true, errorRegConfirmPasswordMsg: "Passwords do not match" })
            }
        }
    }

    handleEmail = (evt) => {
        this.setState({ regEmail: evt.target.value.toLowerCase(), showRegEmailSpinner: true, showRegEmailSuccess: false, showRegEmailError: false});

        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
            const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (regex.test(this.state.regEmail)) {
                await fetch('https://sso.angelthump.com:8080/v1/validation/email',{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: this.state.regEmail
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if(typeof data.available === 'undefined') {
                        return this.setState({showRegEmailError: true, showRegEmailSuccess: false, showRegEmailSpinner: false, errorRegEmailMsg: "Email validation broken. Contact Discord"})
                    }
                    if(data.available) {
                        this.setState({showRegEmailError: false, showRegEmailSuccess: true, showRegEmailSpinner: false, successRegEmailMsg: "You will need to verify your email to broadcast!"})
                    } else {
                        this.setState({showRegEmailError: true, showRegEmailSuccess: false, showRegEmailSpinner: false, errorRegEmailMsg: "Email is taken!"})
                    }
                }).catch(e => {
                    this.setState({showRegEmailError: true, showRegEmailSuccess: false, showRegEmailSpinner: false, errorRegEmailMsg: "Email validation broken. Contact Discord"})
                    console.error(e);
                })
            } else {
                this.setState({showRegEmailError: true, showRegEmailSuccess: false, showRegEmailSpinner: false, errorRegEmailMsg: "This is not a valid email"})
            }
        }, 500);
    }

    handleLogin = (evt) => {
        evt.preventDefault();
        const { username, password } = this.state;
        return client.authenticate({
            strategy: 'local',
            username, password
        }).then(user => {
            this.user = user;
            this.setState({anon: false})
            window.location.reload();
        }).catch(error => console.error(error));
    }

    handleRegister = (evt) => {
        evt.preventDefault();
        const { regUsername, regPassword, regEmail, captcha } = this.state;

        fetch('https://sso.angelthump.com:8080/v1/signup',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: regUsername,
                password: regPassword,
                email: regEmail,
                "g-recaptcha-response": captcha
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                this.recaptcha.reset();
                return console.error(data.errorMsg);
            }
            return client.authenticate({
                strategy: 'local',
                username: regUsername,
                password: regPassword
            }).then(user => {
                this.user = user;
                this.setState({showEmailVerification: true});
                this.codeInput1.focus();
            }).catch(error => console.error(error));
        }).catch(e => {
            this.recaptcha.reset();
            console.error(e);
        })
    }

    handleRecaptcha = (value) => {
        this.setState({captcha: value})
    }

    handleResendCode = (evt) => {
        evt.preventDefault();
        const authManagement = client.service('authManagement');
        authManagement.create({ action: 'resendVerifySignup',
            value: {email: this.state.regEmail},
        }).then(() => {
            this.setState({showEmailSent: true})
        }).catch(error => {
            console.error(error)
        });
    }

    handleVerifyClick = (evt) => {
        if(evt) {
            evt.preventDefault();
        }
        const authManagement = client.service('authManagement');
        authManagement.create({
            action: 'verifySignupShort', 
            value: {
                user: {
                    email: this.state.regEmail
                },
                token: this.state.verifyCode
            }
        }).then(x => {
            window.location.reload();
        }).catch(error => {
            console.error(error);
            this.setState({showVerifyError: true})
        });
    }

    handleVerifyCode1 = (evt) => {

        this.setState({verifyCode1: evt.target.value}
        , () => {
            this.setState({
                verifyCode: this.state.verifyCode1 + this.state.verifyCode2 + this.state.verifyCode3 + this.state.verifyCode4 + this.state.verifyCode5 + this.state.verifyCode6
            }, () => {
                if(this.state.verifyCode.length === 6) {
                    this.handleVerifyClick()
                }
            })
        })

        if(evt.target.value !== "") {
            this.codeInput2.focus();
        }
    }

    handleVerifyCode2 = (evt) => {

        this.setState({verifyCode2: evt.target.value}, () => {
            this.setState({
                verifyCode: this.state.verifyCode1 + this.state.verifyCode2 + this.state.verifyCode3 + this.state.verifyCode4 + this.state.verifyCode5 + this.state.verifyCode6
            }, () => {
                if(this.state.verifyCode.length === 6) {
                    this.handleVerifyClick()
                }
            })
        })

        if(evt.target.value !== "") {
            this.codeInput3.focus();
        }
    }

    handleVerifyCode3 = (evt) => {

        this.setState({verifyCode3: evt.target.value}, () => {
            this.setState({
                verifyCode: this.state.verifyCode1 + this.state.verifyCode2 + this.state.verifyCode3 + this.state.verifyCode4 + this.state.verifyCode5 + this.state.verifyCode6
            }, () => {
                if(this.state.verifyCode.length === 6) {
                    this.handleVerifyClick()
                }
            })
        })

        if(evt.target.value !== "") {
            this.codeInput4.focus();
        }
    }

    handleVerifyCode4 = (evt) => {

        this.setState({verifyCode4: evt.target.value}, () => {
            this.setState({
                verifyCode: this.state.verifyCode1 + this.state.verifyCode2 + this.state.verifyCode3 + this.state.verifyCode4 + this.state.verifyCode5 + this.state.verifyCode6
            }, () => {
                if(this.state.verifyCode.length === 6) {
                    this.handleVerifyClick()
                }
            })
        })

        if(evt.target.value !== "") {
            this.codeInput5.focus();
        }
    }

    handleVerifyCode5 = (evt) => {

        this.setState({verifyCode5: evt.target.value}, () => {
            this.setState({
                verifyCode: this.state.verifyCode1 + this.state.verifyCode2 + this.state.verifyCode3 + this.state.verifyCode4 + this.state.verifyCode5 + this.state.verifyCode6
            }, () => {
                if(this.state.verifyCode.length === 6) {
                    this.handleVerifyClick()
                }
            })
        })

        if(evt.target.value !== "") {
            this.codeInput6.focus();
        }
    }

    handleVerifyCode6 = (evt) => {

        this.setState({verifyCode6: evt.target.value}, () => {
            this.setState({
                verifyCode: this.state.verifyCode1 + this.state.verifyCode2 + this.state.verifyCode3 + this.state.verifyCode4 + this.state.verifyCode5 + this.state.verifyCode6
            }, () => {
                if(this.state.verifyCode.length === 6) {
                    this.handleVerifyClick()
                }
            })
        })
    }

    handleVerifyCodeKeyUp = (index,evt) => {
        if (evt.key === "Backspace") {
            if(index === 1) {
                this.codeInput1.focus();
            } else if(index === 2) {
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
        const codeArray = evt.clipboardData.getData('Text').split('');

        this.setState({verifyCode1: codeArray[0], verifyCode2: codeArray[1], verifyCode3: codeArray[2], verifyCode4: codeArray[3], verifyCode5: codeArray[4], verifyCode6: codeArray[5]}, () => {
            this.setState({
                verifyCode: this.state.verifyCode1 + this.state.verifyCode2 + this.state.verifyCode3 + this.state.verifyCode4 + this.state.verifyCode5 + this.state.verifyCode6
            }, () => {
                if(this.state.verifyCode.length === 6) {
                    this.handleVerifyClick()
                }
            })
        })
    };

    dashboard = () => {
        window.location.href = "/dashboard";
    }

    logout = () => {
        this.setState({anon: true})
        client.logout().then(() => window.location.reload());
    }
  
    render() {
        if(this.state.anon === undefined) {
            return null;
        }
        return (
          <nav className="top-nav" data-a-target="top-nav-container" style={{height: '3.125rem'}}>
            <div className="top-nav__menu at-align-items-stretch at-c-background-base at-elevation-1 at-flex at-flex-nowrap at-full-height">
                <div className="at-align-items-stretch at-flex at-flex-grow-1 at-flex-nowrap at-flex-shrink-1 at-full-width at-justify-content-start">
                    
                    <div>
                        <div className="at-flex at-flex-row at-full-height at-justify-content-between">
                            <NavItem to="/">
                                <div className="at-flex-column at-sm-flex">
                                    <div className="at-xl-flex">
                                        <p className="at-font-size-4">Browse</p>
                                    </div>
                                    <div className="at-flex at-xl-hide">
                                        <p className="at-font-size-5">Browse</p>
                                    </div>
                                </div>
                            </NavItem>
                            <NavItem to="/following">
                                <div className="at-flex-column at-sm-flex">
                                    <div className="at-xl-flex">
                                        <p className="at-font-size-4">Following</p>
                                    </div>
                                    <div className="at-flex at-xl-hide">
                                        <p className="at-font-size-5">Following</p>
                                    </div>
                                </div>
                            </NavItem>
                        </div>
                    </div>

                    <div className="at-align-items-center at-flex at-full-height at-pd-x-1">
                        <div className="at-relative">
                            <div style={{display: 'inherit'}}>
                                <div className="at-inline-flex at-relative at-tooltip-wrapper">
                                    <button onClick={this.menuLinkButton} className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-button-icon at-core-button at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative" aria-label="Links">
                                        <span className="at-button-icon__icon">
                                            <div style={{width: '2rem', height: '2rem'}}>
                                                <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                                    <div className="at-aspect at-aspect--align-top">
                                                        <div className="at-aspect__spacer" style={{paddingBottom: '100%'}}></div>
                                                        <Links/>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                    </button>
                                    <div className="at-tooltip at-tooltip--align-center at-tooltip--down" role="tooltip">Links</div>
                                </div>
                                <div>
                                    <div className={this.state.showMenuLinks ? 'at-absolute at-balloon at-balloon--down at-balloon--sm at-block' : 'at-absolute at-balloon at-balloon--down at-balloon--sm at-hide'} role="dialog" id="LinkMenu">
                                        <div className="at-c-background-base at-flex-column">
                                            <div className="top-nav__overflow-menu scrollable-area" data-simplebar>
                                                <div className="at-pd-1">
                                                    <div>
                                                        <div className="at-mg-y-05 at-pd-x-05">
                                                            <p className="at-c-text-alt-2 at-font-size-6 at-strong at-upcase">Pages</p>
                                                        </div>
                                                    </div>

                                                    <div className="at-full-width at-relative">
                                                        <a href="/help" rel="noopener noreferrer" target="_blank" className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive">
                                                            <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                                                <div className="at-flex-grow-1">Help</div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className="at-full-width at-relative">
                                                        <a href="https://status.angelthump.com/" rel="noopener noreferrer" target="_blank" className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive">
                                                            <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                                                <div className="at-flex-grow-1">Status</div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className="at-full-width at-relative">
                                                        <a href="https://patreon.com/join/angelthump" rel="noopener noreferrer" target="_blank" className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive">
                                                            <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                                                <div className="at-flex-grow-1">Patreon</div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className="at-full-width at-relative">
                                                        <a href="https://discord.gg/QGrZXNh" rel="noopener noreferrer" target="_blank" className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive">
                                                            <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                                                <div className="at-flex-grow-1">Discord</div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className="at-full-width at-relative">
                                                        <a href="https://m.do.co/c/9992c85854c2" rel="noopener noreferrer" target="_blank" className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive">
                                                            <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                                                <div className="at-flex-grow-1">Digitalocean Get $100</div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className="at-full-width at-relative">
                                                        <a href="https://github.com/angelthump" rel="noopener noreferrer" target="_blank" className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive">
                                                            <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                                                <div className="at-flex-grow-1">Github</div>
                                                            </div>
                                                        </a>
                                                    </div>

                                                    <div className="at-border-t at-mg-t-1 at-mg-x-05 at-pd-b-1"></div>

                                                    <div>
                                                        <div className="at-mg-y-05 at-pd-x-05">
                                                            <p className="at-c-text-alt-2 at-font-size-6 at-strong at-upcase">Legal</p>
                                                        </div>
                                                    </div>

                                                    <div className="at-full-width at-relative">
                                                        <a href="/p/tos" rel="noopener noreferrer" target="_blank" className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive">
                                                            <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                                                <div className="at-flex-grow-1">Terms of Service</div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className="at-full-width at-relative">
                                                        <a href="/p/privacy" rel="noopener noreferrer" target="_blank" className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive">
                                                            <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                                                <div className="at-flex-grow-1">Privacy Policy</div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className="at-full-width at-relative">
                                                        <a href="/p/dmca" rel="noopener noreferrer" target="_blank" className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive">
                                                            <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                                                <div className="at-flex-grow-1">DMCA</div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="at-align-items-center at-flex-grow-1 at-flex-shrink-1 at-full-width at-justify-content-center at-sm-flex">
                    <a className="a-link a-link--button" data-a-target="home-link" aria-label="AngelThump Home" href="/">
                        <div className="top-nav__home-link-logo">
                            <div className="at-logo">
                                <figure className="at-inline-flex">
                                    <img className="at-logo__img" width="130px" height="47px" src={logo} alt=""></img>
                                </figure>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="at-align-items-center at-flex at-flex-grow-1 at-flex-shrink-1 at-full-width at-justify-content-end">

                    <div className="at-link-pad"> 
                        <a className="a-link a-link--button" href="https://discord.gg/QGrZXNh" rel="noopener noreferrer" target="_blank">
                            <img className="at-logo__img" height="50px" alt="" src={discordLogo}></img>
                        </a>
                    </div>

                    <div className="at-link-pad">
                        <a className="a-link a-link--button" target="_blank" rel="noopener noreferrer" href="https://patreon.com/join/angelthump">
                            <img className="at-logo__img" height="50px" src={patreonLogo} alt=""></img>
                        </a>
                    </div>

                    <div className="at-flex at-full-height at-mg-r-1 at-pd-y-1">
                        <div className="at-flex at-flex-nowrap">
                            <div className={!this.state.anon ? "at-flex at-flex-nowrap" : "at-flex at-flex-nowrap at-hide"}>
                                <div className="at-pd-x-05">
                                    <button onClick={this.dashboard} className= "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                                        <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                                            <div className="at-flex-grow-0">Dashboard</div>
                                        </div>
                                    </button>
                                </div>
                                <div className="at-pd-x-05">
                                    <button onClick={this.logout} className= "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                                        <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                                            <div className="at-flex-grow-0">Log Out</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div className={this.state.anon ? "anon-user at-flex at-flex-nowrap" : "anon-user at-flex at-flex-nowrap at-hide"}>
                                <div className="at-pd-x-05">
                                    <button onClick={this.showLoginModal} className= "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                                        <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                                            <div className="at-flex-grow-0">Log In</div>
                                        </div>
                                    </button>
                                </div>
                                <div className="at-pd-x-05">
                                    <button onClick={this.showRegisterModal} className= "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                                        <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                                            <div className="at-flex-grow-0">Register</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={this.state.showModal} onRequestClose={this.closeModal} overlayClassName={"modal__backdrop js-modal-backdrop"} className="modal__content">

                    <div className="modal-wrapper__backdrop modal-wrapper__backdrop--info at-align-items-start at-flex at-full-height at-full-width at-justify-content-center">
                        <div className="modal-wrapper__content modal-wrapper__content--info at-flex at-flex-grow-0 at-full-width at-justify-content-center at-relative">
                            <div className="auth-modal at-relative">
                                <div className="at-border-radius-medium at-flex at-overflow-hidden">
                                    <div className="auth-modal__left-content at-overflow-auto">
                                        <div className="at-c-background-base at-flex-column at-pd-x-2 at-pd-y-3" style={{display: this.state.showEmailVerification ? "flex" : "none"}}>
                                            <div className="at-mg-b-1">
                                                <div className="at-border-radius-medium at-overflow-hidden">
                                                    <div className="at-align-items-center at-flex at-modal-header at-modal-header--md at-pd-05 at-relative">
                                                        <div className="at-flex-grow-1 at-modal-header__title at-modal-header__title--md at-visible">
                                                            <h2 className="at-font-size-3" id="modal-root-header">Verify your Email Address</h2>
                                                        </div>
                                                    </div>

                                                    <div className="at-pd-x-4 at-pd-y-1">
                                                        <p className="at-font-size-4 at-strong">Enter your verification code</p>
                                                        <div className="at-mg-b-2 at-mg-t-1">
                                                            <p className="at-c-text-alt at-font-size-5">
                                                                We sent a 6-digit code to&nbsp;
                                                                <span className="at-strong">{this.state.regEmail}</span>
                                                                . By Confirming your email, you will be able to keep your account secure and use all of the sites funcationality.
                                                            </p>
                                                        </div>

                                                        <div className="at-mg-b-2" style={{display: this.state.showVerifyError ? "block" : "none"}}>
                                                            <div className="at-border-radius-medium at-c-text-base at-in-feature-notification at-in-feature-notification--error at-relative">
                                                                <div className="at-border-radius-medium at-c-background-base">
                                                                    <div className="at-flex">
                                                                        <div className="at-flex at-full-width">
                                                                            <div className="at-in-feature-notification__avatar at-in-feature-notification__avatar--adjusted at-pd-1">
                                                                                <div className="at-align-items-center at-flex at-notification-figure at-notification-figure--error">
                                                                                    <div className="at-align-items-center at-icon at-inline-flex">
                                                                                        <div className="at-aspect at-aspect--align-top">
                                                                                            <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                                                                            <RegError></RegError>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="at-align-items-center at-flex at-full-width">
                                                                                <div className="at-full-width at-pd-r-1 at-pd-y-1">
                                                                                    <div className="at-flex at-flex-column">
                                                                                        <div className="at-mg-r-0">
                                                                                            <p className="at-font-size-5 at-semibold">Verification Failed</p>
                                                                                        </div>
                                                                                        <div className="at-mg-b-05 at-mg-r-0">
                                                                                            <p className="at-c-text-alt">Verification failed because provided code does not match.</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="at-inline-flex" aria-label="Verification code input">
                                                            <div className="at-pd-r-1">
                                                                <div className="at-relative">
                                                                    <input ref={ref => this.codeInput1=ref} value={this.state.verifyCode1} style={{textAlign: "center"}} onPaste={this.handlePasteCode} onFocus={this.handleFocus} maxLength="1" onChange={this.handleVerifyCode1} onKeyUp={(e) => this.handleVerifyCodeKeyUp(0, e)} type="text" autoCapitalize="off" autoCorrect="off"
                                                                    className={this.state.showVerifyError ?  "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                                                    : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"}
                                                                    ></input>
                                                                </div>
                                                            </div>
                                                            <div className="at-pd-r-1">
                                                                <div className="at-relative">
                                                                    <input ref={ref => this.codeInput2=ref} value={this.state.verifyCode2} style={{textAlign: "center"}} onFocus={this.handleFocus} maxLength="1" onChange={this.handleVerifyCode2} onKeyUp={(e) => this.handleVerifyCodeKeyUp(1, e)} type="text" autoCapitalize="off" autoCorrect="off"
                                                                    className={this.state.showVerifyError ?  "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                                                    : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"}
                                                                    ></input>
                                                                </div>
                                                            </div>
                                                            <div className="at-pd-r-1">
                                                                <div className="at-relative">
                                                                    <input ref={ref => this.codeInput3=ref} value={this.state.verifyCode3} style={{textAlign: "center"}} onFocus={this.handleFocus} maxLength="1" onChange={this.handleVerifyCode3} onKeyUp={(e) => this.handleVerifyCodeKeyUp(2, e)} type="text" autoCapitalize="off" autoCorrect="off"
                                                                    className={this.state.showVerifyError ?  "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                                                    : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"}
                                                                    ></input>
                                                                </div>
                                                            </div>
                                                            <div className="at-pd-r-1">
                                                                <div className="at-relative">
                                                                    <input ref={ref => this.codeInput4=ref} value={this.state.verifyCode4} style={{textAlign: "center"}} onFocus={this.handleFocus} maxLength="1" onChange={this.handleVerifyCode4} onKeyUp={(e) => this.handleVerifyCodeKeyUp(3, e)} type="text" autoCapitalize="off" autoCorrect="off"
                                                                    className={this.state.showVerifyError ?  "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                                                    : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"}
                                                                    ></input>
                                                                </div>
                                                            </div>
                                                            <div className="at-pd-r-1">
                                                                <div className="at-relative">
                                                                    <input ref={ref => this.codeInput5=ref} value={this.state.verifyCode5} style={{textAlign: "center"}} onFocus={this.handleFocus} maxLength="1" onChange={this.handleVerifyCode5} onKeyUp={(e) => this.handleVerifyCodeKeyUp(4, e)} type="text" autoCapitalize="off" autoCorrect="off"
                                                                    className={this.state.showVerifyError ?  "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                                                    : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"}
                                                                    ></input>
                                                                </div>
                                                            </div>
                                                            <div className="at-pd-r-0">
                                                                <div className="at-relative">
                                                                    <input ref={ref => this.codeInput6=ref} value={this.state.verifyCode6} style={{textAlign: "center"}} onFocus={this.handleFocus} maxLength="1" onChange={this.handleVerifyCode6} onKeyUp={(e) => this.handleVerifyCodeKeyUp(5, e)} autoCapitalize="off" autoCorrect="off"
                                                                    className={this.state.showVerifyError ?  "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--error at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                                                    : "at-align-center at-block at-border-bottom-left-radius-large at-border-bottom-right-radius-large at-border-top-left-radius-large at-border-top-right-radius-large at-font-size-5 at-full-width at-input at-input--large at-pd-l-1 at-pd-r-1 at-pd-y-05"}
                                                                    ></input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="at-mg-b-2 at-mg-t-1">
                                                            <button disabled={!this.state.showEmailSent ? null : 'disabled'} onClick={this.handleResendCode} 
                                                                className={this.state.showEmailSent ? "at-interactive at-link at-link--button at-link--button--disabled" : "at-interactive at-link at-link--button"}>
                                                                {this.state.showEmailSent ? "Email Sent!" : "Resend Code"}</button>
                                                            <div className="at-mg-t-1">
                                                                <p>
                                                                    Update email?&nbsp;
                                                                    <a className="at-interactive at-link at-link--button" href="/settings">Settings</a>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="at-c-text-alt-2 at-font-size-6">You may also use the link in the email we sent you to verify your email.</p>
                                                        <div className="at-align-items-center at-flex at-flex-row-reverse at-justify-content-start at-pd-x-3 at-pd-y-2">
                                                            <div>
                                                                <button onClick={this.handleVerifyClick} disabled={ this.state.showVerifySubmit ? null : 'disabled'}
                                                                className={this.state.showVerifySubmit ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                                                                : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}>
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

                                        <div className="at-c-background-base at-flex-column at-pd-x-2 at-pd-y-3" style={{display: !this.state.showEmailVerification ? "flex" : "none"}}>
                                            <div>
                                                <div className="at-flex at-flex-column">
                                                    <div className="at-align-items-center at-inline-flex at-justify-content-center">
                                                        <figure className="at-svg">
                                                            <img className="at-logo__img" width="110px" height="40px" src={logo} alt=""></img>
                                                        </figure>
                                                        <div className="at-mg-l-05">
                                                            <h4 className="at-font-size-4 at-strong" style={{display: this.state.loginModal ? "block" : "none"}}>Log in to AngelThump</h4>
                                                            <h4 className="at-font-size-4 at-strong" style={{display: this.state.registerModal ? "block" : "none"}}>Join AngelThump</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="at-mg-t-1">
                                                <div className="at-font-size-5">
                                                    <div className="at-border-b at-flex at-full-width at-relative at-tabs">
                                                        <ul role="tablist" className="at-align-items-center at-flex at-flex-grow-1 at-flex-wrap at-font-size-4 at-full-height at-justify-content-start">
                                                            <li className={this.state.loginModal ? "at-align-items-center at-c-text-link at-flex-grow-0 at-full-height at-justify-content-center at-tabs__tab" : "at-align-items-center at-c-text-base at-flex-grow-0 at-full-height at-justify-content-center at-tabs__tab"} role="presentation">
                                                                <button onClick={this.showLoginModal} role="tab" className="at-block at-c-text-inherit at-full-height at-full-width at-interactive at-pd-r-2 at-tab-item">
                                                                    <div className="at-align-left at-flex at-flex-column at-full-height">
                                                                        <div className="at-flex-grow-0">
                                                                            <div className="at-font-size-5 at-regular">Log In</div>
                                                                        </div>
                                                                        <div className="at-flex-grow-1"></div>
                                                                        <div className="at-flex-grow-0">
                                                                            <div className="at-tabs__active-indicator" style={{visibility: this.state.loginModal ? "visible" : "hidden"}}></div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </li>

                                                            <li className={this.state.registerModal ? "at-align-items-center at-c-text-link at-flex-grow-0 at-full-height at-justify-content-center at-tabs__tab" : "at-align-items-center at-c-text-base at-flex-grow-0 at-full-height at-justify-content-center at-tabs__tab"} role="presentation">
                                                                <button onClick={this.showRegisterModal} role="tab" className="at-block at-c-text-inherit at-full-height at-full-width at-interactive at-pd-r-2 at-tab-item">
                                                                    <div className="at-align-left at-flex at-flex-column at-full-height">
                                                                        <div className="at-flex-grow-0">
                                                                            <div className="at-font-size-5 at-regular">Register</div>
                                                                        </div>
                                                                        <div className="at-flex-grow-1"></div>
                                                                        <div className="at-flex-grow-0">
                                                                            <div className="at-tabs__active-indicator" style={{visibility: this.state.registerModal ? "visible" : "hidden"}}></div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="at-mg-b-1" style={{display: this.state.loginModal ? "block" : "none"}}>
                                                <form noValidate>
                                                    <div className="at-c-background-base at-flex at-flex-column at-full-width">
                                                        <div className="at-mg-t-2">
                                                            <div>
                                                                <div className="at-align-items-center at-flex at-mg-b-05">
                                                                    <div className="at-flex-grow-1">
                                                                        <label className="at-form-label" htmlFor="login-username">Username</label>
                                                                    </div>
                                                                </div>
                                                                <div className="at-relative">
                                                                    <input autoFocus={true} onChange={this.handleUsernameChange} aria-label="Enter your username" type="text" className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                                                    autoComplete="off" autoCapitalize="off" autoCorrect="off" id="login-username"></input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="at-mg-t-2">
                                                            <div className="login-password-input">
                                                                <div>
                                                                    <div className="password-input__label at-align-items-center at-flex at-mg-b-05">
                                                                        <div className="at-flex-grow-1">
                                                                            <label className="at-form-label" htmlFor="password-input">Password</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="password-input__container at-relative">
                                                                        <div className="at-relative">
                                                                            <input onChange={this.handlePasswordChange} aria-label="Enter your password" type={this.state.showPassword ? "text" : "password"} className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-input--password at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                                                            autoCapitalize="off" autoCorrect="off" autoComplete="off" id="password-input"></input>
                                                                        </div>
                                                                        <div className="password-input--manager-present at-absolute at-align-items-center at-bottom-0 at-c-text-overlay-alt at-flex at-top-0">
                                                                            <button onClick={this.showPassword} className="at-align-items-center at-align-middle at-border-bottom-left-radius-small at-border-bottom-right-radius-small at-border-top-left-radius-small at-border-top-right-radius-small at-button-icon at-button-icon--secondary at-button-icon--small at-core-button at-core-button--small at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                                                                            tabIndex="-1" aria-label="Show Password">
                                                                                    <span className="at-button-icon__icon">
                                                                                        <div style={{width: "1rem", height: "1.6rem"}}>
                                                                                            <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                                                                                <div className="at-aspect at-aspect--align-top">
                                                                                                    <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                                                                                    {this.state.showPassword ? <HidePasswordSVG/> : <ShowPasswordSVG/>}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="at-mg-t-1">
                                                                    <a href="/user/recovery" className="at-interactive at-link at-link--button">
                                                                        <p className="at-font-size-7">Forgot your password?</p>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="at-mg-t-2">
                                                            <button onClick={this.handleLogin} disabled={this.state.username.length > 0 && this.state.password.length > 0 ? null : 'disabled'}
                                                             className={this.state.username.length > 0 && this.state.password.length > 0 ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative" 
                                                             : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}>
                                                                <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                                                                    <div className="at-flex-grow-0">Log In</div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>

                                            <div className="at-mg-b-1" style={{display: this.state.registerModal ? "block" : "none"}}>
                                                <form noValidate>
                                                    <div className="at-c-background-base at-flex at-flex-column at-full-width">
                                                        <div className="at-mg-t-2">
                                                            <div>
                                                                <div className="at-align-items-center at-flex at-mg-b-05">
                                                                    <div className="at-flex-grow-1">
                                                                        <label className="at-form-label" htmlFor="signup-username">Username</label>
                                                                    </div>
                                                                    <div className="at-loading-spinner" style={{animationDelay: "0ms", display: this.state.showRegUsernameSpinner ? 'block' : 'none'}}>
                                                                        <div className="at-loading-spinner__circle at-loading-spinner__circle--small"></div>
                                                                    </div>
                                                                    <figure className="at-svg" style={{display: this.state.showRegUsernameError ? 'block' : 'none'}}>
                                                                        <RegError></RegError>
                                                                    </figure>
                                                                    <figure className="at-svg" style={{display: this.state.showRegUsernameSuccess ? 'block' : 'none'}}>
                                                                        <RegSuccess></RegSuccess>
                                                                    </figure>
                                                                </div>
                                                                <div className="at-relative">
                                                                    <input autoFocus={true} onFocus={this.handleRegUsernameFocus} onBlur={this.handleRegUsernameBlur} onChange={this.handleRegUsernameChange} aria-label="Enter a username" type="text"
                                                                    className={this.state.showRegUsernameError ? "at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-input--error at-input--password at-pd-l-1 at-pd-r-1 at-pd-y-05" : "at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05"}
                                                                    autoCapitalize="off" autoComplete="off" autoCorrect="off" id="signup-username"
                                                                    ></input>
                                                                </div>
                                                                <div className="form-group-auth__animated-text" style={{height: this.state.showRegistrationUsernameText ? "37px" : "21px"}}>
                                                                    <div className={this.state.showRegistrationUsernameText ? "at-animation at-animation--animate at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease" : "at-animation at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease"}>
                                                                        <div className="at-pd-t-05" style={{display: this.state.showRegistrationUsernameText ? 'block' : 'none'}}>
                                                                            <p className="at-c-text-alt-2 at-font-size-7">
                                                                                This is how people will view your channel
                                                                            </p>
                                                                        </div>
                                                                        <div className="at-pd-t-05" style={{display: this.state.showRegUsernameError ? 'block' : 'none'}}>
                                                                            <p className="at-c-text-error at-font-size-7">{this.state.errorRegUsernameMsg}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="at-mg-t-2">
                                                            <div>
                                                                <div className="at-align-items-center at-flex at-mg-b-05">
                                                                    <div className="at-flex-grow-1">
                                                                        <label className="at-form-label" htmlFor="password-input">Password</label>
                                                                    </div>
                                                                </div>
                                                                <div className="at-relative">
                                                                    <ReactPasswordStrength
                                                                        style={{border: '0'}}
                                                                        minLength={6}
                                                                        minScore={2}
                                                                        scoreWords={['weak', 'fair', 'good', 'strong']}
                                                                        changeCallback={this.handleRegPassword}
                                                                        inputProps={{ "aria-label":"Enter a secure password", type: this.state.showRegPassword ? "text" : "password", id:"signup-password", name: "password_input", autoComplete: "off", autoCapitalize: "off", autoCorrect: "off",
                                                                        className: "at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                                                    }}/>
                                                                    <div className="password-input--manager-present at-absolute at-align-items-center at-bottom-0 at-c-text-overlay-alt at-flex at-top-0">
                                                                        <button onClick={this.showRegPassword} className="at-align-items-center at-align-middle at-border-bottom-left-radius-small at-border-bottom-right-radius-small at-border-top-left-radius-small at-border-top-right-radius-small at-button-icon at-button-icon--secondary at-button-icon--small at-core-button at-core-button--small at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                                                                        tabIndex="-1" aria-label="Show Password">
                                                                                <span className="at-button-icon__icon">
                                                                                    <div style={{width: "1rem", height: "1.6rem"}}>
                                                                                        <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                                                                            <div className="at-aspect at-aspect--align-top">
                                                                                                <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                                                                                {this.state.showRegPassword ? <HidePasswordSVG/> : <ShowPasswordSVG/>}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group-auth__animated-text" style={{height: "21px"}}></div>
                                                        <div className="at-mg-t-2">
                                                            <div>
                                                                <div className="password-input__label at-align-items-center at-flex at-mg-b-05">
                                                                    <div className="at-flex-grow-1">
                                                                        <label className="at-form-label" htmlFor="password-input-confirmation">Confirm Password</label>
                                                                    </div>
                                                                    <figure className="at-svg" style={{display: this.state.showRegConfirmPasswordError ? 'block' : 'none'}}>
                                                                        <RegError></RegError>
                                                                    </figure>
                                                                    <figure className="at-svg" style={{display: this.state.showRegConfirmPasswordSuccess ? 'block' : 'none'}}>
                                                                        <RegSuccess></RegSuccess>
                                                                    </figure>
                                                                </div>

                                                                <div className="password-input__container at-relative">
                                                                    <div className="at-relative">
                                                                        <input onChange={this.handleRegConfirmPassword} aria-label="Confirm your password" type={this.state.showRegConfirmPassword ? "text" : "password"}
                                                                        className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-input--password at-pd-l-1 at-pd-r-1 at-pd-y-05"
                                                                        autoCapitalize="off" autoComplete="current-password" autoCorrect="off" id="password-input-confirmation"></input>
                                                                    </div>
                                                                    <div className="password-input--manager-present at-absolute at-align-items-center at-bottom-0 at-c-text-overlay-alt at-flex at-top-0">
                                                                        <button onClick={this.showRegConfirmPassword} className="at-align-items-center at-align-middle at-border-bottom-left-radius-small at-border-bottom-right-radius-small at-border-top-left-radius-small at-border-top-right-radius-small at-button-icon at-button-icon--secondary at-button-icon--small at-core-button at-core-button--small at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                                                                        tabIndex="-1" aria-label="Show Password">
                                                                                <span className="at-button-icon__icon">
                                                                                    <div style={{width: "1rem", height: "1.6rem"}}>
                                                                                        <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                                                                            <div className="at-aspect at-aspect--align-top">
                                                                                                <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                                                                                {this.state.showRegConfirmPassword ? <HidePasswordSVG/> : <ShowPasswordSVG/>}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                        </button>
                                                                    </div>
                                                                    <div className="form-group-auth__animated-text" style={{height: this.state.showRegConfirmPasswordError ? "21px" : "0px"}}>
                                                                        <div className={this.state.showRegConfirmPasswordError ? "at-animation at-animation--animate at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease" : "at-animation at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease"}>
                                                                            <div className="at-pd-t-05" style={{display: this.state.showRegConfirmPasswordError ? 'block' : 'none'}}>
                                                                                <p className="at-c-text-error at-font-size-7">{this.state.errorRegConfirmPasswordMsg}</p>
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
                                                                        <label className="at-form-label" htmlFor="email-input">Email</label>
                                                                    </div>
                                                                    <div className="at-loading-spinner" style={{animationDelay: "0ms", display: this.state.showRegEmailSpinner ? 'block' : 'none'}}>
                                                                        <div className="at-loading-spinner__circle at-loading-spinner__circle--small"></div>
                                                                    </div>
                                                                    <figure className="at-svg" style={{display: this.state.showRegEmailError ? 'block' : 'none'}}>
                                                                        <RegError></RegError>
                                                                    </figure>
                                                                    <figure className="at-svg" style={{display: this.state.showRegEmailSuccess ? 'block' : 'none'}}>
                                                                        <RegSuccess></RegSuccess>
                                                                    </figure>
                                                                </div>
                                                            </div>

                                                            <div className="at-relative">
                                                                <input onChange={this.handleEmail} onFocus={this.handleRegEmailFocus} onBlur={this.handleRegEmailBlur} aria-label="Enter your email address" type="email"
                                                                className={!this.state.showRegEmailError ? "at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05" : "at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-input--error at-pd-l-1 at-pd-r-1 at-pd-y-05"}
                                                                autoCapitalize="off" autoCorrect="off" id="email-input"></input>
                                                            </div>

                                                            <div className="form-group-auth__animated-text" style={{height: "21px"}}>
                                                                <div className={this.state.showRegEmailSuccess ? "at-animation at-animation--animate at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease" : "at-animation at-animation--delay-short at-animation--duration-long at-animation--fade-in at-animation--fill-mode-both at-animation--timing-ease"}>
                                                                     <div className="at-pd-t-05" style={{display: this.state.showRegEmailSuccess ? 'block' : 'none'}}>
                                                                        <p className="at-c-text-alt-2 at-font-size-7">{this.state.successRegEmailMsg}</p>
                                                                    </div>
                                                                    <div className="at-pd-t-05" style={{display: this.state.showRegEmailError ? 'block' : 'none'}}>
                                                                        <p className="at-c-text-error at-font-size-7">{this.state.errorRegEmailMsg}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="at-mg-t-2">
                                                            <div className="at-align-center at-mg-b-1" style={{textAlign: "center"}}>
                                                                <ReCAPTCHA
                                                                    ref={ref => this.recaptcha=ref}
                                                                    style={{display: "inline-block"}}
                                                                    sitekey="6Lf6TVgUAAAAAFfSioc-cykEjZnF7_ol0eXp2wKG"
                                                                    onChange={this.handleRecaptcha}
                                                                    theme="dark"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="at-mg-t-1">
                                                            <div className="at-align-center at-mg-b-2">
                                                                <p className="at-c-text-alt-2 at-font-size-7" style={{textAlign: "center"}}>
                                                                    By clicking Sign Up, you are indicating that you have read and acknowledge the&nbsp;
                                                                    <a href="/p/tos" rel="noopener noreferrer" target="_blank" className="at-interactive at-link at-link--button">Terms of Service</a>
                                                                    &nbsp;and&nbsp;
                                                                    <a href="/p/privacy" rel="noopener noreferrer" target="_blank" className="at-interactive at-link at-link--button">Privacy Policy</a>
                                                                    .
                                                                </p>
                                                            </div>
                                                            <button onClick={this.handleRegister} disabled={this.state.showRegUsernameSuccess && this.state.isPasswordValid && this.state.showRegConfirmPasswordSuccess && this.state.showRegEmailSuccess && this.state.captcha != null ? null : 'disabled'}
                                                            className={this.state.showRegUsernameSuccess && this.state.isPasswordValid && this.state.showRegConfirmPasswordSuccess && this.state.showRegEmailSuccess && this.state.captcha != null ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative" : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}>
                                                                <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                                                                    <div className="at-flex-grow-0">Register</div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal__close-button">
                                    <button onClick={this.closeModal} className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-button-icon at-button-icon--overlay at-core-button at-core-button--overlay at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                                        <span className="at-button-icon__icon">
                                            <div style={{width: "2rem", height: "2rem"}}>
                                                <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                                    <div className="at-aspect at-aspect--align-top">
                                                        <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                                        <XMark></XMark>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </Modal>


            </div>
          </nav>
      )

      /*
      if(this.state.login === undefined) {
        return <main className="container text-center">
          <h1>Loading...</h1>
        </main>;
      } else if(this.state.login) {
        return <Chat messages={this.state.messages} users={this.state.users} />
      }
  
      return <Login />;*/
    }
  }
  
  export default NavBar;