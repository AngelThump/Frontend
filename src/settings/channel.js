import React, { Component } from 'react';
import LazyLoad, { forceCheck } from "react-lazyload";
import client from "../feathers";
import {CopyToClipboard} from 'react-copy-to-clipboard';

class ChannelSettings extends Component {
  constructor(props) {
    super(props);

    this.defaultOfflineUrl = "https://images-angelthump.nyc3.cdn.digitaloceanspaces.com/default_offline_banner.png";
    this.acceptOnlyImages = ['image/jpg','image/jpeg','image/png','image/gif'];

    this.state = {
      uploadError: false,
      uploadSuccess: false,
      uploadMessage: "",
      offline_banner_url: this.props.user.offline_banner_url,
    };
  }

  fileButtonClick = (evt) => {
    if(evt) {
      evt.preventDefault();
    }
    this.fileInput.click();
  }

  handleCloseMessage = () => {
    this.setState({uploadError: false, uploadSuccess: false})
  }

  deleteVideoBanner = async (evt) => {
    if(evt) {
      evt.preventDefault();
    }

    const { accessToken } = await client.get('authentication');

    await fetch("https://sso.angelthump.com:8080/v1/user/offline-banner", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.error || data.code > 400) {
        return console.error(data);
      }
      this.setState({offline_banner_url: null})
    })
    .catch((e) => {
      console.error(e);
    });
  }

  onFileChange = async e => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if(!this.acceptOnlyImages.includes(file.type)) {
        this.setState({uploadError: true, uploadSuccess: false, uploadMessage: "File must be JPEG, PNG, or GIF"}, () => {
          forceCheck();
        })
        return console.error('File must be JPEG, PNG, or GIF')
      }
      const fileSize = file.size / (1024 * 1024);
      if(fileSize > 5) {
        this.setState({uploadError: true, uploadSuccess: false, uploadMessage: "File size needs to be less than 5 MB"}, () => {
          forceCheck();
        })
        return console.error('File size needs to be less than 5 MB');
      }
      const imageDataUrl = await readFile(file);
      const result = await uploadImage(imageDataUrl);
      if(!result) {
        this.setState({uploadError: true, uploadSuccess: false, uploadMessage: "Something went severely wrong. Contact support if it keeps happening."}, () => {
          forceCheck();
        })
      }
      this.setState({offline_banner_url: result.imageURL, uploadError: false, uploadMessage: "Successfully updated your offline video banner.", uploadSuccess: true}, () => {
        forceCheck();
      })
      this.fileInput.value='';
    }
  }

  handleShowStreamKey = () => {
    this.setState({showStreamKey: !this.state.showStreamKey})
  }

  resetStreamKey = async () => {
    const { accessToken } = await client.get('authentication');

    await fetch("https://sso.angelthump.com:8080/v1/user/stream-key", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.error || data.code > 400) {
        return console.error(data);
      }
      this.setState({didReset: true}, () => {
        forceCheck();
        setTimeout(()=> this.setState({didReset: false}),5000);
      })
    })
    .catch((e) => {
      console.error(e);
    });
  }

  handleNSFWToggle = async () => {
    const { accessToken } = await client.get('authentication');

    await fetch("https://sso.angelthump.com:8080/v1/user/nsfw", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        nsfw: !this.props.user.nsfw
      })
    })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.error || data.code > 400) {
        return console.error(data);
      }
    })
    .catch((e) => {
      console.error(e);
    });
  }

  render() {
    const user = this.props.user;
    return (
      <div className="settings-root__content at-pd-y-2">
        <div className="at-mg-b-2">
          <h3 className="at-c-text-alt at-font-size-4 at-strong">Offline Video Banner</h3>
        </div>

        <div className="at-border-b at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-l at-border-r at-border-t at-border-top-left-radius-medium at-border-top-right-radius-medium at-c-background-base at-mg-b-4">
          <div className="settings-row at-full-width at-pd-2">
            <div className="profile-image-setting">
              <div className="at-flex at-flex-row">
                <div className="at-mg-r-2 at-relative">
                  <div>
                    <figure aria-label="Offline Video Banner" className="at-border-radius-medium at-overflow-hidden">
                      <LazyLoad once>
                        <img className="at-block" height="90" width="160" alt="" src={this.state.offline_banner_url ? this.state.offline_banner_url : this.defaultOfflineUrl}></img>
                      </LazyLoad>
                    </figure>
                  </div>
                </div>

                <div className="at-flex at-flex-column at-flex-grow-1 at-justify-content-center">
                  <input ref={ref => {this.fileInput = ref}} onChange={this.onFileChange} type="file" accept=".jpg,.jpeg,.png,.gif" className="profile-image-setting__input"/>
                  <div className="at-pd-b-1" style={{display: this.state.uploadError || this.state.uploadSuccess ? "block" : "none"}}>
                    <div className={this.state.uploadError ? "at-border-radius-medium at-c-text-base at-in-feature-notification at-in-feature-notification--error at-relative" : "at-border-radius-medium at-c-text-base at-in-feature-notification at-in-feature-notification--success at-relative"}>
                      <div className="at-border-radius-medium at-c-background-base">
                        <div className="at-flex">
                          <div className="at-align-items-center at-flex at-full-width">
                            <div className="at-in-feature-notification__avatar at-pd-1">
                              <div className="at-align-items-center at-flex at-notification-figure at-notification-figure--success">
                                <div className="at-align-items-center at-icon at-inline-flex">
                                  <div className="at-aspect at-aspect--align-top">
                                    <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                    <LazyLoad once>
                                      {this.state.uploadError ? <svg className="at-svg__asset at-svg__asset--alert at-svg__asset--notificationerror" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fillRule="evenodd" d="M2 10a8 8 0 1016 0 8 8 0 00-16 0zm12 1V9H6v2h8z" clipRule="evenodd"></path></g></svg> : <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm3 5l1.5 1.5L9 14l-3.5-3.5L7 9l2 2 4-4z" clipRule="evenodd"></path></g></svg>}
                                    </LazyLoad>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="at-align-items-center at-flex at-full-width">
                              <div className="at-full-width at-pd-r-1 at-pd-y-1">
                                <div className="at-align-items-baseline at-flex at-flex-row">
                                  <div className="at-mg-r-05">{this.state.uploadMessage}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="at-in-feature-notification__close-button at-pd-x-1 at-pd-y-05">
                            <button onClick={this.handleCloseMessage} type="button" className="at-align-items-center at-align-middle at-border-bottom-left-radius-small at-border-bottom-right-radius-small at-border-top-left-radius-small at-border-top-right-radius-small at-button-icon at-button-icon--secondary at-button-icon--small at-core-button at-core-button--small at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                            aria-label="Close">
                              <span className="at-button-icon__icon">
                                <div style={{width: "1.6rem", height: "1.6rem"}}>
                                  <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                    <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                    <LazyLoad once>
                                      <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M8.5 10L4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z"></path></g></svg>
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
                    <button type="button" onClick={this.fileButtonClick} className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    aria-label="Update Offline Video Banner">
                      <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                        <div className="at-pd-x-1">Update</div>
                      </div>
                    </button>
                    <div className="at-pd-l-1" style={{display: this.state.offline_banner_url ? 'block' : 'none'}}>
                      <button onClick={this.deleteVideoBanner} className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--text at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                        <div className="at-align-items-center at-core-button-label at-core-button-label--icon at-flex at-flex-grow-0">
                          <div className="at-align-items-center at-flex at-mg-0">
                            <div className="at-align-items-center at-core-button-icon at-inline-flex">
                              <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                              <LazyLoad once height={20}>
                                <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M12 2H8v1H3v2h14V3h-5V2zM4 7v9a2 2 0 002 2h8a2 2 0 002-2V7h-2v9H6V7H4z"></path><path d="M11 7H9v7h2V7z"></path></g></svg>
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

        <div className="at-mg-b-2">
          <h3 className="at-c-text-alt at-font-size-4 at-strong">Channel Settings</h3>
          <div className="at-mg-t-1">
            <p className="at-c-text-alt-2">Change your channel preferences here</p>
          </div>
        </div>

        <div className="at-border-b at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-l at-border-r at-border-t at-border-top-left-radius-medium at-border-top-right-radius-medium at-c-background-base at-mg-b-4">
          <div className="settings-row at-full-width at-pd-0">
            <div className="settings-row at-full-width at-pd-2">
              <div className="at-flex-grow-1 at-font-size-6 at-form-group at-relative">
                <div className="at-flex at-flex-nowrap">
                  <div className="at-flex-shrink-0 at-form-group__label-container at-pd-r-2">
                    <div className="at-mg-b-05">
                      <label className="at-form-label">Stream Key</label>
                    </div>
                  </div>
                  <div className="at-flex-grow-1">
                    <div className="at-flex">
                      <div className="at-flex-grow-1 at-pd-r-05">
                        <div className="at-relative">
                          <input 
                            type="text"
                            className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05"
                            autoCapitalize="off"
                            autoCorrect="off"
                            autoComplete="angelthump-stream-key"
                            readOnly
                            value={this.state.showStreamKey ? user.stream_key : "•••••••••••••••••••••••••••••••••••••••••••"}
                          ></input>
                        </div>
                      </div>
                      <CopyToClipboard text={user.stream_key} onCopy={() => {this.setState({copied: true}); setTimeout(() => this.setState({copied:false}),5000);}}>
                        <button
                          className={this.state.copied 
                            ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                            : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}
                          aira-label="Copy Stream Key"
                        >
                          <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                            <div className="at-flex-grow-0">{this.state.copied ? "Copied" : "Copy"}</div>
                          </div>
                        </button>
                      </CopyToClipboard>
                      <div className="at-pd-l-1">
                        <button
                          onClick={this.resetStreamKey}
                          disabled={this.state.didReset ? "disabled" : null}
                          className={this.state.didReset
                          ? "at-button at-button--state-success at-button--success at-interactive"
                          : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}
                          aria-label="Reset Stream Key"
                        >
                          <span className="at-button__text" data-a-target="at-core-button-label-text" style={{display: this.state.didReset ? "block" : "none"}}>Reset</span>
                          <div className="at-absolute at-align-items-center at-button__success-icon at-justify-content-center" style={{display: this.state.didReset ? "flex" : "none"}}>
                            <div style={{width: "2rem", height: "2rem"}}>
                              <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                <div className="at-aspect at-aspect--align-top">
                                  <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}>
                                  </div>
                                  <LazyLoad once>
                                    <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M4 10l5 5 8-8-1.5-1.5L9 12 5.5 8.5 4 10z"></path></g></svg>
                                  </LazyLoad>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="at-align-items-center at-core-button-label at-flex-grow-0" style={{display: this.state.didReset ? "none" : "flex"}}>
                            <div className="at-flex-grow-0">Reset</div>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="at-pd-t-05">
                      <button onClick={this.handleShowStreamKey} className="at-interactive at-link at-link--button">{this.state.showStreamKey ? "Hide" : "Show"}</button>
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
                    <label className="at-form-label" htmlFor="TOGGLE_PAST_BROADCASTS">Store past broadcasts</label>
                  </div>
                </div>
                <div className="at-flex-grow-1">
                  <div>
                    <div className="at-toggle">
                      <input id="TOGGLE_PAST_BROADCASTS" className="at-toggle__input" type="checkbox" disabled="disabled" defaultChecked={false}/>
                      <label htmlFor="TOGGLE_PAST_BROADCASTS" className="at-toggle__button"></label>
                    </div>
                    <div className="at-mg-t-1">
                      <p className="at-c-text-alt">Automatically save broadcasts for up to 7 days</p>
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
                    <label className="at-form-label" htmlFor="TOGGLE_NSFW">Mature Content</label>
                  </div>
                </div>
                <div className="at-flex-grow-1">
                  <div>
                    <div className="at-toggle">
                      <input onChange={this.handleNSFWToggle} id="TOGGLE_NSFW" className="at-toggle__input" type="checkbox" defaultChecked={user.nsfw}/>
                      <label htmlFor="TOGGLE_NSFW" className="at-toggle__button"></label>
                    </div>
                    <div className="at-mg-t-1">
                      <p className="at-c-text-alt">
                        Please enable this setting if your stream contains content that may be inappropriate.
                        Not doing so will result in an account suspension.
                        You may never broadcast extreme sexual activity, extreme nudity, threats or extreme violence. 
                        Doing so will result in immediate, irrevocable termination of your account. 
                        Please make sure your content will comply with the Terms of Service before broadcasting</p>
                    </div>
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

const readFile = file => {
  return new Promise(resolve => {
    const reader = new FileReader()
    //console.log(reader.readAsDataURL(file));
    reader.addEventListener('load', (e) => {
      resolve(e.target.result);
    }, false)
    reader.readAsDataURL(file)
  })
}

const uploadImage = async (dataURL) => {
  return await client.service('uploads/offline-banners')
  .create({
    uri: dataURL
  }).catch(e=>{
    console.error(e)
  })
}

export default ChannelSettings;