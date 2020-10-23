import React, { Component } from 'react';
import ChannelPageError from './channel/channel_page_error';
import 'simplebar';
import './css/channel_page.css'
import {PageView, initGA} from './tracking';
import AdSense from 'react-adsense';
import ErrorBoundary from './ErrorBoundary';
import useMediaQuery from '@material-ui/core/useMediaQuery';

class ChannelPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    document.title = `AngelThump - ${this.props.match.params.channel}`
    this.fetchApi();

    if (this.props.user === undefined) {
      this.setState({ anon: true });
    } else if (this.props.user) {
      this.setState({ anon: false });
    }

    initGA();
    PageView();

    this.intervalID = setInterval(this.fetchApi, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  fetchApi = async () => {
    fetch(`https://api.angelthump.com/v2/streams/${this.props.match.params.channel}`,{
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
      document.title = `AngelThump - ${data.user.display_name}`
      this.setState({live: data.type === 'live', stream: data, channel: data.user})
    }).catch(e => {
      console.error(e);
    })
  }

  render() {
    if (this.state.stream === undefined) {
      return <ChannelPageError/>;
    }

    const channel = this.state.channel;

    /*
    if(!channel.patreon && channel.angel) {
      return <ChannelPageError errorMsg={`${channel.display_name} is not a Tier 3 Patron. This feature is locked to Tier 3 Patreon subscribers for now.`}/>
    }*/

    let isPatron, tier;
    if(!channel.patreon) {
      isPatron = false;
      tier = 0;
    } else {
      isPatron = channel.patreon.isPatron;
      tier = channel.patreon.tier;
    }

    /*
    if(!channel.angel && !isPatron && tier < 3) {
      return <ChannelPageError errorMsg={`${channel.display_name} is not a Tier 3 Patron. This feature is locked to Tier 3 Patreon subscribers for now.`}/>
    }*/

    if(channel.banned) {
      return <ChannelPageError errorMsg={`${channel.display_name} is banned`}/>
    }

    if(!this.state.stream) {
      return null;
    }
    const stream = this.state.stream;

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

      if(isUserPatron || isPatron || isAngel) {
        displayAd = false;
      }
    }

    if(this.state.hasError) {
      displayAd = false;
    }

    return (
      <div className="at-flex at-flex-nowrap at-full-height at-overflow-hidden at-relative">
        <main className="at-flex at-flex-column at-flex-grow-1 at-full-height at-full-width at-overflow-hidden at-relative at-z-default">
          <div className="at-full-width container" id="page-content">
            <div>
              <div className="at-flex at-flex-nowrap at-full-height at-full-width at-justify-content-center">
                <div className="at-full-height at-full-width at-pd-l-05 at-pd-r-05 at-sm-pd-l-1 at-sm-pd-r-1" style={{position: "relative"}}>
                  <div className="at-align-items-center at-flex at-full-height at-full-width at-justify-content-between">
                    <div className="channel-header__left at-align-items-center at-flex at-flex-nowrap at-full-height">
                      <div className="channel-header__banner-toggle channel-header__user channel-header__user--selected at-flex">
                        <div className="channel-header-user-tab__user-content at-align-items-center at-flex at-full-height">
                          <div className="channel-header__user-avatar channel-header__user-avatar--active at-align-items-stretch at-flex at-mg-r-05 at-sm-mg-r-1">
                            <div className="channel-header__avatar-dropdown at-relative">
                              <figure aria-label={channel.display_name} className="at-avatar at-avatar--size-36">
                                <img className="at-block at-border-radius-rounded at-image at-image-avatar" alt={channel.display_name} src={channel.profile_logo_url}></img>
                              </figure>
                            </div>
                          </div>
                          <p className="at-c-text-inherit at-font-size-5 at-white-space-nowrap at-ellipsis at-channel-page-name">{channel.display_name}</p>
                          {this.state.live ? 
                            <div className="live-indicator at-mg-l-05 at-sm-mg-l-1 at-visible">
                              <div className="at-inline-flex at-relative at-tooltip-wrapper">
                                <div className="at-align-center at-border-radius-medium at-c-text-overlay at-channel-status-text-indicator at-font-size-6 at-inline-block at-pd-x-05">
                                  <p className="at-strong at-upcase at-white-space-nowrap">LIVE</p>
                                </div>
                              </div>
                            </div> 
                          : null}
                        </div>
                      </div>
                    </div>

                    <div className="at-align-items-center at-flex at-flex-grow-1 at-flex-wrap at-full-height at-justify-content-center">
                      <span style={{marginRight: "0.5rem", marginBottom: "0.1rem", marginLeft: "0.5rem"}}>
                        <div style={{height: "100%", width: "100%"}}>
                          <div className="at-flex at-flex-row">
                            <div className="sunlight-tile at-flex at-flex-column at-full-height at-full-width at-justify-content-center at-pd-x-1 at-pd-y-05">
                              <p className="sunlight-tile-body-text at-c-text-inherit at-ellipsis at-font-size-4" title={stream.viewer_count ? stream.viewer_count : 0}>{stream.viewer_count ? stream.viewer_count : 0}</p>
                              <p className="sunlight-tile__title at-c-text-alt-2 at-ellipsis at-font-size-6">Viewers</p>
                            </div>
                          </div>
                        </div>
                      </span>
                      <span style={{marginRight: "0.5rem", marginBottom: "0.1rem", marginLeft: "0.5rem"}}>
                        <div style={{height: "100%", width: "100%"}}>
                          <div className="at-flex at-flex-row">
                            <div className="sunlight-tile at-flex at-flex-column at-full-height at-full-width at-justify-content-center at-pd-x-1 at-pd-y-05">
                              <p className="sunlight-tile-body-text at-c-text-inherit at-ellipsis at-font-size-4" title={channel.followers}>{channel.followers}</p>
                              <p className="sunlight-tile__title at-c-text-alt-2 at-ellipsis at-font-size-6">Followers</p>
                            </div>
                          </div>
                        </div>
                      </span>
                      <span style={{marginRight: "0.5rem", marginBottom: "0.1rem", marginLeft: "0.5rem"}}>
                        <div style={{height: "100%", width: "100%"}}>
                          <div className="at-flex at-flex-row">
                            <div className="sunlight-tile at-flex at-flex-column at-full-height at-full-width at-justify-content-center at-pd-x-1 at-pd-y-05">
                              <p className="sunlight-tile-body-text at-c-text-inherit at-ellipsis at-font-size-4" title={channel.followers}>{channel.followers}</p>
                              <p className="sunlight-tile__title at-c-text-alt-2 at-ellipsis at-font-size-6">Views</p>
                            </div>
                          </div>
                        </div>
                      </span>
                    </div>

                    <div className="channel-header__right at-align-items-center at-flex at-flex-nowrap at-justify-content-end">
                      <div className="at-flex at-mg-r-1">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="stream-panel" className='left' style={!channel.twitch && !this.props.isMobile ? {width: 'calc(100% - 300px)'} : (!channel.angel && !isPatron && tier < 2 && !this.props.isMobile) ? {width: 'calc(100% - 300px)'} : void 0 }>
              <div id="stream-wrap">
                <iframe title={`${channel.display_name}'s live stream`} width="100%" height="100%" marginHeight="0" marginWidth="0" frameBorder="0" allowtransparency="true" allowFullScreen src={`https://player.angelthump.com/?channel=${channel.username}`} scrolling="true"></iframe>
              </div>
            </div>
            <div id="chat-panel" className='right' style={!channel.twitch && !this.props.isMobile ? {width: '300px'} : (!channel.angel && !isPatron && tier < 2 && !this.props.isMobile) ? {width: '300px'} : void 0 }>
              <div id="chat-wrap">
              {
                !channel.twitch ? 
                <div>
                  {/*<h2 style={{textAlign:"center", paddingTop: "15%"}}>{`${channel.display_name} needs to link twitch to their account to show chat!`}</h2>*/}
                  {displayAd ?
                    <div
                    id="ad-banner"
                    style={{
                      textAlign: "center",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}>
                      <ErrorBoundary>
                        {this.props.isMobile ?
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
                        :
                          <AdSense.Google
                            key={Math.floor(Math.random() * Math.floor(100))}
                            client='ca-pub-8093490837210586'
                            slot='7507288537'
                            style={{
                              width: "300px",
                              height: "600px"
                            }}
                            format=''
                          />
                        }
                      </ErrorBoundary>
                    </div>
                  : null}

                  {displayAd ?
                    <div
                    id="ad-banner"
                    style={{
                      textAlign: "center",
                      marginBottom: "0px",
                      marginTop: "15px",
                    }}>
                      {this.props.isMobile ? null :
                        <ErrorBoundary>
                          <AdSense.Google
                            key={Math.floor(Math.random() * Math.floor(100))}
                            client='ca-pub-8093490837210586'
                            slot='7846377499'
                            style={{
                              width: "250px",
                              height: "250px"
                            }}
                            format=''
                          />
                        </ErrorBoundary>
                      }
                    </div>
                  : null}
                </div>
              :
               (!channel.angel && !isPatron && tier < 2) ? 
                <div>
                  {/*<h2 style={{textAlign:"center", paddingTop: "15%"}}>{`${channel.display_name} is not a tier 2 (broadcaster) patron.`}</h2>*/}
                  {displayAd ?
                    <div
                    id="ad-banner"
                    style={{
                      textAlign: "center",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}>
                      <ErrorBoundary>
                        {this.props.isMobile ?
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
                        :
                          <AdSense.Google
                            key={Math.floor(Math.random() * Math.floor(100))}
                            client='ca-pub-8093490837210586'
                            slot='7507288537'
                            style={{
                              width: "300px",
                              height: "600px"
                            }}
                            format=''
                          />
                        }
                      </ErrorBoundary>
                    </div>
                  : null}

                  {displayAd ?
                    <div
                    id="ad-banner"
                    style={{
                      textAlign: "center",
                      marginBottom: "0px",
                      marginTop: "15px",
                    }}>
                      {this.props.isMobile ? null :
                        <ErrorBoundary>
                          <AdSense.Google
                            key={Math.floor(Math.random() * Math.floor(100))}
                            client='ca-pub-8093490837210586'
                            slot='7846377499'
                            style={{
                              width: "250px",
                              height: "250px"
                            }}
                            format=''
                          />
                        </ErrorBoundary>
                      }
                    </div>
                  : null}
                </div>
              :
                <div className="at-full-height">
                  {displayAd ?
                    <div className="at-full-height">
                      <div
                        id="ad-banner"
                        style={{
                          textAlign: "center",
                          marginBottom: "0px",
                          marginTop: "0px",
                      }}>
                        <ErrorBoundary>
                          {this.props.isMobile ?
                            <AdSense.Google
                              key={Math.floor(Math.random() * Math.floor(100))}
                              client='ca-pub-8093490837210586'
                              slot='3667265818'
                              style={{
                                width: "300px",
                                height: "50px"
                              }}
                              format=''
                            />
                          :
                            <AdSense.Google
                              key={Math.floor(Math.random() * Math.floor(100))}
                              client='ca-pub-8093490837210586'
                              slot='3667265818'
                              style={{
                                width: "468px",
                                height: "60px"
                              }}
                              format=''
                            />
                          }
                        </ErrorBoundary>
                      </div>
                      
                      <div style={this.props.isMobile ? {height: `calc(100% - 50px)`} : {height: `calc(100% - 60px)`}}>
                        <iframe title={`${channel.display_name}'s twitch chat`} id="chat-frame" scrolling="no" className="stream-element" seamless="seamless" src={`https://www.twitch.tv/embed/${channel.twitch.channel}/chat?darkpopout&parent=angelthump.com`}></iframe>
                      </div>
                    </div>
                  :
                    <iframe title={`${channel.display_name}'s twitch chat`} id="chat-frame" scrolling="no" className="stream-element" seamless="seamless" src={`https://www.twitch.tv/embed/${channel.twitch.channel}/chat?darkpopout&parent=angelthump.com`}></iframe>
                  }
                </div>
              }
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

const withMyHook = (Component) => {
  return function WrappedComponent(props) {
    const isMobile = useMediaQuery('(max-width: 800px)');
    return <Component {...props} isMobile={isMobile} />;
  }
}

export default withMyHook(ChannelPage);