import React, { Component, lazy, Suspense } from 'react';
import 'simplebar/dist/simplebar.css';
import './css/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import client from "./feathers";
const Frontpage = lazy(() => import("./frontpage"));
const Following = lazy(() => import("./following"));
const NavBar = lazy(() => import("./navbar"));
const NotFound = lazy(() => import("./notfound"));
const Recovery = lazy(() => import("./recovery"));
const Auth = lazy(() => import("./auth"));
const Dashboard = lazy(() => import("./dashboard"));
const Settings = lazy(() => import("./settings"));
const Connections = lazy(() => import("./connections"));
const Help = lazy(() => import("./pages/help"));
const ChannelPage = lazy(() => import("./channel-page"));
const TermsOfService = lazy(() => import("./pages/tos"));
const PrivacyPolicy = lazy(() => import("./pages/privacypolicy"));
const DMCA = lazy(() => import("./pages/dmca"));

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
          <BrowserRouter>
            <Suspense fallback={<></>}>
              <Switch>
                <Route exact path="/" render={(props) => <> <NavBar user={this.state.user}/> < Frontpage user={this.state.user} {...props}/> </>} />
                <Route path="/following" render={(props) => <> <NavBar user={this.state.user}/> <Following user={this.state.user} {...props}/> </>} />
                <Route path="/login" render={(props) => <> <Auth user={this.state.user} login={true} register={false} {...props} /> </>} />
                <Route path="/(register|signup)" render={(props) => <><Auth user={this.state.user} login={false} register={true} {...props}/></>} />
                <Route path="/user/recovery" render={(props) => <><Recovery {...props}/></>} />
                <Route path="/dashboard" render={(props) => <><NavBar user={this.state.user}/> <Dashboard user={this.state.user} {...props}/></>} />
                <Route path="/dashboard/settings" render={(props) => <><NavBar user={this.state.user}/> <Settings user={this.state.user} {...props}/></>} />
                <Route path="/dashboard/connections" render={(props) => <><NavBar user={this.state.user}/> <Connections user={this.state.user} {...props}/></>} />
                <Route path="/help" render={(props) => <><NavBar user={this.state.user}/> <Help user={this.state.user} {...props}/></>} />
                <Route path="/:channel" render={(props) => <><NavBar user={this.state.user}/> <ChannelPage user={this.state.user} {...props}/></>} />
                <Route path="/p/tos" render={() => <><TermsOfService/></>} />
                <Route path="/p/privacy" render={() => <><PrivacyPolicy/></>} />
                <Route path="/p/dmca" render={() => <><DMCA/></>} />
                <Route path="/p/help" render={(props) => <><NavBar user={this.state.user}/> <Help user={this.state.user} {...props}/></>} />
                <Route render={() => <><NavBar user={this.state.user}/><NotFound/></>} /> />
              </Switch>
            </Suspense>
          </BrowserRouter>
        </div>
      )
    } else if(this.state.user == null) {
      return (
        <div className="at-absolute at-bottom-0 at-flex at-flex-column at-flex-nowrap at-left-0 at-overflow-hidden at-right-0 at-top-0">
          <BrowserRouter>
            <Suspense fallback={<></>}>
              <Switch>
                <Route exact path="/" render={() => <><NavBar/><Frontpage/></>} />
                <Route path="/following" render={() => <><NavBar/><Following/></>} />
                <Route path="/login" render={() => <><Auth login={true} register={false}/></>} />
                <Route path="/(register|signup)" render={() => <><Auth login={false} register={true}/></>} />
                <Route path="/user/recovery" render={() => <><Recovery/></>} />
                <Route path="/dashboard" render={() => <><NavBar/><Dashboard/></>} />
                <Route path="/dashboard/settings" render={() => <><NavBar/><Settings/></>} />
                <Route path="/dashboard/connections" render={() => <><NavBar/><Connections/></>} />
                <Route path="/help" render={() => <><NavBar/><Help/></>} />
                <Route path="/:channel" render={(props) => <><NavBar/><ChannelPage {...props}/></>} />
                <Route path="/p/tos" render={() => <><TermsOfService/></>} />
                <Route path="/p/privacy" render={() => <><PrivacyPolicy/></>} />
                <Route path="/p/dmca" render={() => <><DMCA/></>} />
                <Route path="/p/help" render={() => <><NavBar/><Help/></>} />
                <Route render={() => <><NavBar/><NotFound/></>} /> />
              </Switch>
            </Suspense>
          </BrowserRouter>
        </div>
      )
    }
  }
}

export default App;