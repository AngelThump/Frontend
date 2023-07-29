import React from "react";
import TermsOfService from "./pages/tos";
import PrivacyPolicy from "./pages/privacypolicy";
import DMCA from "./pages/dmca";
import NotFound from "./utils/NotFound";
import SimpleBar from "simplebar-react";
import "./css/pages.css";

export default function Pages(props) {
  const page = props.match.params.pages.toLowerCase();
  return (
    <SimpleBar style={{ height: "100%" }}>
      {page === "tos" ? (
        <TermsOfService />
      ) : page === "privacy" ? (
        <PrivacyPolicy />
      ) : page === "dmca" ? (
        <DMCA />
      ) : (
        <NotFound />
      )}
    </SimpleBar>
  );
}