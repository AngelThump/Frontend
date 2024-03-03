import client from "../auth/feathers";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Typography, Box, Button, IconButton, TextField, Switch, Link, Alert, Paper } from "@mui/material";
import { DeleteOutline, Check } from "@mui/icons-material";
import { useState, useRef } from "react";
import CustomLink from "../utils/CustomLink";

const acceptOnlyImages = ["image/jpg", "image/jpeg", "image/png"];
const DEFAULT_OFFLINE_VIDEO_BANNER = "https://images-angelthump.nyc3.cdn.digitaloceanspaces.com/default_offline_banner.png";

export default function ChannelSettings(props) {
  const { user } = props;
  const [state, setState] = useState({
    uploadError: false,
    uploadSuccess: false,
    uploadMessage: "",
    stream_password: "",
    savedStreamPassword: false,
    showStreamPassword: false,
    offline_video_banner: user.offline_banner_url,
  });
  const fileInput = useRef();

  const deleteVideoBanner = async (evt) => {
    if (evt) evt.preventDefault();
    const confirmDialog = window.confirm("Delete your offline video banner?");
    if (!confirmDialog) return;

    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/offline-banner`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          console.error(data);
          return;
        }
        setState({ ...state, offline_video_banner: DEFAULT_OFFLINE_VIDEO_BANNER });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!acceptOnlyImages.includes(file.type)) {
        setState({ ...state, uploadError: true, uploadSuccess: false, uploadMessage: "File must be JPEG, PNG" });
        return;
      }
      const fileSize = file.size / (1024 * 1024);
      if (fileSize > 10) {
        setState({ ...state, uploadError: true, uploadSuccess: false, uploadMessage: "File size needs to be less than 10 MB" });
        return;
      }
      const imageDataUrl = await readFile(file);
      const result = await uploadImage(imageDataUrl);
      if (!result) {
        setState({ ...state, uploadError: true, uploadSuccess: false, uploadMessage: "Server encountered an error!" });
        return;
      }

      setState({ ...state, offline_video_banner: result.imageURL, uploadError: false, uploadMessage: "Successfully updated your offline video banner.", uploadSuccess: true });
      fileInput.current.value = "";
    }
  };

  const resetStreamKey = async () => {
    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/stream-key`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          console.error(data);
          return;
        }
        setState({ ...state, didReset: true });
        setTimeout(() => setState({ ...state, didReset: false }), 3000);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleNSFWToggle = async () => {
    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/nsfw`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        nsfw: !user.nsfw,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400) {
          console.error(data);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handlePasswordProtectToggle = async () => {
    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/password_protect`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        password_protect: !user.password_protect,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400) {
          return console.error(data);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleUnlistToggle = async () => {
    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/unlist`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        unlist: !user.unlist,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400) {
          return console.error(data);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSaveStreamPassword = async (evt) => {
    if (evt) evt.preventDefault();

    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/stream_password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        stream_password: state.stream_password,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400) {
          return console.error(data);
        }
        setState({ ...state, savedStreamPassword: true });
        setTimeout(() => setState({ ...state, savedStreamPassword: false }), 1500);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const privilegedUser = (user.patreon && user.patreon.isPatron && user.patreon.tier >= 2) || user.type === "admin" || user.angel;

  return (
    <Box sx={{ maxWidth: "55rem", mt: 2 }}>
      <Box>
        <Typography variant="h6" color="text.primary">
          Offline Video Banner
        </Typography>
        <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
          This is displayed on the player when your channel is offline.
        </Typography>
        <Paper sx={{ borderColor: "#2a2a2a", border: "1px solid hsla(0,0%,100%,.1)", mb: 3, borderRadius: "4px", mt: 2 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ mr: 2, position: "relative", maxHeight: "100%", width: "160px", height: "90px" }}>
                <img style={{ width: "100%" }} alt="" src={state.offline_video_banner} />
              </Box>
              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <input onChange={onFileChange} ref={(ref) => (fileInput.current = ref)} type="file" accept="image/*" style={{ display: "none" }} />
                {(state.uploadError || state.uploadSuccess) && (
                  <Alert sx={{ mb: "1rem" }} severity={state.uploadSuccess ? "success" : "error"}>
                    {state.uploadMessage}
                  </Alert>
                )}
                <Box sx={{ display: "flex" }}>
                  <Button onClick={() => fileInput.current.click()} variant="contained" color="primary">
                    Update
                  </Button>
                  <IconButton onClick={deleteVideoBanner} sx={{ ml: 1 }}>
                    <DeleteOutline color="primary" />
                  </IconButton>
                </Box>
                <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                  Must be JPEG, PNG and cannot exceed 10MB.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box>
        <Typography variant="h6" color="text.primary">
          Channel Settings
        </Typography>
        <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
          Change your channel preferences here
        </Typography>
        <Paper sx={{ borderColor: "#2a2a2a", border: "1px solid hsla(0,0%,100%,.1)", mb: 3, borderRadius: "4px", mt: 2 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flexShrink: 0, width: "10rem", mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Stream Key
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <TextField
                      onFocus={(evt) => evt.target.select()}
                      margin="none"
                      readOnly
                      fullWidth
                      value={state.showStreamKey ? user.stream_key : "•••••••••••••••••••••••••••••••••••••••••••"}
                      size="small"
                    />
                  </Box>
                  <CopyToClipboard
                    text={user.stream_key}
                    onCopy={() => {
                      setState({ ...state, copied: true });
                      setTimeout(() => setState({ ...state, copied: false }), 1500);
                    }}
                  >
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: state.copied ? "#66bb6a!important" : "#03a9f4",
                        color: "rgba(0, 0, 0, 0.87)!important",
                        mr: 1,
                      }}
                      disabled={state.copied}
                      variant="contained"
                      color="primary"
                    >
                      {state.copied ? <Check /> : "Copy"}
                    </Button>
                  </CopyToClipboard>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={resetStreamKey}
                    disabled={state.didReset}
                    sx={{ backgroundColor: state.didReset ? "#66bb6a!important" : "#7986cb", color: "rgba(0, 0, 0, 0.87)!important" }}
                  >
                    {state.didReset ? <Check /> : "Reset"}
                  </Button>
                </Box>
                <Button sx={{ minHeight: 0, minWidth: 0, padding: 0 }} size="small" onClick={() => setState({ ...state, showStreamKey: !state.showStreamKey })} variant="text">
                  {state.showStreamKey ? "Hide" : "Show"}
                </Button>
                <Typography sx={{ mt: 0.3 }} variant="body2" color="text.secondary">
                  Never share your stream key with anyone or show it on stream!
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", mt: 2 }}>
              <Box sx={{ flexShrink: 0, width: "10rem", mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  NSFW Content
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <Switch edge="start" checked={user.nsfw} onChange={handleNSFWToggle} color="primary" />
                  </Box>
                </Box>
                <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                  Please enable this setting if your stream contains content that may be inappropriate. Not doing so will result in an account suspension. You may never broadcast extreme sexual
                  activity, extreme nudity, threats or extreme violence. Doing so will result in immediate, irrevocable termination of your account. Please make sure your content will comply with the
                  Terms of Service before broadcasting
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", mt: 2 }}>
              <Box sx={{ flexShrink: 0, width: "10rem", mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Password Protection
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <Switch edge="start" checked={user.password_protect} onChange={handlePasswordProtectToggle} color="primary" disabled={!privilegedUser} />
                  </Box>
                </Box>
                <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                  {`Enable this setting if you want users to enter a password when they enter your stream. This is only available for tier 2 and above patrons! `}
                  <CustomLink href="https://patreon.com/join/angelthump" target="_blank" rel="noreferrer">
                    Join Patreon Today!
                  </CustomLink>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", mt: 2 }}>
              <Box sx={{ flexShrink: 0, width: "10rem", mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Stream Password
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <TextField
                      type={state.showStreamPassword ? "text" : "password"}
                      disabled={!privilegedUser}
                      onFocus={(evt) => evt.target.select()}
                      margin="none"
                      fullWidth
                      size="small"
                      defaultValue={user.stream_password}
                      onChange={(evt) => setState({ ...state, stream_password: evt.target.value })}
                    />
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={handleSaveStreamPassword}
                    disabled={state.savedStreamPassword || state.stream_password.length === 0 || !privilegedUser}
                    sx={{ backgroundColor: state.savedStreamPassword ? "#66bb6a!important" : "#7986cb", color: "rgba(0, 0, 0, 0.87)!important" }}
                  >
                    {state.savedStreamPassword ? <Check /> : "Save"}
                  </Button>
                </Box>
                <Button sx={{ minHeight: 0, minWidth: 0, padding: 0 }} size="small" onClick={() => setState({ ...state, showStreamPassword: !state.showStreamPassword })} variant="text">
                  {state.showStreamPassword ? "Hide" : "Show"}
                </Button>
                <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                  {`Enter a stream password when you have password protect on. This is only available for tier 2 and above patrons! `}
                  <CustomLink href="https://patreon.com/join/angelthump" target="_blank" rel="noreferrer">
                    Join Patreon Today!
                  </CustomLink>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", mt: 2 }}>
              <Box sx={{ flexShrink: 0, width: "10rem", mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Unlist your stream
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <Switch edge="start" checked={user.unlist} onChange={handleUnlistToggle} color="primary" disabled={!privilegedUser} />
                  </Box>
                </Box>
                <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                  {`Unlist your stream from the public front page. This is only available for tier 2 and above patrons! `}
                  <CustomLink href="https://patreon.com/join/angelthump" target="_blank" rel="noreferrer">
                    Join Patreon Today!
                  </CustomLink>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

const readFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      (e) => {
        resolve(e.target.result);
      },
      false
    );
    reader.readAsDataURL(file);
  });
};

const uploadImage = async (dataURL) => {
  return await client
    .service("uploads/offline-banners")
    .create({
      uri: dataURL,
    })
    .catch((e) => {
      console.error(e);
    });
};
