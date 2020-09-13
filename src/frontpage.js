import React, { Component } from "react";
import "simplebar";
import {PageView, initGA} from './tracking';
import AdSense from 'react-adsense';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ErrorBoundary from './ErrorBoundary';

class Frontpage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Streams: []
    };
  }

  componentDidMount() {
    document.title = "AngelThump - Browse";
    this.fetchStreams();
    this.intervalID = setInterval(this.fetchStreams, 60000);

    if (this.props.user === undefined) {
      this.setState({ anon: true });
    } else if (this.props.user) {
      this.setState({ anon: false });
    }

    initGA();
    PageView();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  fetchStreams = async () => {
    const stream_list = await fetch("https://api.angelthump.com/v2/streams", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          return console.error(data.errorMsg);
        }
        return data.streams;
      })
      .catch((e) => {
        console.error(e);
      });

    let new_stream_list = stream_list;
    if (this.props.user) {
      if (this.props.user.type !== "admin") {
        new_stream_list = new_stream_list.filter(
          (stream) => !stream.user.unlist
        );
      }
    } else {
      new_stream_list = new_stream_list.filter(
        (stream) => !stream.user.unlist
      );
    }

    this.setState({
      Streams: new_stream_list.map((stream, i) => (
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
                              <a
                                className="at-full-width at-interactive at-link at-link--hover-underline-none at-link--inherit"
                                href={`/${stream.username}`}
                              >
                                <div className="at-align-items-start at-flex">
                                  <h3
                                    className="at-ellipsis at-font-size-5"
                                    title={stream.user.title}
                                  >
                                    {stream.user.title}
                                  </h3>
                                </div>
                              </a>
                            </div>
                          </div>
                          <div className="at-media-card-meta__links">
                            <div>
                              <p className="at-c-text-alt-2 at-ellipsis">
                                <a
                                  className="at-interactive at-link at-link--hover-underline-none at-link--inherit"
                                  href={`/${stream.username}`}
                                >
                                  {stream.username}
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="at-flex-grow-0 at-flex-shrink-0 at-item-order-1 at-media-card-meta__image at-mg-r-1">
                          <a
                            className="at-interactive at-link"
                            href={`/${stream.username}`}
                          >
                            <div className="at-aspect at-aspect--align-center">
                              <div
                                className="at-aspect__spacer"
                                style={{ paddingBottom: "100%" }}
                              ></div>
                              <figure
                                aria-label={stream.user.display_name}
                                className="at-avatar at-avatar--size-40"
                              >
                                <img
                                  className="at-block at-border-radius-rounded at-image at-image-avatar"
                                  style={{ width: "40px", height: "40px" }}
                                  alt={stream.user.display_name}
                                  src={stream.user.profile_logo_url}
                                ></img>
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
                          <a
                            className="at-interactive at-link"
                            href={`/${stream.username}`}
                          >
                            <div className="at-c-text-overlay">
                              <div className="at-relative">
                                <div className="at-aspect at-aspect--align-top">
                                  <div
                                    className="at-aspect__spacer"
                                    style={{ paddingBottom: "56.25%" }}
                                  ></div>
                                  <img
                                    className={
                                      stream.user.nsfw
                                        ? "at-image at-blur"
                                        : "at-image"
                                    }
                                    alt={stream.user.display_name}
                                    src={stream.thumbnail_url}
                                  ></img>
                                  {stream.user.nsfw ? (
                                    <div className="nsfw-text">
                                      <h1 className="nsfw-text-height">NSFW</h1>
                                    </div>
                                  ) : null}
                                </div>
                                <div className="at-absolute at-full-height at-full-width at-left-0 at-media-card-image__corners at-top-0">
                                  <div className="at-absolute at-left-0 at-mg-1 at-top-0">
                                    <div className="at-align-center at-border-radius-medium at-c-text-overlay at-channel-status-text-indicator at-font-size-6 at-inline-block at-pd-x-05">
                                      <p className="at-strong at-upcase at-white-space-nowrap">
                                        LIVE
                                      </p>
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
      )),
    });
  };

  render() {
    if (this.state.anon === undefined) {
      return null;
    }

    let displayAd = true;
    if(!this.state.anon) {
      let isUserPatron, isAngel, user = this.props.user;

      isAngel = user.angel;
      if(!user.patreon) {
        isUserPatron = false;
      } else {
        isUserPatron = user.patreon.isPatron;
      }

      if(isUserPatron || isAngel) {
        displayAd = false;
      }
    }

    if(this.state.hasError) {
      displayAd = false;
    }

    return (
      <div className="at-flex at-flex-nowrap at-full-height at-overflow-hidden at-relative">
        <main className="at-flex at-flex-column at-flex-grow-1 at-full-height at-full-width at-overflow-hidden at-relative at-z-default twilight-main">
          <div className="root-scrollable scrollable-area" data-simplebar>
            <div className="root-scrollable__wrapper at-full-width at-relative">
              <div className="browse-root-page__wrapper">
                {displayAd ? 
                  <div
                    id="top-ad-banner"
                    style={{
                      textAlign: "center",
                      marginBottom: "0px",
                      marginTop: "30px",
                  }}>
                    <div style={{border: "0pt none"}}> 
                      {this.props.isMobile ?
                        <ErrorBoundary>
                          <AdSense.Google
                            key={Math.floor(Math.random() * Math.floor(100))}
                            client='ca-pub-8093490837210586'
                            slot='3667265818'
                            style={{
                              border: "0px",
                              verticalAlign: "bottom",
                              width: "300px",
                              height: "100px"
                            }}
                            format=''
                          />
                        </ErrorBoundary>
                      :
                        <ErrorBoundary>
                          <AdSense.Google
                            key={Math.floor(Math.random() * Math.floor(100))}
                            client='ca-pub-8093490837210586'
                            slot='3667265818'
                            style={{
                              border: "0px",
                              verticalAlign: "bottom",
                              width: "728px",
                              height: "90px"
                            }}
                            format=''
                          /> 
                        </ErrorBoundary>
                      }
                    </div>
                  </div>
                : null}
                <div className="at-mg-l-3 at-mg-t-3">
                  <h1>Browse</h1>
                </div>
                <div className="at-pd-b-3 at-pd-t-2">
                  <div className="at-pd-x-3">
                    <div
                      className="at-flex-shrink-0"
                      style={{ position: "relative", float: "left", width: "90%" }}
                    >
                      <div className="at-flex-wrap at-tower at-tower--300 at-tower--gutter-xs">
                        {this.state.Streams.length > 0
                          ? this.state.Streams
                          : null}
                          {displayAd ?
                          <div
                            id="ad-banner"
                            style={{
                              textAlign: "center",
                              marginBottom: "0px",
                              marginTop: "15px",
                            }}>
                            <ErrorBoundary>
                              <AdSense.Google
                                key={Math.floor(Math.random() * Math.floor(100))}
                                client='ca-pub-8093490837210586'
                                slot='7846377499'
                                style={{
                                  width: "300px",
                                  height: "200px"
                                }}
                                format=''
                              />
                            </ErrorBoundary>
                          </div>
                        : null}
                      </div>
                    </div>
                  </div>
                  {displayAd ? 
                      <div
                      id="right-ad-banner"
                      style={{
                        marginRight: "15px",
                        marginLeft: "90%"
                      }}>
                        <ErrorBoundary>
                          <AdSense.Google
                            key={Math.floor(Math.random() * Math.floor(100))}
                            client='ca-pub-8093490837210586'
                            slot='7507288537'
                            style={{
                              width: "160px",
                              height: "600px"
                            }}
                            format=''
                          />
                        </ErrorBoundary>
                      </div>
                    : null}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

const withMyHook = (Component) => {
  return function WrappedComponent(props) {
    const isMobile = useMediaQuery('(max-width: 800px)');
    return <Component {...props} isMobile={isMobile} />;
  }
}

export default withMyHook(Frontpage);
