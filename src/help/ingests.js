import React, { Component } from 'react';
import {PageView, initGA} from '../tracking';

class Ingests extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    document.title = 'AngelThump - Ingests'
    this.fetchIngests();
    initGA();
    PageView();
  }

  fetchIngests = async () => {
    const ingest_list = await fetch("https://api.angelthump.com/v2/ingests", {
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
        return data.ingestServers;
      })
      .catch((e) => {
        console.error(e);
      });

      this.setState({
        ingests: ingest_list.map((ingest, i) => (
          <div className="ingest_list" key={i}>
            <div className="brick brick--pd-lg brick--theme-grey mg-b-1 pd-b-1 clearfix">
              <div className="float-left">
                <h4 className="strong">
                  {ingest.location}
                </h4>
              </div>
              <p className="float-right" style={{lineHeight: "2.5rem"}}>{`${ingest.rtmpUrl}`}</p>
              <div>&nbsp;</div>
            </div>
          </div>
        )),
      });
  }

  render() {
    if(this.state.ingests === undefined) {
      return null;
    }
    return (
      <div className="help-container">
        <div className="pd-t-10 pd-b-10">
          <h2 className="section__headline center">AngelThump Ingests</h2>
          <h4 className="section__subline center half-width half-width--center">
            These are the locations where AngelThump has a POP (point of presence) available for you to send broadcasts.
            Select an ingest location closest to you, since this will help with stability and reliability of your stream.
          </h4>
        </div>
        <div className="section section--dark">
          <div className="help-container">
            <h2 class="section__headline pd-t-6 center">Recommended Ingest Endpoint</h2>
            <div className="brick brick--pd-lg brick--theme-grey mg-b-1 pd-b-1 clearfix">
              <div className="float-left">
                <h4 className="strong">
                  Auto (Picks the nearest ingest server)
                </h4>
              </div>
              <p className="float-right" style={{lineHeight: "2.5rem"}}>{`rtmp://ingest.angelthump.com/live`}</p>
              <div>&nbsp;</div>
            </div>
          </div>
        </div>
        <div className="section section--dark">
          <div className="help-container">
            <h2 class="section__headline pd-t-6 center">Available Ingest Endpoints</h2>
            {this.state.ingests}
          </div>
        </div>
      </div>
    )
  }
}

export default Ingests;