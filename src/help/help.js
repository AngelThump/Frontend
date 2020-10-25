import React, { Component, lazy, Suspense } from 'react';
import './help.css';
const TopNav = lazy(() => import("./topnav"));
const HowToStream = lazy(() => import("./howtostream"));
const Ingests = lazy(() => import("./ingests"));

class Help extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    document.title = "AngelThump - Help"
  }

  render() {
    const subPath = this.props.match.params.subPath;
    return (
      <div style={{overflow: "auto", color:"#efeff1"}}>
        <header className="page-header">
          <Suspense fallback={<></>}>
            <TopNav/>
          </Suspense>
        </header>
        <div className="stream-first">
          <Suspense fallback={<></>}>
            {subPath === 'stream' ? <HowToStream/> : subPath === 'ingests' ? <Ingests /> : <HowToStream/>}
          </Suspense>
        </div>
      </div>
    )
  }
}

export default Help;