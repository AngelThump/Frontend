import React from "react";
import "../css/help.css";
import TopNav from "./topnav";
import HowToStream from "./howtostream";
import Ingests from "./ingests";
import Simplebar from "simplebar-react";

export default function Help(props) {
  const subPath = props.match.params.subPath;

  return (
    <div style={{ overflow: "hidden", color: "#efeff1"}}>
      <header className="page-header">
        <TopNav />
      </header>
      <div style={{height: "calc(100% - 12rem)"}}>
        <Simplebar style={{height: "100%"}}>
          {subPath === "stream" ? (
            <HowToStream />
          ) : subPath === "ingests" ? (
            <Ingests />
          ) : (
            <HowToStream />
          )}
        </Simplebar>
      </div>
    </div>
  );
}
