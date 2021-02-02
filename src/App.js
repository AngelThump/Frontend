import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import client from "./feathers";
import Frontpage from './frontpage';
import NavBar from './navbar';
import NotFound from './notfound';
import Recovery from './recovery';
import Auth from './auth';
import Dashboard from './dashboard';
import Pages from './pages';
import ChannelPage from './channel-page';
import Settings from './settings';
import Help from './help/help';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayAds: true
    };
  }

  componentDidMount() {
    client.authenticate().catch(() => this.setState({ user: null }));

    client.on('authenticated', user => {
      this.setState({ user: user.user, displayAds: user.user.patreon ? user.user.patreon.isPatron ? true : false : false});
    });

    client.service("users").on("patched", (user) => {
      if (user.id === this.state.user.id) {
        client.service("users").get(user.id)
        .then(user => {
          this.setState({user: user});
        })
        .catch(e => {
          console.error(e);
        })
      }
    });

    client.on('logout', () =>  {
      this.setState({
        user: null
      });
      window.location.href = '/';
    });
  }

  render() {
    if(this.state.user === undefined) {
      return null;
    }
    return (
      <div className="at-root">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={(props) => <> <NavBar user={this.state.user} {...props}/> < Frontpage user={this.state.user} displayAds={this.state.displayAds} {...props}/> </>} />
            <Route exact path="/login" render={(props) => <> <Auth user={this.state.user} {...props} /> </>} />
            <Route exact path="/(register|signup)" render={(props) => <><Auth user={this.state.user} {...props}/></>} />
            <Route exact path="/user/recovery" render={(props) => <><Recovery {...props}/></>} />
            <Route exact path="/dashboard" render={(props) => <><NavBar user={this.state.user} {...props}/> <Dashboard user={this.state.user} {...props}/></>} />
            <Route exact path="/settings" render={() => <Redirect to="/settings/profile" />} />
            <Route exact path="/settings/:subPath" render={(props) => <><NavBar user={this.state.user} {...props}/> <Settings user={this.state.user} {...props}/></>} />
            <Route exact path="/help" render={() => <Redirect to="/help/stream" />} />
            <Route exact path="/help/:subPath" render={(props) => <><Help {...props}/></>} />
            <Route exact path="/p/:pages" render={(props) => <><Pages {...props}/></>} />
            <Route exact path="/:channel" render={(props) => <><NavBar user={this.state.user} {...props}/> <ChannelPage user={this.state.user} displayAds={this.state.displayAds} {...props}/></>} />
            <Route exact path="/:channel/embed" render={(props) => window.location.replace(`https://player.angelthump.com?channel=${props.match.params.channel}`)} />
            <Route render={(props) => <><NavBar user={this.state.user} {...props}/><NotFound/></>} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;