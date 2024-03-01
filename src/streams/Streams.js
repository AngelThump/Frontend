import React, { useEffect, useState } from "react";
import { PageView, initGA } from "../tracking";
import AdSense from "react-adsense";
import { useMediaQuery, Typography, Grid, Box } from "@mui/material";
import SimpleBar from "simplebar-react";
import ErrorBoundary from "../utils/ErrorBoundary";
import Loading from "../utils/Loading";
import Stream from "./Stream";

const classes = {
  root: {
    marginLeft: "2rem",
    marginTop: "2rem",
    display: "flex",
    flexWrap: "wrap",
    height: "100%",
  },
  topAdBanner: {
    textAlign: "center",
    marginBottom: "0px",
    marginTop: "30px",
    border: "0pt none",
  },
  header: {
    marginTop: "3rem",
    marginLeft: "2rem",
    color: "#fff",
  },
  paper: {
    maxWidth: "30%",
    width: "18rem",
    flex: "0 0 auto",
    padding: "0 .5rem",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    color: "#a6a6a6",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
  },
  username: {
    color: "#a6a6a6",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
  },
  imageBox: {
    overflow: "hidden",
    height: 0,
    paddingTop: "56.25%",
    position: "relative",
    order: 1,
  },
  image: {
    verticalAlign: "top",
    maxWidth: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  imageBlur: {
    verticalAlign: "top",
    maxWidth: "100%",
    textAlign: "center",
    WebkitFilter: "blur(8px)",
    msFilter: "blur(8px)",
    filter: "blur(8px)",
    border: "none",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  avatar: {
    borderRadius: "25px",
    borderCollapse: "separate",
  },
  nsfw: {
    color: "#c50000",
    fontWeight: "900",
    top: "50%",
    left: "50%",
    position: "absolute",
    transform: "translate(-50%, -50%)",
  },
  lower: {
    order: 2,
    marginTop: "1rem",
    marginBottom: "2rem",
  },
  scroll: {
    height: "calc(100% - 4rem)",
    position: "relative",
  },
  corners: {
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  bottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  cornerText: {
    color: "#fff",
    backgroundColor: "rgba(0,0,0,.6)",
    padding: "0 .2rem",
  },
  squareAd: {
    textAlign: "center",
    marginBottom: "0px",
    marginTop: "15px",
  },
};

export default function Frontpage(props) {
  const { user, displayAds } = props;
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [streams, setStreams] = useState([]);

  useEffect(() => {
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

  if (user === undefined) return null;

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
                <Box className={classes.squareAd}>
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
