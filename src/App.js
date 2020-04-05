import React, { Component } from 'react';
import 'simplebar/dist/simplebar.css';
import './css/App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import client from "./feathers";
import LazyLoad from "react-lazyload";
import Frontpage from './frontpage';
import Following from './following';
import NavBar from './navbar';
import NotFound from './notfound';
import Recovery from './recovery';
import Auth from './auth';
import Dashboard from './dashboard';
import Pages from './pages';
import ChannelPage from './channel-page';
import Settings from './settings';

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

    client.service('users')
    .on('patched', user => {
      this.setState({ user: user })
    })

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
              <LazyLoad>
                <Switch>
                  <Route exact path="/" render={(props) => <> <NavBar user={this.state.user} {...props}/> < Frontpage user={this.state.user} {...props}/> </>} />
                  <Route path="/following" render={(props) => <> <NavBar user={this.state.user} {...props}/> <Following user={this.state.user} {...props}/> </>} />
                  <Route path="/login" render={(props) => <> <Auth user={this.state.user} login={true} register={false} {...props} /> </>} />
                  <Route path="/(register|signup)" render={(props) => <><Auth user={this.state.user} login={false} register={true} {...props}/></>} />
                  <Route path="/user/recovery" render={(props) => <><Recovery {...props}/></>} />
                  <Route path="/dashboard" render={(props) => <><NavBar user={this.state.user} {...props}/> <Dashboard user={this.state.user} {...props}/></>} />
                  <Route exact path="/settings" render={() => <Redirect to="/settings/profile" />} />
                  <Route exact path="/settings/:subPath" render={(props) => <><NavBar user={this.state.user} {...props}/> <Settings user={this.state.user} {...props}/></>} />
                  <Route path="/help" render={(props) => <><NavBar user={this.state.user} {...props}/> <Pages user={this.state.user} {...props}/></>} />
                  <Route path="/:channel" render={(props) => <><NavBar user={this.state.user} {...props}/> <ChannelPage user={this.state.user} {...props}/></>} />
                  <Route path="/p" render={(props) => <> <NavBar user={this.state.user} {...props}/> < Frontpage user={this.state.user} {...props}/> </>} />
                  <Route path="/p/:pages" render={(props) => <><Pages {...props}/></>} />
                  <Route render={(props) => <><NavBar user={this.state.user} {...props}/><NotFound/></>} /> />
                </Switch>
              </LazyLoad>
            </BrowserRouter>
          </div>
        </div>
      )
    } else if(this.state.user == null) {
      return (
        <div className="at-absolute at-bottom-0 at-flex at-flex-column at-flex-nowrap at-left-0 at-overflow-hidden at-right-0 at-top-0">
          <div className="at-flex at-flex-column at-flex-nowrap at-full-height">
            <BrowserRouter>
              <LazyLoad>
                <Switch>
                  <Route exact path="/" render={(props) => <><NavBar {...props}/><Frontpage {...props}/></>} />
                  <Route path="/following" render={(props) => <><NavBar {...props}/><Following {...props}/></>} />
                  <Route path="/login" render={(props) => <><Auth login={true} register={false} {...props}/></>} />
                  <Route path="/(register|signup)" render={(props) => <><Auth login={false} register={true} {...props}/></>} />
                  <Route path="/user/recovery" render={(props) => <><Recovery {...props}/></>} />
                  <Route path="/dashboard" render={(props) => <><NavBar {...props}/><Dashboard {...props}/></>} />
                  <Route path="/settings" render={(props) => <><NavBar {...props}/><Settings {...props}/></>} />
                  <Route path="/settings/:subPath" render={(props) => <><NavBar {...props}/><Settings {...props}/></>} />
                  <Route path="/help" render={(props) => <><NavBar {...props}/><Pages {...props}/></>} />
                  <Route path="/:channel" render={(props) => <><NavBar {...props}/><ChannelPage {...props}/></>} />
                  <Route path="/p" render={(props) => <> <NavBar user={this.state.user} {...props}/> < Frontpage user={this.state.user} {...props}/> </>} />
                  <Route path="/p/:pages" render={(props) => <><Pages {...props}/></>} />
                  <Route render={(props) => <><NavBar {...props}/><NotFound {...props}/></>} /> />
                </Switch>
              </LazyLoad>
            </BrowserRouter>
          </div>
        </div>
      )
    }
  }
}

export default App;