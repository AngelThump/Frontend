import React, { Component } from 'react';
import 'simplebar/dist/simplebar.css';
import './css/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Frontpage from './frontpage';
import Following from './following';
import NavBar from './navbar';
import client from './feathers';
import NotFound from './notfound';
import Recovery from './recovery';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import Settings from './settings';
import Connections from './connections';
import Help from './pages/help';
import ChannelPage from './channel-page';
import TermsOfService from './pages/tos';
import PrivacyPolicy from './pages/privacypolicy';
import DMCA from './pages/dmca';

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
        <BrowserRouter>
          <div className="at-absolute at-bottom-0 at-flex at-flex-column at-flex-nowrap at-left-0 at-overflow-hidden at-right-0 at-top-0">
            <NavBar user={this.state.user}></NavBar>
            <Switch>
              <Route exact path="/" render={(props) => <Frontpage user={this.state.user} {...props}/>} />
              <Route path="/following" render={(props) => <Following user={this.state.user} {...props}/>} />
              <Route path="/login" render={(props) => <Login user={this.state.user} {...props}/>} />
              <Route path="/(register|signup)" render={(props) => <Register user={this.state.user} {...props}/>} />
              <Route path="/user/recovery" render={(props) => <Recovery {...props}/>} />
              <Route path="/dashboard" render={(props) => <Dashboard user={this.state.user} {...props}/>} />
              <Route path="/dashboard/settings" render={(props) => <Settings user={this.state.user} {...props}/>} />
              <Route path="/dashboard/connections" render={(props) => <Connections user={this.state.user} {...props}/>} />
              <Route path="/help" render={(props) => <Help user={this.state.user} {...props}/>} />
              <Route path="/:channel" render={(props) => <ChannelPage user={this.state.user} {...props}/>} />
              <Route path="/p/tos" component={TermsOfService} />
              <Route path="/p/privacy" component={PrivacyPolicy} />
              <Route path="/p/dmca" component={DMCA} />
              <Route path="/p/help" render={(props) => <Help user={this.state.user} {...props}/>} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      )
    } else if(this.state.user == null) {
      return (
        <BrowserRouter>
          <div className="at-absolute at-bottom-0 at-flex at-flex-column at-flex-nowrap at-left-0 at-overflow-hidden at-right-0 at-top-0">
            <NavBar/>
            <Switch>
              <Route exact path="/" component={Frontpage} />
              <Route path="/following" component={Following} />
              <Route path="/login" component={Login} />
              <Route path="/(register|signup)" component={Register} />
              <Route path="/user/recovery" component={Recovery} />
              <Route path="/dashboard" component={Dashboard}/>
              <Route path="/dashboard/settings" component={Settings}/>
              <Route path="/dashboard/connections" component={Connections}/>
              <Route path="/help" component={Help} />
              <Route path="/:channel" component={ChannelPage} />
              <Route path="/p/tos" component={TermsOfService} />
              <Route path="/p/privacy" component={PrivacyPolicy} />
              <Route path="/p/dmca" component={DMCA} />
              <Route path="/p/help" component={Help} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      )
    }
  }
}

export default App;