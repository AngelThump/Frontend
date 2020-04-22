import React, { Component } from 'react';
import TermsOfService from './pages/tos';
import PrivacyPolicy from './pages/privacypolicy';
import DMCA from './pages/dmca';
import NotFound from './notfound';
import "simplebar";
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
        <div data-simplebar>
          <TermsOfService/>
        </div>
      )
    } else if(page === 'privacy') {
      return (
        <div data-simplebar>
          <PrivacyPolicy/>
        </div>
      )
    } else if (page === 'dmca') {
      return (
        <div data-simplebar>
          <DMCA/>
        </div>
      )
    } else {
      return <NotFound/>;
    }
  }
}

export default Pages;