import React, { Component } from 'react';
import biblethump from '../assets/biblethump_small.png';
import SimpleBar from 'simplebar-react';

class ChannelPageError extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    document.title = "AngelThump - Not Found"
  }

  render() {
    return (
      <div className="at-flex at-flex-nowrap at-full-height at-overflow-hidden at-relative">
        <main className="at-flex at-flex-column at-flex-grow-1 at-full-height at-full-width at-overflow-hidden at-relative at-z-default">
          <SimpleBar className="root-scrollable scrollable-area">
            <div className="root-scrollable__wrapper at-full-width at-relative">  
              <div className="core-error at-align-items-center at-c-text-alt-2 at-flex at-full-height at-full-width at-justify-content-center">
                <div className="core-error__container at-align-items-center at-flex-nowrap at-inline-flex">
                  <div className="at-c-text-alt-2 at-flex-shrink-0 at-mg-r-2">
                    <figure className="at-logo">
                      <img className="at-logo__img" width="120px" height="103px" src={biblethump} alt=""></img>
                    </figure>
                  </div>
                  <div className="core-error__message-container at-flex at-flex-column">
                    <p className="at-font-size-4">{this.props.errorMsg ? this.props.errorMsg : "Whatever you are looking for does not exist."}</p>
                    <div className="at-mg-t-1">
                      <a href="/" className="at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative">
                        <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                          <div className="at-flex-grow-0">
                            Browse
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SimpleBar>
        </main>
      </div>
    )
  }
}
  
export default ChannelPageError;