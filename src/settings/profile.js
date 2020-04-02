import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
import { ReactComponent as Success } from "../assets/success.svg";
import { ReactComponent as Error } from "../assets/error.svg";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    
  }

  render() {
    const user = this.props.user;
    console.log(user);
    return (
      <div className="settings-root__content at-pd-y-2">
        <div className="at-mg-b-2">
          <h3 className="at-c-text-alt at-font-size-4 at-strong">Profile Picture</h3>
        </div>

        <div className="at-border-b at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-l at-border-r at-border-t at-border-top-left-radius-medium at-border-top-right-radius-medium at-c-background-base at-mg-b-4">
          <div className="settings-row at-full-width at-pd-2">
            <div className="profile-image-setting">
              <div className="at-flex at-flex-row">
                <div className="at-mg-r-2 at-relative">
                  <div>
                    <figure aria-label="Profile Picture" className="at-avatar at-avatar--size-96">
                      <LazyLoad once height={300} offset={100}>
                        <img className="at-block at-border-radius-rounded at-image at-image-avatar" alt="Profile Picture" src={user.profile_logo_url}></img>
                      </LazyLoad>
                    </figure>
                  </div>
                </div>

                <div className="at-flex at-flex-column at-flex-grow-1 at-justify-content-center">
                  <input type="file" accept=".jpg,.jpeg,.png,.gif" className="profile-image-setting__input"/>
                  <div className="at-pd-b-1" style={{display: this.state.uploadError || this.state.uploadSuccess ? "block" : "none"}}>
                    <div className={this.state.uploadError ? "at-border-radius-medium at-c-text-base at-in-feature-notification at-in-feature-notification--error at-relative" : "at-border-radius-medium at-c-text-base at-in-feature-notification at-in-feature-notification--success at-relative"}>
                      <div className="at-border-radius-medium at-c-background-base">
                        <div className="at-flex">
                          <div className="at-flex at-full-width">
                            <div className="at-in-feature-notification__avatar at-pd-1">
                              <div className="at-align-items-center at-flex at-notification-figure at-notification-figure--success">
                                <div className="at-align-items-center at-icon at-inline-flex">
                                  <div className="at-aspect at-aspect--align-top">
                                    <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                    <LazyLoad once height={20}>
                                      {this.state.uploadError ? <svg class="at-svg__asset at-svg__asset--alert at-svg__asset--notificationerror" width="20px" height="20px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fill-rule="evenodd" d="M2 10a8 8 0 1016 0 8 8 0 00-16 0zm12 1V9H6v2h8z" clip-rule="evenodd"></path></g></svg> : <svg class="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm3 5l1.5 1.5L9 14l-3.5-3.5L7 9l2 2 4-4z" clip-rule="evenodd"></path></g></svg>}
                                    </LazyLoad>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="at-align-items-center at-flex at-full-width">
                              <div className="at-full-width at-pd-r-1 at-pd-y-1">
                                <div className="at-align-items-baseline at-flex at-flex-row">
                                  <div className="at-mg-r-05">Successfully updated your profile picture.</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="at-in-feature-notification__close-button at-pd-x-1 at-pd-y-05">
                            <button onClick={this.handleCloseModal} type="button" className="at-align-items-center at-align-middle at-border-bottom-left-radius-small at-border-bottom-right-radius-small at-border-top-left-radius-small at-border-top-right-radius-small at-button-icon at-button-icon--secondary at-button-icon--small at-core-button at-core-button--small at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                            aria-label="Close">
                              <span className="at-button-icon__icon">
                                <div style={{width: "1.6rem", height: "1.6rem"}}>
                                  <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                    <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                    <LazyLoad once height={20}>
                                      <svg class="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M8.5 10L4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z"></path></g></svg>
                                    </LazyLoad>
                                  </div>
                                </div>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="at-flex">
                    <button type="button" className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    aria-label="Update Profile Picture">
                      <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                        <div className="at-pd-x-1">Update Profile Picture</div>
                      </div>
                    </button>
                    <div className="at-pd-l-1" style={{display: this.state.hasProfilePicture ? 'block' : 'none'}}>
                      <button onClick={this.handleFileSelect} className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--text at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                        <div className="at-align-items-center at-core-button-label at-core-button-label--icon at-flex at-flex-grow-0">
                          <div className="at-align-items-center at-flex at-mg-0">
                            <div className="at-align-items-center at-core-button-icon at-inline-flex">
                              <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                              <LazyLoad once height={20}>
                                <svg class="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M12 2H8v1H3v2h14V3h-5V2zM4 7v9a2 2 0 002 2h8a2 2 0 002-2V7h-2v9H6V7H4z"></path><path d="M11 7H9v7h2V7z"></path></g></svg>
                              </LazyLoad>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="at-mg-t-1">
                    <p className="at-c-text-alt">Must be JPEG, PNG, or GIF and cannot exceed 5MB.</p>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default Profile;