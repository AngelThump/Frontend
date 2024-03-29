import React from "react";
import "../css/help.css";
import HowToStream from "./howtostream";
import Ingests from "./ingests";
import Simplebar from "simplebar-react";
import { useParams } from "react-router-dom";
import TopNav from "./TopNav";

export default function Help() {
  const { subPath } = useParams();

  return (
    <>
      <TopNav />
      <Simplebar style={{ minHeight: 0, height: "100%" }}>
        <>{subPath === "stream" ? <HowToStream /> : subPath === "ingests" ? <Ingests /> : <HowToStream />}</>
      </Simplebar>
    </>
  );
}
