import React, { useEffect, useState } from "react";
import { PageView, initGA } from "../tracking";
import AdSense from "react-adsense";
import { useMediaQuery, Typography, Grid, Box } from "@mui/material";
import SimpleBar from "simplebar-react";
import ErrorBoundary from "../utils/ErrorBoundary";
import Loading from "../utils/Loading";
import Stream from "./Stream";

export default function Frontpage(props) {
  const { user, displayAds } = props;
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    if(!user) return;
    document.title = "Browse - AngelThump";
    initGA();
    PageView();
    const fetchStreams = async () => {
      await fetch(`${process.env.REACT_APP_API_BASE}/v3/streams`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) return console.error(data.msg);
          setStreams(data);
        })
        .catch((e) => {
          console.error(e);
        });
    };
    fetchStreams();
    return;
  }, [user]);

  return (
    <SimpleBar style={{ minHeight: 0, height: "100%" }}>
      <Box sx={{ padding: 1 }}>
        {displayAds && (
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <ErrorBoundary>
              {isMobile ? (
                <AdSense.Google
                  key="top-ad"
                  client="ca-pub-8093490837210586"
                  slot="3667265818"
                  style={{
                    border: "0px",
                    verticalAlign: "bottom",
                    width: "300px",
                    height: "100px",
                  }}
                  format=""
                />
              ) : (
                <AdSense.Google
                  key="top-ad"
                  client="ca-pub-8093490837210586"
                  slot="3667265818"
                  style={{
                    border: "0px",
                    verticalAlign: "bottom",
                    width: "728px",
                    height: "90px",
                  }}
                  format=""
                />
              )}
            </ErrorBoundary>
          </Box>
        )}
        <Box sx={{ pl: !isMobile ? 10 : 5, pr: !isMobile ? 10 : 5, pt: 1, display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "500" }}>
            {`Browse`}
          </Typography>
        </Box>
        <Box sx={{ pl: !isMobile ? 10 : 5, pr: !isMobile ? 10 : 5, pt: 1, display: "flex", flexDirection: "row" }}>
          {streams ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {streams.map((stream, _) => (
                <Stream gridSize={2} key={stream.id} stream={stream} isMobile={isMobile} />
              ))}
              {displayAds && (
                <Box sx={{ textAlign: "center", mt: 1 }}>
                  <ErrorBoundary>
                    <AdSense.Google
                      key="square-ad"
                      client="ca-pub-8093490837210586"
                      slot="7846377499"
                      style={{
                        width: "300px",
                        height: "200px",
                      }}
                      format=""
                    />
                  </ErrorBoundary>
                </Box>
              )}
            </Grid>
          ) : (
            <Loading />
          )}
        </Box>
      </Box>
    </SimpleBar>
  );
}
