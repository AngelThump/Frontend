import React, { Component } from 'react';
import "simplebar";

class Frontpage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Streams: []
    };
  }

  componentDidMount() {
    this.fetchStreams();
  }

  fetchStreams = async () => {
    const stream_list =
    await fetch('https://api.angelthump.com:8081/v2/streams',{
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
        return data.streams;
    }).catch(e => {
        console.error(e);
    })

    this.setState({
      Streams: stream_list.map((stream, i) => (
        <div key={i}>
          <div className="at-mg-b-2">
            <div>
              <div className="at-pd-b-2">
                <div>
                  <article className="at-flex at-flex-column at-mg-0">
                    <div className="at-item-order-2 at-mg-t-1">
                      <div className="at-flex at-flex-nowrap">
                        <div className="at-flex-grow-1 at-flex-shrink-1 at-full-width at-item-order-2 at-media-card-meta__text-container">
                          <div className="at-media-card-meta__title">
                            <div className="at-c-text-alt">
                              <a className="at-full-width at-interactive at-link at-link--hover-underline-none at-link--inherit" href={`/${stream.username}`}>
                                <div className="at-align-items-start at-flex">
                                  <h3 className="at-ellipsis at-font-size-5" title={stream.title}>{stream.title}</h3>
                                </div>
                              </a>
                            </div>
                          </div>
                          <div className="at-media-card-meta__links">
                            <div>
                              <p className="at-c-text-alt-2 at-ellipsis">
                                <a className="at-interactive at-link at-link--hover-underline-none at-link--inherit" href={`/${stream.username}`}>{stream.username}</a>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="at-flex-grow-0 at-flex-shrink-0 at-item-order-1 at-media-card-meta__image at-mg-r-1">
                          <a className="at-interactive at-link" href={`/${stream.username}`}>
                            <div className="at-aspect at-aspect--align-center">
                              <div className="at-aspect__spacer" style={{paddingBottom: "100%"}}></div>
                              <figure aria-label={stream.display_name} className="at-avatar at-avatar--size-40">
                                <img className="at-block at-border-radius-rounded at-image at-image-avatar" style={{width: "40px", height: "40px"}} alt={stream.display_name} src={stream.profile_logo_url}></img>
                              </figure>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="at-item-order-1">
                      <div className="at-hover-accent-effect at-relative">
                        <div className="at-absolute at-hover-accent-effect__corner at-hover-accent-effect__corner--top at-left-0 at-top-0"></div>
                        <div className="at-absolute at-bottom-0 at-hover-accent-effect__corner at-hover-accent-effect__corner--bottom at-right-0"></div>
                        <div className="at-absolute at-bottom-0 at-hover-accent-effect__edge at-hover-accent-effect__edge--left at-left-0 at-top-0"></div>
                        <div className="at-absolute at-bottom-0 at-hover-accent-effect__edge at-hover-accent-effect__edge--bottom at-left-0 at-right-0"></div>
                        <div className="at-hover-accent-effect__children">
                          <a className="at-interactive at-link" href={`/${stream.username}`}>
                            <div className="at-c-text-overlay">
                              <div className="at-relative">
                                <div className="at-aspect at-aspect--align-top">
                                  <div className="at-aspect__spacer" style={{width: "293px", height: "165px"}}></div>
                                  <img className="at-image" alt={stream.display_name} style={{width: "293px", height: "165px"}} src={stream.thumbnail_url}></img>
                                </div>
                                <div className="at-absolute at-full-height at-full-width at-left-0 at-media-card-image__corners at-top-0">
                                  <div className="at-absolute at-left-0 at-mg-1 at-top-0">
                                    <div className="at-align-center at-border-radius-medium at-c-text-overlay at-channel-status-text-indicator at-font-size-6 at-inline-block at-pd-x-05">
                                      <p className="at-strong at-upcase at-white-space-nowrap">LIVE</p>
                                    </div>
                                  </div>
                                  <div className="at-absolute at-bottom-0 at-left-0 at-mg-1">
                                    <div className="at-align-items-center at-border-radius-small at-c-background-overlay at-c-text-overlay at-flex at-font-size-6 at-justify-content-center at-media-card-stat">
                                      <p>{stream.viewer_count} viewers</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    });
  }

  render() {
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
                  <h1>Browse</h1>
                </div>
                <div className="at-pd-b-3 at-pd-t-2 at-pd-x-3">
                  <div className="at-flex-shrink-0" style={{position: "relative"}}>
                    <div className="at-flex-wrap at-tower at-tower--300 at-tower--gutter-xs">
                      {this.state.Streams.length > 0 ? this.state.Streams : "Nothing to see here :("}
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

export default Frontpage;