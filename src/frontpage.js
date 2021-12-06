import React, { useEffect } from "react";
import { PageView, initGA } from "./tracking";
import AdSense from "react-adsense";
import { useMediaQuery, makeStyles, Container, Typography, Link } from "@material-ui/core";
import SimpleBar from "simplebar-react";
import ErrorBoundary from "./ErrorBoundary";

const useStyles = makeStyles(() => ({
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
}));

export default function Frontpage(props) {
  const classes = useStyles();
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [streams, setStreams] = React.useState([]);

  useEffect(() => {
    document.title = "Browse - AngelThump";
    initGA();
    PageView();
    const fetchStreams = async () => {
      let stream_list;
      await fetch("https://api.angelthump.com/v3/streams", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) return console.error(data.msg);

          stream_list = data;
        })
        .catch((e) => {
          console.error(e);
        });

      if (!stream_list) return;

      setStreams(
        stream_list.map((stream, i) => {
          return (
            <div key={i} className={classes.paper}>
              <div className={classes.lower}>
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                  <div
                    style={{
                      flexGrow: 1,
                      flexShrink: 1,
                      width: "100%",
                      order: 2,
                      minWidth: 0,
                    }}
                  >
                    <div style={{ marginBottom: "0.1rem" }}>
                      <Link className={classes.title} href={`/${stream.user.username}`} variant="caption">
                        {stream.user.title}
                      </Link>
                    </div>
                    <div style={{ marginBottom: "0.1rem" }}>
                      <Link className={classes.username} href={`/${stream.user.username}`} variant="caption">
                        {stream.user.display_name}
                      </Link>
                    </div>
                  </div>
                  <div
                    style={{
                      flexGrow: 0,
                      flexShrink: 0,
                      order: 1,
                      flexBasis: "2.8rem",
                    }}
                  >
                    <Link href={`/${stream.user.username}`}>
                      <img alt="" width="40px" height="40px" src={stream.user.profile_logo_url} className={classes.avatar}></img>
                    </Link>
                  </div>
                </div>
              </div>
              <div className={classes.imageBox}>
                <Link href={`/${stream.user.username}`}>
                  <img alt={`${stream.user.username}'s thumbnail`} src={stream.thumbnail_url} className={!stream.user.nsfw ? classes.image : classes.imageBlur} />
                  {stream.user.nsfw ? (
                    <Typography className={classes.nsfw} variant="h2">
                      {`NSFW`}
                    </Typography>
                  ) : (
                    <></>
                  )}
                </Link>
                <div className={classes.corners}>
                  <div className={classes.bottomLeft}>
                    <Typography variant="caption" className={classes.cornerText}>
                      {`${stream.viewer_count} viewers`}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      );
    };
    fetchStreams();
    return;
  }, [props.user, classes]);

  if (props.user === undefined) return null;

  return (
    <Container maxWidth={false} disableGutters style={{ height: "100%" }}>
      <SimpleBar className={classes.scroll}>
        {props.displayAds ? (
          <div id="top-ad-banner" className={classes.topAdBanner}>
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
          </div>
        ) : (
          <></>
        )}
        <Typography className={classes.header} variant="h4">
          {`Browse`}
        </Typography>
        <div className={classes.root}>
          {streams}
          {props.displayAds ? (
            <div id="square-ad-banner" className={classes.squareAd}>
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
            </div>
          ) : (
            <></>
          )}
        </div>
      </SimpleBar>
    </Container>
  );
}
