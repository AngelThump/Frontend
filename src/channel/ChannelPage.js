import React, { useEffect } from "react";
import ChannelPageError from "./channel_page_error";
import { PageView, initGA } from "../tracking";
import ErrorBoundary from "../utils/ErrorBoundary";
import AdSense from "react-adsense";
import { useMediaQuery, Typography, Box, Divider } from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useParams } from "react-router-dom";
import NumberAbbreviate from "number-abbreviate";
import Loading from "../utils/Loading";
dayjs.extend(duration);

export default function ChannelPage(props) {
  const { user, displayAds } = props;
  const { channelName } = useParams();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const [stream, setStream] = React.useState(null);
  const [channel, setChannel] = React.useState(null);
  const [timer, setTimer] = React.useState(null);

  useEffect(() => {
    initGA();
    PageView();
    const fetchStream = async () => {
      fetch(`${process.env.REACT_APP_API_BASE}/v3/streams?username=${channelName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) return console.error(data.msg);
          if (data.length > 0) {
            setStream(data[0]);
            setTimer(dayjs().unix() - dayjs(data[0].createdAt).unix());
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const fetchUser = async () => {
      fetch(`${process.env.REACT_APP_API_BASE}/v3/users/?username=${channelName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) return console.error(data.msg);
          if (data.length > 0) {
            document.title = `${data[0].display_name} - AngelThump`;
            setChannel(data[0]);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    fetchStream();
    fetchUser();
    const intervalID = setInterval(fetchStream, 30000);
    return () => {
      clearInterval(intervalID);
      setStream(null);
      setChannel(null);
      setTimer(null);
    };
  }, [channelName]);

  useEffect(() => {
    const timerFunc = () => {
      setTimer((timer) => timer + 1);
    };

    const timeout = setInterval(timerFunc, 1000);
    return () => clearInterval(timeout);
  }, []);

  if (user === undefined) return null;
  if (!channel) return <Loading />;
  if (channel.banned) return <ChannelPageError message={`${channel.display_name} is banned`} />;

  return (
    <Box sx={{ height: "100%", width: "100%", minHeight: 0 }}>
      <Box sx={{ display: "flex", flexDirection: isPortrait ? "column" : "row", height: "100%", width: "100%" }}>
        <Box sx={{ display: "flex", height: "100%", width: "100%", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", pl: 1, pr: 1 }}>
            <Box sx={{ alignItems: "center", display: "flex", flex: 1 }}>
              <Box sx={{ position: "relative", maxHeight: "100%", width: "2.5rem", height: "2.5rem" }}>
                <img style={{ borderRadius: "9000px", width: "100%" }} alt="" src={channel.profile_logo_url} />
              </Box>
              <Typography variant="body2" color="#b4b4b4" sx={{ ml: 0.6, fontWeight: "550" }}>
                {channel.display_name}
              </Typography>
            </Box>
            <Box sx={{ alignItems: "center", justifyContent: "center", display: "flex", flex: 1 }}></Box>
            <Box sx={{ alignItems: "center", justifyContent: "end", display: "flex", flex: 1 }}>
              {stream && (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <PersonOutlinedIcon sx={{ fontSize: "1.5rem", ml: 1 }} color="primary" variant="outlined" />
                  <Typography sx={{ ml: 0.3 }} variant="body1">{`${NumberAbbreviate(stream.viewer_count, 1)}`}</Typography>
                  <AccessTimeIcon sx={{ ml: 3, fontSize: "1.5rem" }} color="primary" />
                  <Typography sx={{ ml: 0.3 }} variant="body1">{`${dayjs.duration(timer, "s").format("H:mm:ss")}`}</Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ height: "100%", width: "100%", minHeight: 0, minWidth: 0, display: "flex" }}>
            {displayAds && !isMobile && (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ErrorBoundary>
                  <AdSense.Google
                    key="left-ad-sidebar"
                    client="ca-pub-8093490837210586"
                    slot="7076556696"
                    style={{
                      border: "1px dotted #03a9f4",
                      width: "160px",
                      height: "600px",
                    }}
                    format=""
                  />
                </ErrorBoundary>
              </Box>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
              <iframe
                style={{ border: "0px", margin: "0px", overflow: "hidden", height: "100%", width: "100%" }}
                title="Player"
                allow="autoplay; fullscreen"
                allowtransparency="true"
                allowFullScreen
                src={`https://player.angelthump.com/?channel=${channel.username}`}
                seamless="seamless"
              />
              {displayAds && !isMobile && (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <ErrorBoundary>
                    <AdSense.Google
                      key="top-ad"
                      client="ca-pub-8093490837210586"
                      slot="3667265818"
                      style={{
                        border: "1px dotted #03a9f4",
                        verticalAlign: "bottom",
                        width: "728px",
                        height: "90px",
                      }}
                      format=""
                    />
                  </ErrorBoundary>
                </Box>
              )}
            </Box>
            {!channel.twitch && displayAds && !isMobile && (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ErrorBoundary>
                  <AdSense.Google
                    key="right-ad-sidebar"
                    client="ca-pub-8093490837210586"
                    slot="7507288537"
                    style={{
                      border: "1px dotted #03a9f4",
                      verticalAlign: "bottom",
                      width: "160px",
                      height: "600px",
                    }}
                    format=""
                  />
                </ErrorBoundary>
              </Box>
            )}
          </Box>
        </Box>
        {isPortrait && <Divider />}
        {channel.twitch && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0, minWidth: "20vw" }}>
            <iframe
              style={{ border: "0px", margin: "0px", overflow: "hidden", height: "100%", width: "100%" }}
              title="Twitch Chat"
              height="100%"
              width="100%"
              seamless="seamless"
              src={`https://www.twitch.tv/embed/${channel.twitch.channel}/chat?darkpopout&parent=angelthump.com&parent=www.angelthump.com`}
            />
          </Box>
        )}
        {!channel.twitch && displayAds && isPortrait && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ErrorBoundary>
              <AdSense.Google
                key="bottom-ad"
                client="ca-pub-8093490837210586"
                slot="7846377499"
                style={{
                  border: "1px dotted #03a9f4",
                  verticalAlign: "bottom",
                  width: "336px",
                  height: "280px",
                }}
                format=""
              />
            </ErrorBoundary>
          </Box>
        )}
      </Box>
    </Box>
  );
}
