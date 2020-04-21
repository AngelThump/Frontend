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
    
  }

  handleTitleInput = (evt) => {
    this.setState({title: evt.target.value, savedTitle: false})
  }

  saveTitle = async (evt) => {
    if(evt) {
      evt.preventDefault();
    }

    const { accessToken } = await client.get("authentication");

    await fetch("https://api.angelthump.com:8081/v2/user/title", {
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
      return null;
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
                          <iframe width="1024px" height="576px" marginHeight="0" marginWidth="0" frameBorder="0" allowtransparency="true" allowFullScreen src={userPlayerUrl} scrolling="true"></iframe>
                        </div>
                        <div className="at-flex at-flex-row">
                          <div className="at-flex at-flex-grow-1 at-flex-row">
                            <div className="at-flex at-flex-column at-mg-t-1 at-mg-b-1 at-mg-l-1">
                              <h5>{user.title}</h5>
                            </div>
                          </div>
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