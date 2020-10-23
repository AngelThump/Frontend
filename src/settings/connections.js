import React, { Component } from 'react';
import patreon_oauth_logo from '../assets/patreon_oauth_logo.jpg';
import LazyLoad from "react-lazyload";
import client from "../feathers";

class Connections extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  patreonOAuth = async () => {
    const { accessToken } = await client.get("authentication");
    if(this.props.user.patreon) {
      return await fetch("https://sso.angelthump.com/v1/user/patreon", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      }).then(data=>{
        if (data.error || data.code > 400 || data.status > 400) {
          console.error(data);
        }
      }).catch(e=>{
        console.error(e);
      });
    }
    window.location.href = `https://sso.angelthump.com/oauth/patreon?feathers_token=${accessToken}`
  }

  verifyPatreonStatus = async () => {
    const { accessToken } = await client.get("authentication");
    await fetch("https://sso.angelthump.com/v1/user/verify/patreon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((response) => {
      return response.json();
    })
    .then(data=>{
      if (data.error) {
        this.setState({verifyError: true, verifyErrorText: data.errorMsg, verifySuccess: false})
        return console.error(data);
      }
      this.setState({verifyError: false, verifySuccess: true})
    }).catch(e=>{
      this.setState({verifyError: true, verifyErrorText: "Server Error", verifySuccess: false})
      return console.error(e);
    });
  }

  render() {
    const user = this.props.user;

    let role;
    if(user.patreon) {
      if(user.patreon.tier === 1) {
        role = "Viewer Tier"
      } else if(user.patreon.tier === 2) {
        role = "Broadcaster Tier"
      } else if (user.patreon.tier === 3) {
        role = "Broadcaster Pro Tier"
      }
    }
    return (
      <div className="settings-root__content at-pd-y-2">
        <div className="at-mg-b-2">
          <h3 className="at-c-text-alt at-font-size-4 at-strong">Connections</h3>
          <div className="at-mg-t-1">
            <p className="at-c-text-alt-2">Manage your connected accounts and services</p>
          </div>
        </div>

        <div className="at-border-b at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-l at-border-r at-border-t at-border-top-left-radius-medium at-border-top-right-radius-medium at-c-background-base at-mg-b-4">
          <div className="settings-row at-full-width at-pd-2">
            <div className="connection-component at-flex at-flex-row">
              <div className="connection-component__image at-flex-shrink-0 at-pd-r-1 at-pd-t-05">
                <div className="at-border-radius-medium at-overflow-hidden">
                  <LazyLoad>
                    <img alt="" width="80px" height="80px" src={patreon_oauth_logo}/>
                  </LazyLoad>
                </div>
              </div>
              <div className="connection-component__right at-flex at-flex-column at-flex-grow-1 at-full-width at-pd-x-1">
                <div className="connection-component__header at-align-items-center at-flex at-flex-row">
                  <div className="connection-component__header-text at-flex at-flex-column at-flex-grow-1">
                    <p className="at-font-size-5 at-strong">Patreon</p>
                    {user.patreon ?
                      <div className="at-pd-t-1">
                        <div className="at-align-items-center at-flex">
                          <div className="connected-info__icon at-align-items-center at-flex">
                            <figure className="at-svg">
                              <svg className="at-svg__asset at-svg__asset--inherit at-svg__asset--notificationsuccess" width="20px" height="20px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm3 5l1.5 1.5L9 14l-3.5-3.5L7 9l2 2 4-4z" clipRule="evenodd"></path></g></svg>
                            </figure>
                          </div>
                          <span className="at-align-middle at-pd-l-05">Your Patreon account is connected.</span>
                          <div className="at-pd-l-2">
                            <div className="at-align-items-center at-flex">
                              <p className="at-align-middle at-c-text-alt-2 at-font-size-6">{user.patreon.isPatron ? `Patreon Status: ${role}` : "Patreon Status: Not a Patron"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    : null}
                  </div>
                  <div className="at-mg-r-1" style={{display: user.patreon ? 'block' : 'none'}}>
                  <button
                      disabled
                      className="at-button at-button--state-success at-button--success at-interactive"
                      style={{display: this.state.verifySuccess ? 'block' : 'none'}}
                    >
                      <span className="at-button__text">Verify</span>
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
                    style={{display: !this.state.verifySuccess ? 'inline-flex' : 'none'}}
                    onClick={this.verifyPatreonStatus}
                    className={this.state.verifyError
                    ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--destructive at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    }>
                      <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                        <div className="at-flex-grow-0">{this.state.verifyError ? this.state.verifyErrorText : "Verify"}</div>
                      </div>
                    </button>

                  </div>
                  <button
                    onClick={this.patreonOAuth}
                    className={user.patreon 
                    ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--secondary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                    : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}
                  >
                    <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                      <div className="at-flex-grow-0">{user.patreon ? "Disconnect" : "Connect"}</div>
                    </div>
                  </button>
                </div>
                <div className="connection-component__footer at-c-text-alt-2 at-pd-t-2">
                  When you choose to connect your Patreon account, the profile information connected to your Patreon account, including your name, may be used by AngelThump. You will be able to use patreon specific perks depeding on which tier you pledged. AngelThump will not publicly display your Patreon account information.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Connections;