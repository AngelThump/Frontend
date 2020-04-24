import React, { Component } from 'react';
import "simplebar";
import client from "./feathers";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    document.title = "AngelThump - Dashboard";

    fetch(`https://api.angelthump.com/v2/streams/${this.props.user.username}`,{
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      if(data.error || data.code > 400 || data.status > 400) {
        return console.error(data.errorMsg);
      }
      this.setState({live: data.type === 'live', stream: data})
    }).catch(e => {
      console.error(e);
    })

    setInterval(()=> {
      fetch(`https://api.angelthump.com/v2/streams/${this.props.user.username}`,{
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(data => {
        if(data.error || data.code > 400 || data.status > 400) {
          return console.error(data.errorMsg);
        }
        this.setState({live: data.type === 'live', stream: data})
      }).catch(e => {
        console.error(e);
      })
    }, 30000)
  }

  handleTitleInput = (evt) => {
    this.setState({title: evt.target.value, savedTitle: false})
  }

  saveTitle = async (evt) => {
    if(evt) {
      evt.preventDefault();
    }

    const { accessToken } = await client.get("authentication");

    await fetch("https://api.angelthump.com/v2/user/title", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: this.state.title,
      }),
    })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.error || data.code > 400) {
        return console.error(data);
      }
      this.setState({savedTitle: true})
    })
    .catch((e) => {
      console.error(e);
    });
  }

  render() {
    if (this.props.user === undefined) {
      window.location.href = '/login';
    }
    const user = this.props.user;
    const userPlayerUrl = `https://player.angelthump.com/?channel=${user.username}`;
    return (
      <div style={{height: "100%", width: "100%"}}>
        <main className="dashboard-page">
          <div className="dashboard-page__scrollable-area scrollable-area scrollable-area--suppress-scroll-x" data-simplebar>
            <div className="dashboard-page__content at-full-width">
              <div className="at-flex at-full-height at-full-width">
                <div className="at-full-height at-full-width at-relative">
                  <div className="at-absolute at-full-height at-full-width">
                    <div className="edit-broadcast-scrollable scrollable-area scrollable-area--suppress-scroll-x" data-simplebar>
                      <div className="at-flex at-flex-column at-full-height">
                        <div className="at-flex at-flex-column at-full-height at-pd-2">
                          <div className="at-mg-b-2 at-pd-b-0">
                            <div className="at-flex-grow-1 at-font-size-6 at-form-group at-relative">
                              <div>
                                <div className="at-mg-b-05">
                                  <label className="at-form-label">Title</label>
                                </div>
                                <textarea onChange={this.handleTitleInput} className="at-block at-border-radius-medium at-font-size-6 at-full-width at-textarea at-textarea--no-resize" maxLength="140" placeholder="Enter a title" rows="3" defaultValue={user.title}></textarea>
                              </div>
                            </div>
                          </div>
                          <div className="at-flex at-flex-row at-full-width at-justify-content-end at-pd-b-2 at-pd-x-2">
                            <div className="at-mg-r-1"></div>
                            <button 
                              className={this.state.title && !this.state.savedTitle
                              ? "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"
                              : "at-align-items-center at-align-middle at-border-bottom-left-radius-medium at-border-bottom-right-radius-medium at-border-top-left-radius-medium at-border-top-right-radius-medium at-core-button at-core-button--disabled at-core-button--primary at-full-width at-inline-flex at-interactive at-justify-content-center at-overflow-hidden at-relative"}
                              disabled={this.state.title && !this.state.savedTitle ? null : 'disabled'}
                              onClick={this.saveTitle}
                            >
                              <div className="at-align-items-center at-core-button-label at-flex at-flex-grow-0">
                                <div className="at-flex-grow-0">{this.state.savedTitle ? "Updated" : "Update"}</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="at-c-background-base at-flex at-flex-column at-full-height">
                        <div className="at-relative video-player-wrapper">
                          <iframe title="Live Stream" width="1024px" height="576px" marginHeight="0" marginWidth="0" frameBorder="0" allowtransparency="true" allowFullScreen src={userPlayerUrl} scrolling="true"></iframe>
                        </div>
                        <div className="at-flex at-flex-row">
                          <div className="at-flex at-flex-grow-1 at-flex-row">
                            <div className="at-flex at-flex-column at-mg-t-1 at-mg-b-1 at-mg-l-1">
                              <h5>{user.title}</h5>
                            </div>
                          </div>
                          {!this.state.live ? null :
                          <div className="at-align-items-start at-flex">
                            <div className="channel-info-bar__viewers-count-wrapper at-flex">
                              <div className="at-c-text-alt-2 at-flex at-font-size-5">
                                <div className="channel-info-bar__viewers-wrapper at-c-text-live at-inline-flex">
                                  <div className="at-inline-flex at-relative at-tooltip-wrapper">
                                    <div className="at-align-items-center at-inline-flex at-stat at-pd-r-2">
                                      <div className="at-align-items-center at-inline-flex at-stat__icon">
                                        <div className="at-align-items-center at-full-width at-icon at-icon--fill at-inline-flex">
                                          <div className="at-aspect at-aspect--align-top">
                                            <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                                            <svg class="at-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fillRule="evenodd" d="M5 7a5 5 0 116.192 4.857A2 2 0 0013 13h1a3 3 0 013 3v2h-2v-2a1 1 0 00-1-1h-1a3.99 3.99 0 01-3-1.354A3.99 3.99 0 017 15H6a1 1 0 00-1 1v2H3v-2a3 3 0 013-3h1a2 2 0 001.808-1.143A5.002 5.002 0 015 7zm5 3a3 3 0 110-6 3 3 0 010 6z" clipRule="evenodd"></path></g></svg>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="at-mg-l-05 at-stat__value">
                                        {this.state.stream.viewer_count}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>}
                        </div>
                      </div>
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

export default Dashboard;