import React, { Component } from 'react';
import LazyLoad from "react-lazyload";
import Modal from "react-modal";
import PasswordChange from './password-change';
import EmailChange from './email-change';
import SecurityConfirmPassword from './security-confirm-password';
import VerifyCode from '../auth/verify-code';
import SimpleBar from 'simplebar-react';
import logo from "../assets/logo.png";

Modal.setAppElement('#root')

class Security extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  showChangeEmailModal = () => {
    this.setState({showModal: true, showConfirmPassModal: true, showChangeEmailModal: true, showChangePasswordModal: false})
  }

  showChangePasswordModal = () => {
    this.setState({showModal: true, showConfirmPassModal: true, showChangeEmailModal: false, showChangePasswordModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false, showChangeEmailModal: false, showChangePasswordModal: false, showConfirmPassModal: false, showConfirmEmailChangesModal: false})
  }

  verified = (password) => {
    this.setState({showConfirmPassModal: false, password: password})
  }

  emailChanged = () => {
    this.setState({showChangeEmailModal: false, showVerificationModal: true})
  }

  confirmEmailChanges = () => {
    this.setState({showChangeEmailModal: false, showConfirmEmailChangesModal: true});
  }

  render() {
    const user = this.props.user;
    return (
      <div className="settings-root__content at-pd-y-2">
        <div className="at-mg-b-2">
          <h3 className="at-c-text-alt at-font-size-4 at-strong">Security</h3>
        </div>

        <div className="at-border-b at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-l at-border-r at-border-t at-border-top-left-radius-medium at-border-top-right-radius-medium at-c-background-base at-mg-b-4">
          <div className="settings-row at-full-width at-pd-2">
            <div className="at-flex-grow-1 at-font-size-6 at-form-group at-relative">
              <div className="at-flex at-flex-nowrap">
                <div className="at-flex-shrink-0 at-form-group__label-container at-pd-r-2">
                  <div className="at-mg-b-05">
                    <label className="at-form-label">Email</label>
                  </div>
                </div>
                <div className="at-flex-grow-1">
                  <div className="at-align-items-center at-flex">
                    <div className="at-flex-grow-1">
                      <p className="at-font-size-4 at-strong">{user.email}</p>
                    </div>
                    <div className="at-mg-l-05">
                      <button
                        onClick={this.showChangeEmailModal}
                        className="at-align-items-center at-align-middle at-border-bottom-left-radius-small at-border-bottom-right-radius-small at-border-top-left-radius-small at-border-top-right-radius-small at-button-icon at-button-icon--small at-core-button at-core-button--small at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                        aria-label="Change Email"
                      >
                        <span className="at-button-icon__icon">
                          <div style={{width: "1.6rem", height: "1.6rem"}}>
                            <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                              <div className="at-aspect at-aspect--align-top">
                                <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                  <LazyLoad>
                                    <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fillRule="evenodd" d="M17.303 4.303l-1.606-1.606a2.4 2.4 0 00-3.394 0L2 13v5h5L17.303 7.697a2.4 2.4 0 000-3.394zM4 16v-2.171l7.207-7.208 2.172 2.172L6.172 16H4zm10.793-8.621l1.096-1.096a.4.4 0 000-.566l-1.606-1.606a.4.4 0 00-.566 0l-1.096 1.096 2.172 2.172z" clipRule="evenodd"></path></g></svg>
                                  </LazyLoad>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="at-mg-t-1">
                    <p className="at-c-text-alt">
                      <strong className="at-font-size-5">{user.isVerified ? "Verified. " : "Not Verified. "}</strong>
                      {user.isVerified ? "Thank you for verifying your email." : "Please verify your email!"}
                    </p>
                    <div className="at-mg-t-05">
                      <div className="at-c-text-alt-2">This email is linked to your account.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-row at-full-width at-pd-2">
            <div className="at-flex-grow-1 at-font-size-6 at-form-group at-relative">
              <div className="at-flex at-flex-nowrap">
                <div className="at-flex-shrink-0 at-form-group__label-container at-pd-r-2">
                  <div className="at-mg-b-05">
                    <label className="at-form-label">Password</label>
                  </div>
                </div>
                <div className="at-flex-grow-1">
                  <div className="at-flex">
                    <button
                      onClick={this.showChangePasswordModal}
                      className={"at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}
                      aira-label="Change Password"
                    >
                      <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                        <div className="at-flex-grow-0">Change Password</div>
                      </div>
                    </button>
                  </div>
                  <div className="at-mg-t-1">
                    <p className="at-c-text-alt">Improve your security with a strong password</p>
                  </div>
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
              {this.state.showVerificationModal ? 
              <SimpleBar className="scrollable-area">
                <div style={{ maxWidth: "36em", margin: "0px auto" }}>
                  <LazyLoad>
                    <VerifyCode email={user.email}/>
                  </LazyLoad>
                </div>
              </SimpleBar>
              :
              <div className="auth-modal at-relative">
                {this.state.showConfirmEmailChangesModal ? 
                  <div className="at-c-background-base at-flex at-flex-column at-pd-x-2 at-pd-y-3">
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
                      </div>
                      <div className="at-align-items-center at-flex at-mg-t-1">
                        <h4 className="at-font-size-4 at-strong">
                          <strong>{user.display_name}, </strong>
                          check your original email to confirm your changes!
                        </h4>
                      </div>
                    </div>
                  </div>
                :
                <LazyLoad>
                  {this.state.showConfirmPassModal ? <SecurityConfirmPassword user={this.props.user} verified={this.verified}/> : this.state.showChangeEmailModal ? <EmailChange user={this.props.user} password={this.state.password} emailChanged={this.emailChanged} confirmEmailChanges={this.confirmEmailChanges} /> : this.state.showChangePasswordModal ? <PasswordChange user={this.props.user} oldPassword={this.state.password} closeModal={this.closeModal}/> : null}
                </LazyLoad>
                }
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
                            <LazyLoad>
                              <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M8.5 10L4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z"></path></g></svg>
                            </LazyLoad>
                          </div>
                        </div>
                      </div>
                    </span>
                  </button>
                </div>
              </div>}
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Security;