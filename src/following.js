import React, { Component } from 'react';
import {PageView, initGA} from './tracking';

class Following extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    document.title = "AngelThump - Following"
    initGA();
    PageView();
  }

  render() {
    if (this.props.user === undefined) {
      window.location.href = '/login';
      return null;
    }
    //const user = this.props.user;
    return (
      <div className="at-flex at-flex-nowrap at-full-height at-overflow-hidden at-relative">
        <main className="at-flex at-flex-column at-flex-grow-1 at-full-height at-full-width at-overflow-hidden at-relative at-z-default twilight-main">
          <div className="root-scrollable scrollable-area" data-simplebar>
            <div className="root-scrollable__wrapper at-full-width at-relative">
              <div className="at-flex at-flex-column at-flex-nowrap at-full-height at-full-width at-pd-x-3">
                <div>
                  <div id="ad-banner" className="" style={{textAlign: "center", marginBottom: "0px", marginTop: "30px", display: "none"}}></div>
                </div>
                <div className="at-mg-l-3 at-mg-t-3">
                  <h1>Following</h1>
                </div>
                <div className="at-pd-b-3 at-pd-t-2 at-pd-x-3">
                  <div className="at-flex-shrink-0" style={{position: "relative"}}>
                    <div className="at-flex-wrap at-tower at-tower--300 at-tower--gutter-xs">
                      WIP. No deadline
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default Following;