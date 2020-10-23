import React, { Component, lazy, Suspense } from 'react';
import { NavLink } from "react-router-dom";
import SimpleBar from 'simplebar-react';
import VerifyCode from './auth/verify-code';
const Profile = lazy(() => import("./settings/profile"));
const Security = lazy(() => import("./settings/security"));
const ChannelSettings = lazy(() => import("./settings/channel"));
const Connections = lazy(() => import("./settings/connections"));

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    document.title = "AngelThump - Settings"
  }
  
  render() {
    if (this.props.user === undefined) {
      window.location.href = '/login';
      return null;
    }
    const subPath = this.props.match.params.subPath;
    if(!this.props.user.isVerified && subPath !== 'security') {
      return (
      <SimpleBar className="scrollable-area">
        <div style={{ maxWidth: "36em", margin: "0px auto" }}>
          <VerifyCode 
            email={this.props.user.email}
            login={false}/>
        </div>
      </SimpleBar>
      )
    }
    return (
      <div className="at-flex at-flex-nowrap at-full-height at-overflow-hidden at-relative">
        <main className="at-flex at-flex-column at-flex-grow-1 at-full-height at-full-width at-overflow-hidden at-relative at-z-default">
          <div className="">
            <div className="settings-tabs at-pd-t-3 at-pd-x-3">
              <div className="at-mg-b-1">
                <h2>Settings</h2>
              </div>
              <div className="">
                <ul className="at-flex at-full-width at-tab-wrapper" role="tablist">
                  <li className="at-tab">
                    <NavLink exact to="/settings/profile" activeClassName="at-tab__link--active" className="at-inline-flex at-interactive at-tab__link">Profile</NavLink>
                  </li>
                  <li className="at-tab">
                    <NavLink exact to="/settings/channel" activeClassName="at-tab__link--active" className="at-inline-flex at-interactive at-tab__link">Channel Settings</NavLink>
                  </li>
                  <li className="at-tab">
                    <NavLink exact to="/settings/security" activeClassName="at-tab__link--active" className="at-inline-flex at-interactive at-tab__link">Security</NavLink>
                  </li>
                  <li className="at-tab">
                    <NavLink exact to="/settings/connections" activeClassName="at-tab__link--active" className="at-inline-flex at-interactive at-tab__link">Connections</NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <SimpleBar className="root-scrollable scrollable-area">
            <div className="root-scrollable__wrapper at-full-width at-relative">
              <div className="at-flex at-flex-column at-flex-nowrap at-full-height at-full-width at-pd-x-3">
                <Suspense fallback={<></>}>
                  {subPath === 'profile' ? <Profile user={this.props.user}/> : subPath === 'channel' ? <ChannelSettings user={this.props.user}/> : subPath === 'security' 
                  ? <Security user={this.props.user}/> : subPath === 'connections' ? <Connections user={this.props.user}/> : <Profile user={this.props.user}/>}
                </Suspense>
              </div>
            </div>
          </SimpleBar>
        </main>
      </div>
    )
  }
}

export default Settings;