import React, { useState } from "react";
import client from "./auth/feathers";
import { Button, TextField, Paper, Box, Typography } from "@mui/material";

export default function Dashboard(props) {
  const { user } = props;
  const [title, setTitle] = useState("");
  //const [stream, setStream] = useState(null);
  const [savedTitle, setSavedTitle] = useState(false);

  /*useEffect(() => {
    const fetchApi = () => {
      fetch(`${process.env.REACT_APP_API_BASE}/v3/streams?username=${user.username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error || data.code > 400 || data.status > 400) {
            return console.error(data.errorMsg);
          }
          setStream(data);
        })
        .catch((e) => {
          console.error(e);
        });
    };
    fetchApi();
    const intervalId = setInterval(fetchApi, 30000);
    return () => clearInterval(intervalId);
  }, [user]);*/

  const handleTitleInput = (evt) => {
    setTitle(evt.target.value);
    setSavedTitle(false);
  };

  const saveTitle = async (evt) => {
    if (evt) evt.preventDefault();
    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_API_BASE}/v2/user/title`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: title,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400) {
          return console.error(data);
        }
        setSavedTitle(true);
        setTimeout(() => {
          setSavedTitle(false);
        }, 1000);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (!user) return (window.location.href = "/login");

  return (
    <Box sx={{ m: 3, display: "flex", height: "100%" }}>
      <Box sx={{ display: "flex", flexDirection: "column", mr: 1, width: "400px" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Edit Stream Info
        </Typography>
        <Paper sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "end" }}>
          <TextField onChange={handleTitleInput} variant="outlined" margin="none" fullWidth maxLength="140" label="Change your Title" rows="3" defaultValue={user.title}></TextField>
          <Box sx={{ mt: 2 }}>
            <Button onClick={saveTitle} variant="contained" color={savedTitle ? "green" : "primary"} disabled={savedTitle}>
              {savedTitle ? "Updated" : "Update"}
            </Button>
          </Box>
        </Paper>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, height: "100%" }}>
        <Paper sx={{ maxWidth: "100%", p: 3, height: "100%" }}>
          <iframe
            title="Player"
            width="100%"
            height="100%"
            marginHeight="0"
            marginWidth="0"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowtransparency="true"
            allowFullScreen
            src={`${process.env.REACT_APP_PLAYER_BASE}/?channel=${user.username}`}
            scrolling="no"
            seamless="seamless"
          />
        </Paper>
      </Box>
    </Box>
  );
}
