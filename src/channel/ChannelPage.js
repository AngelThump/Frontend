import React, { useEffect } from "react";
import ChannelPageError from "./channel_page_error";
import { PageView, initGA } from "../tracking";
import ErrorBoundary from "../utils/ErrorBoundary";
import AdSense from "react-adsense";
import { useMediaQuery, Typography, Box, Divider } from "@mui/material";
import dayjs from "dayjs";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useParams } from "react-router-dom";
import NumberAbbreviate from "number-abbreviate";
import Loading from "../utils/Loading";

export default function ChannelPage(props) {
  const { user, displayAds } = props;
  const { channelName } = useParams();
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
            setTimer(dayjs(data[0].createdAt).unix());
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

  const showChat = channel.twitch && channel.patreon ? (channel.patreon.isPatron && channel.patreon.tier > 1) || channel.angel : false;

  return (
    <Box sx={{ height: "100%", width: "100%", minHeight: 0 }}>
      <Box sx={{ display: "flex", flexDirection: isPortrait ? "column" : "row", height: "100%", width: "100%" }}>
        <Box sx={{ display: "flex", height: "100%", width: "100%", flexDirection: "column", alignItems: "flex-start", minWidth: 0, overflow: "hidden", position: "relative" }}>
          <Box sx={{ display: "flex", p: 0.3, alignItems: "center", width: "100%" }}>
            <Box sx={{ alignItems: "center", display: "flex", flex: 1 }}>
              <img alt="" width="40px" height="40px" src={channel.profile_logo_url} style={{ borderRadius: "50%" }} />
              <Typography variant="body2" color="#b4b4b4" sx={{ ml: 0.6, fontWeight: "550" }}>
                {channel.display_name}
              </Typography>
            </Box>
            <Box sx={{ alignItems: "center", justifyContent: "center", display: "flex", flex: 1 }}>
              {stream && (
                <>
                  <PersonIcon fontSize="1rem" color="primary" />
                  <Typography variant="body1">{`${NumberAbbreviate(stream.viewer_count, 1)}`}</Typography>
                  <AccessTimeIcon sx={{ ml: 1 }} fontSize="1rem" color="primary" />
                  <Typography variant="body1">{`${dayjs.unix(timer).format("H:mm:ss")}`}</Typography>
                </>
              )}
            </Box>
            <Box sx={{ alignItems: "center", justifyContent: "end", display: "flex", flex: 1 }}></Box>
          </Box>

          <Box sx={{ height: "100%", width: "100%" }}>
            <iframe
              style={{ border: "0px", margin: "0px", overflow: "hidden" }}
              title="Player"
              width="100%"
              height="100%"
              allow="autoplay; fullscreen"
              allowtransparency="true"
              allowFullScreen
              src={`https://player.angelthump.com/?channel=${channel.username}`}
              seamless="seamless"
            />
          </Box>
        </Box>
        {isPortrait && <Divider />}
        {showChat && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0, minWidth: "20vw" }}>
            <iframe
              style={{ border: "0px", margin: "0px", overflow: "hidden", height: "100%", width: "100%" }}
              title="Twitch Chat"
              height="100%"
              width="100%"
              seamless="seamless"
              src={`https://www.twitch.tv/embed/${channel.twitch.channel}/chat?darkpopout&parent=localhost`}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
