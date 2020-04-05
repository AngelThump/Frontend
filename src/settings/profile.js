import React, { Component } from 'react';
import LazyLoad, { forceCheck } from "react-lazyload";
import client from "../feathers";
import Modal from "react-modal";
import SecurityConfirmPassword from './security-confirm-password';
import UsernameChange from './username-change';
import Cropper from 'react-easy-crop'
import Pica from 'pica';
import Slider from '@material-ui/core/Slider'

Modal.setAppElement('#root')

class Profile extends Component {
  constructor(props) {
    super(props);

    this.CropperRef = React.createRef();
    this.display_name = this.props.display_name;
    this.defaultProfileLogo = "https://images-angelthump.nyc3.cdn.digitaloceanspaces.com/default_profile_picture.png";
    this.acceptOnlyImages= ['image/jpg','image/jpeg','image/png','image/gif']
    this.state = {
      uploadError: false,
      uploadSuccess: false,
      uploadMessage: "",
      display_name: this.props.user.display_name,
      display_name_isValid: false,
      saveChangesSuccess: false,
      saveChangesError: false,
      showUsernameChangeModal: false,
      showConfirmPassModal: false,
      showModal: false,
      showFileModal: false,
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 1,
      rotation: 0,
      croppedAreaPixels: null,
      croppedImage: null,
      isCropping: false,
      profile_logo_url: this.props.user.profile_logo_url
    };
  }

  cropPhoto = async evt => {
    if(evt) {
      evt.preventDefault();
    }

    try {
      const croppedImage = await getCroppedImg(
        this.state.imageSrc,
        this.state.croppedAreaPixels,
        this.state.rotation,
        this.state.fileType
      )
      const result = await uploadImage(croppedImage);
      if(!result) {
        this.setState({uploadError: true, uploadSuccess: false, uploadMessage: "Something went severely wrong. Contact support if it keeps happening."}, () => {
          forceCheck();
        })
      }
      this.setState({profile_logo_url: result.imageURL, uploadError: false, uploadMessage: "Successfully updated your profile picture.", uploadSuccess: true}, () => {
        forceCheck();
      })
      this.closeFileModal();
    } catch (e) {
      console.error(e);
    }
  }

  onCropChange = crop => {
    this.setState({ crop });
  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({
      croppedAreaPixels,
    })
  }

  onZoomChange = zoom => {
    this.setState({ zoom })
  }

  onRotationChange = () => {
    let rotation = this.state.rotation + 90;
    if(rotation === 360) {
      rotation = 0;
    }
    this.setState({rotation: rotation});
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

      this.setState({
        imageSrc: imageDataUrl, showFileModal: true, fileType: file.type
      });
    }
  }

  fileButtonClick = (evt) => {
    if(evt) {
      evt.preventDefault();
    }
    this.fileInput.click();
  }

  closeFileModal = () => {
    this.fileInput.value='';
    this.setState({showFileModal: false, imageSrc: '', fileType: null, rotation: 0})
  }

  deleteUserLogo = async (evt) => {
    if(evt) {
      evt.preventDefault();
    }

    const { accessToken } = await client.get('authentication');

    await fetch("https://sso.angelthump.com:8080/v1/user/profile-logo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.error || data.code > 400 || data.status > 400) {
        return console.error(data);
      }
      this.setState({profile_logo_url: null})
    })
    .catch((e) => {
      console.error(e);
    });
  }

  display_name_onChange = (evt) => {
    this.setState({display_name: evt.target.value, saveChangesSuccess: false, saveChangesError: false}, () => {
      if(this.state.display_name.length > 0) {
        this.setState({display_name_isValid: true})
      } else {
        this.setState({display_name_isValid: false})
      }
    })
  }

  handleCloseMessage = () => {
    this.setState({uploadError: false, uploadSuccess: false})
  }

  handleSaveChanges = async (evt) => {
    if(evt) {
      evt.preventDefault();
    }

    const { accessToken } = await client.get('authentication');
    
    await fetch("https://sso.angelthump.com:8080/v1/user/display-name", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        display_name: this.state.display_name,
      }),
    })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.error || data.code > 400 || data.status > 400) {
        this.setState({saveChangesError: true, saveChangesSuccess: false})
        return console.error(data);
      }
      this.display_name = this.state.display_name;
      this.setState({saveChangesSuccess: true, saveChangesError: false})
    })
    .catch((e) => {
      this.setState({saveChangesError: true, saveChangesSuccess: false})
      console.error(e);
    });

  }

  showModal = (evt) => {
    if(evt) {
      evt.preventDefault();
    }

    this.setState({showModal: true, showConfirmPassModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false})
  }

  verified = () => {
    this.setState({showConfirmPassModal: false, showUsernameChangeModal: true})
  }

  render() {
    const user = this.props.user
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
                        <img className="at-block at-border-radius-rounded at-image at-image-avatar" alt="" src={this.state.profile_logo_url ? this.state.profile_logo_url : this.defaultProfileLogo}></img>
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
                    aria-label="Update Profile Picture">
                      <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                        <div className="at-pd-x-1">Update Profile Picture</div>
                      </div>
                    </button>
                    <div className="at-pd-l-1" style={{display: this.state.profile_logo_url ? 'block' : 'none'}}>
                      <button onClick={this.deleteUserLogo} className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--text at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
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
          <h3 className="at-c-text-alt at-font-size-4 at-strong">Profile Settings</h3>
        </div>

        <div className="at-border-b at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-l at-border-r at-border-t at-border-top-left-radius-medium at-border-top-right-radius-medium at-c-background-base at-mg-b-4">
          <div className="settings-row at-full-width at-pd-0">
            <div className="settings-row at-full-width at-pd-2">
              <div className="at-flex-grow-1 at-font-size-6 at-form-group at-relative">
                <div className="at-flex at-flex-nowrap">
                  <div className="at-flex-shrink-0 at-form-group__label-container at-pd-r-2">
                    <div className="at-mg-b-05">
                      <label className="at-form-label">Username</label>
                    </div>
                  </div>
                  <div className="at-flex-grow-1">
                    <div className="">
                      <div className="at-combo-input at-flex at-full-width">
                        <div className="at-combo-input__input at-flex-grow-1">
                          <div className="at-relative">
                            <input 
                            type="text" 
                            className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-none at-border-top-left-radius-medium at-border-top-right-radius-none at-font-size-6 at-full-width at-input at-input--rounded-left at-pd-l-1 at-pd-r-1 at-pd-y-05"
                            autoCapitalize="off"
                            autoCorrect="off"
                            disabled
                            value={user.username}
                            ></input>
                          </div>
                        </div>
                        <button 
                        href="#"
                        onClick={this.showModal}
                        className="at-align-items-center at-align-middle at-border-bottom-left-radius-none at-border-bottom-right-radius-medium at-border-top-left-radius-none at-border-top-right-radius-medium at-combo-input__button-icon at-core-button at-core-button--rounded-right at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                        aria-label="Edit Username"
                        >
                        <div className="at-align-items-center at-core-button-icon at-inline-flex">
                          <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                            <div className="at-aspect at-aspect--align-top">
                              <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                              <LazyLoad once>
                                <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fillRule="evenodd" d="M17.303 4.303l-1.606-1.606a2.4 2.4 0 00-3.394 0L2 13v5h5L17.303 7.697a2.4 2.4 0 000-3.394zM4 16v-2.171l7.207-7.208 2.172 2.172L6.172 16H4zm10.793-8.621l1.096-1.096a.4.4 0 000-.566l-1.606-1.606a.4.4 0 00-.566 0l-1.096 1.096 2.172 2.172z" clipRule="evenodd"></path></g></svg>
                              </LazyLoad>
                            </div>
                          </div>
                        </div>
                      </button>
                      </div>
                    </div>
                    <div className="at-mg-t-1">
                      <p className="at-c-text-alt">Change your username here</p>
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
                    <label className="at-form-label">Display Name</label>
                  </div>
                </div>
                <div className="at-flex-grow-1">
                  <div className="at-relative">
                    <input 
                    onChange={this.display_name_onChange}
                    type="text"
                    className="at-block at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-font-size-6 at-full-width at-input at-pd-l-1 at-pd-r-1 at-pd-y-05"
                    autoCapitalize="off"
                    autoCorrect="off"
                    id="display_name_input"
                    value={this.state.display_name}
                    ></input>
                  </div>
                  <div className="at-mg-t-1">
                    <p className="at-c-text-alt">Customize capitalization for your username</p>
                  </div>
                  <div className="at-mg-t-05" style={{display: this.state.saveChangesError ? "block" : "none"}}>
                    <p className="at-c-text-error at-font-size-7">Cannot change display name that differs from your username. You can only change the capitalization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="at-c-background-alt-2 at-pd-2">
            <div className="at-flex at-justify-content-end">
              <button
                disabled
                className="at-button at-button--state-success at-button--success at-interactive"
                style={{display: this.state.saveChangesSuccess ? 'block' : 'none'}}
              >
                <span className="at-button__text">Save Changes</span>
                <div className="at-absolute at-align-items-center at-button__success-icon at-flex at-justify-content-center">
                  <div style={{width: "2rem", height: "2rem"}}>
                    <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                      <div className="at-aspect at-aspect--align-top">
                        <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>

                          <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M4 10l5 5 8-8-1.5-1.5L9 12 5.5 8.5 4 10z"></path></g></svg>

                      </div>
                    </div>
                  </div>
                </div>
              </button>
              
              <button
              style={{display: !this.state.saveChangesSuccess ? 'inline-flex' : 'none'}}
              onClick={this.handleSaveChanges}
              disabled={this.state.display_name_isValid ? null : 'disabled'}
              className={this.state.saveChangesError
              ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--destructive at-interactive at-justify-content-center at-overflow-hidden at-relative"
              : this.state.display_name_isValid ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-interactive at-justify-content-center at-overflow-hidden at-relative"
              : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-interactive at-justify-content-center at-overflow-hidden at-relative"
              }>
                <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                  <div className="at-flex-grow-0">{this.state.saveChangesError ? "Failed to save settings. Try again." : "Save Changes"}</div>
                </div>
              </button>
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
                <LazyLoad>
                  {this.state.showConfirmPassModal ? <SecurityConfirmPassword user={this.props.user} verified={this.verified}/> : this.state.showUsernameChangeModal ? <UsernameChange user={this.props.user} /> : null}
                </LazyLoad>
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
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={this.state.showFileModal}
          onRequestClose={this.closeFileModal}
          overlayClassName={"modal__backdrop js-modal-backdrop"}
          className="modal__content"
        >
          <div className="modal-wrapper__backdrop modal-wrapper__backdrop--info at-align-items-start at-flex at-full-height at-full-width at-justify-content-center">
            <div className="modal-wrapper__content modal-wrapper__content--info at-flex at-flex-grow-0 at-full-width at-justify-content-center at-relative">
              <div className="profile-edit at-border-radius-medium at-c-background-base at-full-width at-overflow-hidden">
                <div className="at-align-items-center at-flex at-justify-content-center at-pd-1">
                  <h4 className="at-align-middle">Update Profile Picture</h4>
                </div>
                <div className="at-align-items-center at-border-b at-border-t at-flex at-flex-column at-justify-content-center at-overflow-hidden">
                  <div style={{width:"600px",height:"320px"}}>
                    <LazyLoad>
                      <Cropper
                        ref={this.CropperRef}
                        image={this.state.imageSrc}
                        crop={this.state.crop}
                        zoom={this.state.zoom}
                        aspect={this.state.aspect}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={this.onCropChange}
                        onCropComplete={this.onCropComplete}
                        onZoomChange={this.onZoomChange}
                        zoomWithScroll={false}
                        onRotationChange={this.onRotationChange}
                        rotation={this.state.rotation}
                      />
                    </LazyLoad>
                  </div>
                </div>
                <div className="at-c-background-alt-2">
                  <div className="at-flex at-pd-1">
                    <div className="at-align-items-center at-flex at-flex-grow-1 at-pd-r-2">
                      <div className="at-inline-flex at-pd-r-2">
                        <button
                          onClick={this.onRotationChange}
                          className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-button-icon at-core-button at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                        >
                          <span className="at-button-icon__icon">
                            <div stlye={{width: "2rem", height:"2rem"}}>
                              <div className="at-align-items-center at-icon at-inline-flex">
                                  <div className="at-aspect at-aspect--align-top">
                                    <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                    <LazyLoad once>
                                      <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M10 16a5.98 5.98 0 004.243-1.757l1.414 1.414A8 8 0 1116 4.708V2h2v6h-6V6h2.472A6 6 0 1010 16z"></path></g></svg>
                                    </LazyLoad>
                                  </div>
                              </div>
                            </div>
                          </span>
                        </button>
                      </div>
                      <div className="at-c-text-alt-2">
                        <div className="at-align-items-center at-icon at-inline-flex">
                          <div className="at-aspect at-aspect--align-top">
                            <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                            <LazyLoad once>
                              <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M12 10V8H6v2h6z"></path><path fillRule="evenodd" d="M9 16a6.969 6.969 0 004.192-1.394l3.101 3.101 1.414-1.414-3.1-3.1A7 7 0 109 16zm0-2A5 5 0 109 4a5 5 0 000 10z" clipRule="evenodd"></path></g></svg>
                            </LazyLoad>
                          </div>
                        </div>
                      </div>

                      <div className="at-flex-grow-1 at-pd-l-1 at-pd-r-1">
                        <Slider
                          defaultValue={1}
                          min={1}
                          max={3}
                          step={0.1}
                          aria-labelledby="Zoom"
                          onChange={(e, zoom) => this.onZoomChange(zoom)}
                        ></Slider>
                      </div>

                      <div className="at-c-text-alt-2">
                        <div className="at-align-items-center at-icon at-inline-flex">
                          <div className="at-aspect at-aspect--align-top">
                            <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                            <LazyLoad once>
                              <svg className="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path d="M8 8V6h2v2h2v2h-2v2H8v-2H6V8h2z"></path><path fillRule="evenodd" d="M9 16a6.969 6.969 0 004.192-1.394l3.101 3.101 1.414-1.414-3.1-3.1A7 7 0 109 16zm0-2A5 5 0 109 4a5 5 0 000 10z" clipRule="evenodd"></path></g></svg>
                            </LazyLoad>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="at-flex">
                      <div className="at-pd-r-1">
                        <button
                          onClick={this.closeFileModal}
                          className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                        >
                          <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                            <div className="at-flex-grow-0">Cancel</div>
                          </div>
                        </button>
                      </div>
                      <button
                        onClick={this.cropPhoto}
                        className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden tw-relative"
                      >
                        <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                          <div className="at-flex-grow-0">Save</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

const readFile = file => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', async (e) => {
      const img = await createImage(e.target.result)
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const MAX_WIDTH = 500;
      const MAX_HEIGHT = 320;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;

      const pica = Pica();
      pica.resize(img, canvas)
      .then(result => {
        const imageDataUrl = result.toDataURL(file.type);
        resolve(imageDataUrl)
      });

    }, false)
    reader.readAsDataURL(file)
  })
}

const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

const getCroppedImg = async(imageSrc, pixelCrop, rotation, fileType) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const safeArea = Math.max(image.width, image.height) * 2

  canvas.width = safeArea
  canvas.height = safeArea

  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-safeArea / 2, -safeArea / 2)

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  )
  const data = ctx.getImageData(0, 0, safeArea, safeArea)

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  )
  return canvas.toDataURL(fileType);
}

const uploadImage = async (dataURL) => {
  return await client.service('uploads/profile-logos')
  .create({
    uri: dataURL
  }).catch(e=>{
    console.error(e)
  })
}

export default Profile;