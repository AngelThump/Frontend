import React, { Component, lazy, Suspense } from 'react';
import 'simplebar/dist/simplebar.css';
import './css/App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import client from "./feathers";
const Frontpage = lazy(() => import("./frontpage"));
const Following = lazy(() => import("./following"));
const NavBar = lazy(() => import("./navbar"));
const NotFound = lazy(() => import("./notfound"));
const Recovery = lazy(() => import("./recovery"));
const Auth = lazy(() => import("./auth"));
const Dashboard = lazy(() => import("./dashboard"));
const Help = lazy(() => import("./pages/help"));
const ChannelPage = lazy(() => import("./channel-page"));

const TermsOfService = lazy(() => import("./pages/tos"));
const PrivacyPolicy = lazy(() => import("./pages/privacypolicy"));
const DMCA = lazy(() => import("./pages/dmca"));

const Settings = lazy(() => import("./settings"));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    client.authenticate().catch(() => this.setState({ user: null }));

    client.on('authenticated', user => {
      this.setState({ user: user.user })
    });

    client.on('logout', () =>  {
      this.setState({
        user: null
      });
      window.location.reload();
    });

  }

  render() {
    if(this.state.user === undefined) {
      return null;
    } else if (this.state.user) {
      return (
        <div className="at-absolute at-bottom-0 at-flex at-flex-column at-flex-nowrap at-left-0 at-overflow-hidden at-right-0 at-top-0">
          <div className="at-flex at-flex-column at-flex-nowrap at-full-height">
            <BrowserRouter>
              <Suspense fallback={<></>}>
                <Switch>
                  <Route exact path="/" render={(props) => <> <NavBar user={this.state.user} {...props}/> < Frontpage user={this.state.user} {...props}/> </>} />
                  <Route path="/following" render={(props) => <> <NavBar user={this.state.user} {...props}/> <Following user={this.state.user} {...props}/> </>} />
                  <Route path="/login" render={(props) => <> <Auth user={this.state.user} login={true} register={false} {...props} /> </>} />
                  <Route path="/(register|signup)" render={(props) => <><Auth user={this.state.user} login={false} register={true} {...props}/></>} />
                  <Route path="/user/recovery" render={(props) => <><Recovery {...props}/></>} />
                  <Route path="/dashboard" render={(props) => <><NavBar user={this.state.user} {...props}/> <Dashboard user={this.state.user} {...props}/></>} />
                  <Route exact path="/settings" render={() => <Redirect to="/settings/profile" />} />
                  <Route path="/settings/:subPath" render={(props) => <><NavBar user={this.state.user} {...props}/> <Settings user={this.state.user} {...props}/></>} />
                  <Route path="/help" render={(props) => <><NavBar user={this.state.user} {...props}/> <Help user={this.state.user} {...props}/></>} />
                  <Route path="/:channel" render={(props) => <><NavBar user={this.state.user} {...props}/> <ChannelPage user={this.state.user} {...props}/></>} />
                  <Route path="/p/tos" render={(props) => <><TermsOfService {...props}/></>} />
                  <Route path="/p/privacy" render={(props) => <><PrivacyPolicy {...props}/></>} />
                  <Route path="/p/dmca" render={(props) => <><DMCA {...props}/></>} />
                  <Route path="/p/help" render={(props) => <><NavBar user={this.state.user} {...props}/> <Help user={this.state.user} {...props}/></>} />
                  <Route render={(props) => <><NavBar user={this.state.user} {...props}/><NotFound/></>} /> />
                </Switch>
              </Suspense>
            </BrowserRouter>
          </div>
        </div>
      )
    } else if(this.state.user == null) {
      return (
        <div className="at-absolute at-bottom-0 at-flex at-flex-column at-flex-nowrap at-left-0 at-overflow-hidden at-right-0 at-top-0">
          <div className="at-flex at-flex-column at-flex-nowrap at-full-height">
            <BrowserRouter>
              <Suspense fallback={<></>}>
                <Switch>
                  <Route exact path="/" render={(props) => <><NavBar {...props}/><Frontpage {...props}/></>} />
                  <Route path="/following" render={(props) => <><NavBar {...props}/><Following {...props}/></>} />
                  <Route path="/login" render={(props) => <><Auth login={true} register={false} {...props}/></>} />
                  <Route path="/(register|signup)" render={(props) => <><Auth login={false} register={true} {...props}/></>} />
                  <Route path="/user/recovery" render={(props) => <><Recovery {...props}/></>} />
                  <Route path="/dashboard" render={(props) => <><NavBar {...props}/><Dashboard {...props}/></>} />
                  <Route path="/settings" render={(props) => <><NavBar {...props}/><Settings {...props}/></>} />
                  <Route path="/settings/:subPath" render={(props) => <><NavBar {...props}/><Settings {...props}/></>} />
                  <Route path="/help" render={(props) => <><NavBar {...props}/><Help {...props}/></>} />
                  <Route path="/:channel" render={(props) => <><NavBar {...props}/><ChannelPage {...props}/></>} />
                  <Route path="/p/tos" render={(props) => <><TermsOfService {...props}/></>} />
                  <Route path="/p/privacy" render={(props) => <><PrivacyPolicy {...props}/></>} />
                  <Route path="/p/dmca" render={(props) => <><DMCA {...props}/></>} />
                  <Route path="/p/help" render={(props) => <><NavBar {...props}/><Help {...props}/></>} />
                  <Route render={(props) => <><NavBar {...props}/><NotFound {...props}/></>} /> />
                </Switch>
              </Suspense>
            </BrowserRouter>
          </div>
        </div>
      )
    }
  }
}

export default App;