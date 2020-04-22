import React, { Component } from 'react';
import 'simplebar/dist/simplebar.css';
import './css/App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import client from "./feathers";
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
              <Switch>
                <Route exact path="/" render={(props) => <> <NavBar user={this.state.user} {...props}/> < Frontpage user={this.state.user} {...props}/> </>} />
                <Route exact path="/following" render={(props) => <> <NavBar user={this.state.user} {...props}/> <Following user={this.state.user} {...props}/> </>} />
                <Route exact path="/login" render={(props) => <> <Auth user={this.state.user} login={true} register={false} {...props} /> </>} />
                <Route exact path="/(register|signup)" render={(props) => <><Auth user={this.state.user} login={false} register={true} {...props}/></>} />
                <Route exact path="/user/recovery" render={(props) => <><Recovery {...props}/></>} />
                <Route exact path="/dashboard" render={(props) => <><NavBar user={this.state.user} {...props}/> <Dashboard user={this.state.user} {...props}/></>} />
                <Route exact path="/settings" render={() => <Redirect to="/settings/profile" />} />
                <Route exact path="/settings/:subPath" render={(props) => <><NavBar user={this.state.user} {...props}/> <Settings user={this.state.user} {...props}/></>} />
                <Route exact path="/help" render={(props) => <><NavBar user={this.state.user} {...props}/><NotFound/></>} />
                <Route exact path="/p/:pages" render={(props) => <><Pages {...props}/></>} />
                <Route exact path="/:channel" render={(props) => <><NavBar user={this.state.user} {...props}/> <ChannelPage user={this.state.user} {...props}/></>} />
                <Route exact path="/:channel/embed" render={(props) => window.location.replace(`https://player.angelthump.com?channel=${props.match.params.channel}`)} />
                <Route render={(props) => <><NavBar user={this.state.user} {...props}/><NotFound/></>} />
              </Switch>
            </BrowserRouter>
          </div>
        </div>
      )
    } else if(this.state.user == null) {
      return (
        <div className="at-absolute at-bottom-0 at-flex at-flex-column at-flex-nowrap at-left-0 at-overflow-hidden at-right-0 at-top-0">
          <div className="at-flex at-flex-column at-flex-nowrap at-full-height">
            <BrowserRouter>
              <Switch>
                <Route exact path="/" render={(props) => <><NavBar {...props}/><Frontpage {...props}/></>} />
                <Route exact path="/following" render={(props) => <><NavBar {...props}/><Following {...props}/></>} />
                <Route exact path="/login" render={(props) => <><Auth login={true} register={false} {...props}/></>} />
                <Route exact path="/(register|signup)" render={(props) => <><Auth login={false} register={true} {...props}/></>} />
                <Route exact path="/user/recovery" render={(props) => <><Recovery {...props}/></>} />
                <Route exact path="/dashboard" render={(props) => <><NavBar {...props}/><Dashboard {...props}/></>} />
                <Route exact path="/settings" render={() => <Redirect to="/settings/profile" />} />
                <Route exact path="/settings/:subPath" render={(props) => <><NavBar {...props}/><Settings {...props}/></>} />
                <Route exact path="/help" render={(props) => <><NavBar {...props}/><NotFound {...props}/></>} />
                <Route exact path="/p/:pages" render={(props) => <><Pages {...props}/></>} />
                <Route exact path="/:channel" render={(props) => <><NavBar {...props}/><ChannelPage {...props}/></>} />
                <Route exact path="/:channel/embed" render={(props) => window.location.replace(`https://player.angelthump.com?channel=${props.match.params.channel}`)} />
                <Route render={(props) => <><NavBar {...props}/><NotFound {...props}/></>} />
              </Switch>
            </BrowserRouter>
          </div>
        </div>
      )
    }
  }
}

export default App;