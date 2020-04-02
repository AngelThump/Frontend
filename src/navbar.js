import React, { Component, lazy, Suspense } from "react";
import logo from "./assets/logo.png";
import patreonLogo from "./assets/patreonlogo.png";
import discordLogo from "./assets/discordlogo.png";
import { ReactComponent as Links } from "./assets/links.svg";
import { ReactComponent as XMark } from "./assets/x-mark.svg";
import { NavLink, withRouter } from "react-router-dom";
import Modal from "react-modal";
import client from "./feathers";
import "simplebar";
const Auth = lazy(() => import("./auth"));

const NavItem = withRouter((props) => {
  const { to, children, location } = props;
  return (
    <div className="at-flex at-flex-column at-full-height at-pd-x-1 at-xl-pd-x-2">
      <div className="at-align-self-center at-flex at-full-height">
        <NavLink
          className="navigation-link at-interactive"
          activeClassName="active"
          exact
          to={to}
        >
          {children}
        </NavLink>
      </div>
      <div className="navigation-link__indicator-container">
        <div
          className="navigation-link__active-indicator"
          style={{
            visibility: location.pathname === to ? "visible" : "hidden",
          }}
        ></div>
      </div>
    </div>
  );
});

Modal.setAppElement("#root");

const initialState = {
  showMenuLinks: false,
  showModal: false,
  loginModal: false,
  registerModal: false,
};

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.timeout = 0;
    this.user = this.props.user;
    this.state = initialState;
  }

  componentDidMount = () => {
    if (this.user === undefined) {
      this.setState({ anon: true });
    } else if (this.user) {
      this.setState({ anon: false });
    }
  };

  menuLinkButton = () => {
    if (!this.state.showMenuLinks) {
      document.addEventListener("click", this.handleMenuOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleMenuOutsideClick, false);
    }

    this.setState({ showMenuLinks: !this.state.showMenuLinks });
  };

  handleMenuOutsideClick = (e) => {
    this.menuLinkButton();
  };

  showLoginModal = () => {
    this.setState({ showModal: true, loginModal: true, registerModal: false });
  };

  showRegisterModal = () => {
    this.setState({ showModal: true, registerModal: true, loginModal: false });
  };

  closeModal = () => {
    this.setState(initialState);
  };

  dashboard = () => {
    window.location.href = "/dashboard";
  };

  logout = () => {
    this.setState({ anon: true });
    client.logout().then(() => window.location.reload());
  };

  render() {
    if (this.state.anon === undefined) {
      return null;
    }
    return (
      <nav
        className="top-nav"
        data-a-target="top-nav-container"
        style={{ height: "3.125rem" }}
      >
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
                <div style={{ display: "inherit" }}>
                  <div className="at-inline-flex at-relative at-tooltip-wrapper">
                    <button
                      onClick={this.menuLinkButton}
                      className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-button-icon at-core-button at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                      aria-label="Links"
                    >
                      <span className="at-button-icon__icon">
                        <div style={{ width: "2rem", height: "2rem" }}>
                          <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                            <div className="at-aspect at-aspect--align-top">
                              <div
                                className="at-aspect__spacer"
                                style={{ paddingBottom: "100%" }}
                              ></div>
                              <Links />
                            </div>
                          </div>
                        </div>
                      </span>
                    </button>
                    <div
                      className="at-tooltip at-tooltip--align-center at-tooltip--down"
                      role="tooltip"
                    >
                      Links
                    </div>
                  </div>
                  <div>
                    <div
                      className={
                        this.state.showMenuLinks
                          ? "at-absolute at-balloon at-balloon--down at-balloon--sm at-block"
                          : "at-absolute at-balloon at-balloon--down at-balloon--sm at-hide"
                      }
                      role="dialog"
                      id="LinkMenu"
                    >
                      <div className="at-c-background-base at-flex-column">
                        <div
                          className="top-nav__overflow-menu scrollable-area"
                          data-simplebar
                        >
                          <div className="at-pd-1">
                            <div>
                              <div className="at-mg-y-05 at-pd-x-05">
                                <p className="at-c-text-alt-2 at-font-size-6 at-strong at-upcase">
                                  Pages
                                </p>
                              </div>
                            </div>

                            <div className="at-full-width at-relative">
                              <a
                                href="/help"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive"
                              >
                                <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                  <div className="at-flex-grow-1">Help</div>
                                </div>
                              </a>
                            </div>
                            <div className="at-full-width at-relative">
                              <a
                                href="https://status.angelthump.com/"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive"
                              >
                                <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                  <div className="at-flex-grow-1">Status</div>
                                </div>
                              </a>
                            </div>
                            <div className="at-full-width at-relative">
                              <a
                                href="https://patreon.com/join/angelthump"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive"
                              >
                                <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                  <div className="at-flex-grow-1">Patreon</div>
                                </div>
                              </a>
                            </div>
                            <div className="at-full-width at-relative">
                              <a
                                href="https://discord.gg/QGrZXNh"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive"
                              >
                                <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                  <div className="at-flex-grow-1">Discord</div>
                                </div>
                              </a>
                            </div>
                            <div className="at-full-width at-relative">
                              <a
                                href="https://m.do.co/c/9992c85854c2"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive"
                              >
                                <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                  <div className="at-flex-grow-1">
                                    Digitalocean Get $100
                                  </div>
                                </div>
                              </a>
                            </div>
                            <div className="at-full-width at-relative">
                              <a
                                href="https://github.com/angelthump"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive"
                              >
                                <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                  <div className="at-flex-grow-1">Github</div>
                                </div>
                              </a>
                            </div>

                            <div className="at-border-t at-mg-t-1 at-mg-x-05 at-pd-b-1"></div>

                            <div>
                              <div className="at-mg-y-05 at-pd-x-05">
                                <p className="at-c-text-alt-2 at-font-size-6 at-strong at-upcase">
                                  Legal
                                </p>
                              </div>
                            </div>

                            <div className="at-full-width at-relative">
                              <a
                                href="/p/tos"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive"
                              >
                                <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                  <div className="at-flex-grow-1">
                                    Terms of Service
                                  </div>
                                </div>
                              </a>
                            </div>
                            <div className="at-full-width at-relative">
                              <a
                                href="/p/privacy"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive"
                              >
                                <div className="at-align-items-center at-flex at-pd-05 at-relative">
                                  <div className="at-flex-grow-1">
                                    Privacy Policy
                                  </div>
                                </div>
                              </a>
                            </div>
                            <div className="at-full-width at-relative">
                              <a
                                href="/p/dmca"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="at-block at-border-radius-medium at-full-width at-interactable at-interactable--alpha at-interactable--hover-enabled at-interactive"
                              >
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
            <a
              className="a-link a-link--button"
              data-a-target="home-link"
              aria-label="AngelThump Home"
              href="/"
            >
              <div className="top-nav__home-link-logo">
                <div className="at-logo">
                  <figure className="at-inline-flex">
                    <img
                      className="at-logo__img"
                      width="130px"
                      height="47px"
                      src={logo}
                      alt=""
                    ></img>
                  </figure>
                </div>
              </div>
            </a>
          </div>

          <div className="at-align-items-center at-flex at-flex-grow-1 at-flex-shrink-1 at-full-width at-justify-content-end">
            <div className="at-link-pad">
              <a
                className="a-link a-link--button"
                href="https://discord.gg/QGrZXNh"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  className="at-logo__img"
                  height="50px"
                  alt=""
                  src={discordLogo}
                ></img>
              </a>
            </div>

            <div className="at-link-pad">
              <a
                className="a-link a-link--button"
                target="_blank"
                rel="noopener noreferrer"
                href="https://patreon.com/join/angelthump"
              >
                <img
                  className="at-logo__img"
                  height="50px"
                  src={patreonLogo}
                  alt=""
                ></img>
              </a>
            </div>

            <div className="at-flex at-full-height at-mg-r-1 at-pd-y-1">
              <div className="at-flex at-flex-nowrap">
                <div
                  className={
                    !this.state.anon
                      ? "at-flex at-flex-nowrap"
                      : "at-flex at-flex-nowrap at-hide"
                  }
                >
                  <div className="at-pd-x-05">
                    <button
                      onClick={this.dashboard}
                      className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    >
                      <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                        <div className="at-flex-grow-0">Dashboard</div>
                      </div>
                    </button>
                  </div>
                  <div className="at-pd-x-05">
                    <button
                      onClick={this.logout}
                      className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    >
                      <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                        <div className="at-flex-grow-0">Log Out</div>
                      </div>
                    </button>
                  </div>
                </div>
                <div
                  className={
                    this.state.anon
                      ? "anon-user at-flex at-flex-nowrap"
                      : "anon-user at-flex at-flex-nowrap at-hide"
                  }
                >
                  <div className="at-pd-x-05">
                    <button
                      onClick={this.showLoginModal}
                      className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    >
                      <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                        <div className="at-flex-grow-0">Log In</div>
                      </div>
                    </button>
                  </div>
                  <div className="at-pd-x-05">
                    <button
                      onClick={this.showRegisterModal}
                      className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    >
                      <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                        <div className="at-flex-grow-0">Register</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal
            isOpen={this.state.showModal}
            onRequestClose={this.closeModal}
            overlayClassName={"modal__backdrop js-modal-backdrop"}
            className="modal__content"
          >
            <div className="modal-wrapper__backdrop modal-wrapper__backdrop--info at-align-items-start at-flex at-full-height at-full-width at-justify-content-center">
              <div className="modal-wrapper__content modal-wrapper__content--info at-flex at-flex-grow-0 at-full-width at-justify-content-center at-relative">
                <div className="auth-modal at-relative">
                  <div className="at-border-radius-medium at-flex at-overflow-hidden">
                    <div className="auth-modal__left-content at-overflow-auto">
                      <Suspense fallback={<></>}>
                        {" "}
                        {this.state.loginModal ? (
                          <Auth
                            user={this.props.user}
                            login={true}
                            register={false}
                          />
                        ) : (
                          <Auth
                            user={this.props.user}
                            login={false}
                            register={true}
                          />
                        )}{" "}
                      </Suspense>
                    </div>
                  </div>

                  <div className="modal__close-button">
                    <button
                      onClick={this.closeModal}
                      className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-button-icon at-button-icon--overlay at-core-button at-core-button--overlay at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    >
                      <span className="at-button-icon__icon">
                        <div style={{ width: "2rem", height: "2rem" }}>
                          <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                            <div className="at-aspect at-aspect--align-top">
                              <div
                                className="at-aspect__spacer"
                                style={{ paddingBottom: "100%" }}
                              ></div>
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
    );
  }
}

export default NavBar;
