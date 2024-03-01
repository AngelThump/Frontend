import React from "react";
import TermsOfService from "./pages/tos";
import PrivacyPolicy from "./pages/privacypolicy";
import DMCA from "./pages/dmca";
import NotFound from "./utils/NotFound";
import SimpleBar from "simplebar-react";
import "./css/pages.css";
import { useParams } from "react-router-dom";

export default function Pages() {
  const { page } = useParams();
  return (
    <SimpleBar style={{ minHeight: 0, height: "100%" }}>
      <>{page === "tos" ? <TermsOfService /> : page === "privacy" ? <PrivacyPolicy /> : page === "dmca" ? <DMCA /> : <NotFound />}</>
    </SimpleBar>
  );
}
