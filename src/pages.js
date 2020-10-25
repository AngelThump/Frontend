import React, { Component } from 'react';
import TermsOfService from './pages/tos';
import PrivacyPolicy from './pages/privacypolicy';
import DMCA from './pages/dmca';
import NotFound from './notfound';
import SimpleBar from 'simplebar-react';
import './css/pages.css';

class Pages extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    
  }

  render() {
    const page = this.props.match.params.pages.toLowerCase();
    if(page === 'tos') {
      return (
        <SimpleBar style={{height: "100%"}}>
          <TermsOfService/>
        </SimpleBar>
      )
    } else if(page === 'privacy') {
      return (
        <SimpleBar style={{height: "100%"}}>
          <PrivacyPolicy/>
        </SimpleBar>
      )
    } else if (page === 'dmca') {
      return (
        <SimpleBar style={{height: "100%"}}>
          <DMCA/>
        </SimpleBar>
      )
    } else {
      return <NotFound/>;
    }
  }
}

export default Pages;