import React, { Component } from "react";
import client from "../feathers";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Typography,
  makeStyles,
  Box,
  Button,
  IconButton,
  TextField,
  Switch,
  Link,
} from "@material-ui/core";
import { DeleteOutline, Check } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

class ChannelSettings extends Component {
  constructor(props) {
    super(props);

    this.acceptOnlyImages = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    this.state = {
      uploadError: false,
      uploadSuccess: false,
      uploadMessage: "",
      stream_password: ""
    };
  }

  fileButtonClick = (evt) => {
    if (evt) evt.preventDefault();
    this.fileInput.click();
  };

  handleCloseMessage = () => {
    this.setState({ uploadError: false, uploadSuccess: false });
  };

  deleteVideoBanner = async (evt) => {
    if (evt) evt.preventDefault();

    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/offline-banner", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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

  onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!this.acceptOnlyImages.includes(file.type)) {
        this.setState({
          uploadError: true,
          uploadSuccess: false,
          uploadMessage: "File must be JPEG, PNG, or GIF",
        });
        return console.error("File must be JPEG, PNG, or GIF");
      }
      const fileSize = file.size / (1024 * 1024);
      if (fileSize > 5) {
        this.setState({
          uploadError: true,
          uploadSuccess: false,
          uploadMessage: "File size needs to be less than 5 MB",
        });
        return console.error("File size needs to be less than 5 MB");
      }
      const imageDataUrl = await readFile(file);
      const result = await uploadImage(imageDataUrl);
      if (!result) {
        return this.setState({
          uploadError: true,
          uploadSuccess: false,
          uploadMessage: "Server encountered an error...",
        });
      }
      this.setState({
        uploadError: false,
        uploadMessage: "Successfully updated your offline video banner.",
        uploadSuccess: true,
      });
      this.fileInput.value = "";
    }
  };

  handleShowStreamKey = () => {
    this.setState({ showStreamKey: !this.state.showStreamKey });
  };

  resetStreamKey = async () => {
    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/stream-key", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400) {
          return console.error(data);
        }
        this.setState({ didReset: true }, () => {
          setTimeout(() => this.setState({ didReset: false }), 5000);
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  handleNSFWToggle = async () => {
    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/nsfw", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        nsfw: !this.props.user.nsfw,
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

  handlePasswordProtectToggle = async () => {
    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/password_protect", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        password_protect: this.props.user.password_protect ? !this.props.user.password_protect : true,
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

  handleUnlistToggle = async () => {
    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/unlist", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        unlist: !this.props.user.unlist,
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

  handleStreamPasswordInput = (evt) => {
    this.setState({ stream_password: evt.target.value });
  };

  handleSaveStreamPassword = async (evt) => {
    if (evt) evt.preventDefault();

    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/stream_password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        stream_password: this.state.stream_password,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400) {
          return console.error(data);
        }
        this.setState({ savedStreamPassword: true });
        setTimeout(
          () => this.setState({ savedStreamPassword: false }),
          2000
        );
      })
      .catch((e) => {
        console.error(e);
      });
  };

  render() {
    return (
      <div className={this.props.classes.root}>
        <Typography variant="h6" className={this.props.classes.title}>
          Offline Video Banner
        </Typography>
        <div className={this.props.classes.borderBox}>
          <div className={this.props.classes.box}>
            <Box display="flex" flexDirection="row">
              <div className={this.props.classes.img}>
                <img
                  alt=""
                  className={this.props.classes.banner}
                  src={this.props.user.offline_banner_url}
                />
              </div>
              <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                justifyContent="center"
              >
                {this.state.uploadError ? (
                  <Alert style={{ marginTop: "0.5rem" }} severity="error">
                    {this.state.uploadMessage}
                  </Alert>
                ) : this.state.uploadSuccess ? (
                  <Alert style={{ marginTop: "0.5rem" }} severity="success">
                    {this.state.uploadMessage}
                  </Alert>
                ) : (
                  <></>
                )}
                <input
                  onChange={this.onFileChange}
                  ref={(ref) => {
                    this.fileInput = ref;
                  }}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <Box display="flex">
                  <Button
                    onClick={this.fileButtonClick}
                    size="small"
                    className={this.props.classes.button}
                    variant="contained"
                    color="primary"
                    component="span"
                  >
                    Update
                  </Button>
                  <IconButton
                    onClick={this.deleteVideoBanner}
                    style={{ marginLeft: "1rem" }}
                    className={this.props.classes.icon}
                    aria-label="delete"
                  >
                    <DeleteOutline />
                  </IconButton>
                </Box>
                <Typography className={this.props.classes.text} variant="body2">
                  Must be JPEG, PNG, or GIF and cannot exceed 5MB.
                </Typography>
              </Box>
            </Box>
          </div>
        </div>
        <Typography
          variant="h6"
          className={this.props.classes.title}
          style={{ marginBottom: "0.3rem" }}
        >
          Channel Settings
        </Typography>
        <div style={{marginBottom: "1rem"}}>
          <Typography
            variant="caption"
            style={{ color: "#868686" }}
          >
            Change your channel preferences here
          </Typography>
        </div>
        <div className={this.props.classes.borderBox}>
          <div style={{ padding: "2rem" }}>
            <Box flexGrow={1} position="relative">
              <Box display="flex" flexWrap="nowrap">
                <div className={this.props.classes.label}>
                  <Typography
                    variant="body2"
                    className={this.props.classes.textLabel}
                  >
                    Stream Key
                  </Typography>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <Box display="flex">
                    <div style={{ flexGrow: 1, marginRight: "1px" }}>
                      <TextField
                        inputProps={{
                          style: {
                            backgroundColor: "hsla(0,0%,100%,.15)",
                            color: "#efeff1",
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                          },
                        }}
                        variant="standard"
                        margin="none"
                        fullWidth
                        readOnly
                        value={
                          this.state.showStreamKey
                            ? this.props.user.stream_key
                            : "•••••••••••••••••••••••••••••••••••••••••••"
                        }
                      />
                    </div>
                    <CopyToClipboard
                      text={this.props.user.stream_key}
                      onCopy={() => {
                        this.setState({ copied: true });
                        setTimeout(
                          () => this.setState({ copied: false }),
                          5000
                        );
                      }}
                    >
                      <Button
                        aria-label="Copy Stream Key"
                        size="small"
                        className={this.props.classes.button}
                        style={{
                          marginLeft: "0.5rem",
                          backgroundColor: this.state.copied
                            ? "green"
                            : "#3f51b5",
                        }}
                        variant="contained"
                        color="primary"
                      >
                        {this.state.copied ? <Check /> : "Copy"}
                      </Button>
                    </CopyToClipboard>
                    <Button
                      onClick={this.resetStreamKey}
                      disabled={this.state.didReset}
                      aria-label="Reset Stream Key"
                      size="small"
                      className={this.props.classes.button}
                      style={{
                        marginLeft: "0.5rem",
                        backgroundColor: this.state.didReset
                          ? "green"
                          : "#333536",
                        color: "#fff",
                      }}
                      variant="contained"
                      color="default"
                    >
                      {this.state.didReset ? <Check /> : "Reset"}
                    </Button>
                  </Box>
                  <Button
                    onClick={this.handleShowStreamKey}
                    className={`${this.props.classes.text} ${this.props.classes.button}`}
                    style={{ textTransform: "none", minWidth: 0, padding: 0 }}
                  >
                    {this.state.showStreamKey ? "Hide" : "Show"}
                  </Button>
                </div>
              </Box>
            </Box>
          </div>
          <div style={{ padding: "2rem" }}>
            <Box flexGrow={1} position="relative">
              <Box display="flex" flexWrap="nowrap">
                <div className={this.props.classes.label}>
                  <Typography
                    variant="body2"
                    className={this.props.classes.textLabel}
                  >
                    NSFW Content
                  </Typography>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div>
                    <Switch
                      checked={this.props.user.nsfw}
                      onChange={this.handleNSFWToggle}
                      inputProps={{ "aria-label": "nsfw checkbox" }}
                      color="primary"
                    />
                  </div>
                  <div>
                    <Typography
                      className={this.props.classes.text}
                      variant="caption"
                    >
                      {`Please enable this setting if your stream contains content that may be inappropriate. Not doing so will result in an account suspension. You may never broadcast extreme sexual activity, extreme nudity, threats or extreme violence. Doing so will result in immediate, irrevocable termination of your account. Please make sure your content will comply with the Terms of Service before broadcasting`}
                    </Typography>
                  </div>
                </div>
              </Box>
            </Box>
          </div>
          <div style={{ padding: "2rem" }}>
            <Box flexGrow={1} position="relative">
              <Box display="flex" flexWrap="nowrap">
                <div className={this.props.classes.label}>
                  <Typography
                    variant="body2"
                    className={this.props.classes.textLabel}
                  >
                    Password Protection
                  </Typography>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div>
                    <Switch
                      checked={this.props.user.password_protect}
                      onChange={this.handlePasswordProtectToggle}
                      inputProps={{ "aria-label": "password protection checkbox" }}
                      color="primary"
                      disabled={
                        this.props.user.patreon
                          ? !this.props.user.patreon.isPatron &&
                            this.props.user.patreon.tier >= 2
                          : true
                      }
                    />
                  </div>
                  <div>
                    <Typography
                      className={this.props.classes.text}
                      variant="caption"
                    >
                      {`Enable this setting if you want users to enter a password when they enter your stream. This is only available for tier 2 and above patrons! `}
                    </Typography>
                    <Link href="https://patreon.com/join/angelthump">
                      Join Patreon Today!
                    </Link>
                  </div>
                </div>
              </Box>
            </Box>
          </div>
          <div style={{ padding: "2rem" }}>
            <Box flexGrow={1} position="relative">
              <Box display="flex" flexWrap="nowrap">
                <div className={this.props.classes.label}>
                  <Typography
                    variant="body2"
                    className={this.props.classes.textLabel}
                  >
                    Stream Password
                  </Typography>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <Box display="flex">
                    <div style={{ flexGrow: 1, marginRight: "1px" }}>
                      <TextField
                        inputProps={{
                          style: {
                            backgroundColor: "hsla(0,0%,100%,.15)",
                            color: "#efeff1",
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                          },
                        }}
                        disabled={
                          this.props.user.patreon
                            ? !this.props.user.patreon.isPatron &&
                              this.props.user.patreon.tier >= 2
                            : true
                        }
                        variant="standard"
                        margin="none"
                        fullWidth
                        type="password"
                        defaultValue={this.props.user.stream_password}
                        onChange={this.handleStreamPasswordInput}
                      />
                    </div>
                    <Button
                      onClick={this.handleSaveStreamPassword}
                      disabled={
                        this.state.savedStreamPassword || this.state.stream_password.length === 0 ||
                        (this.props.user.patreon
                          ? !this.props.user.patreon.isPatron &&
                            this.props.user.patreon.tier >= 2
                          : true)
                      }
                      aria-label="Reset Stream Key"
                      size="small"
                      className={this.props.classes.button}
                      style={{
                        marginLeft: "0.5rem",
                        backgroundColor: this.state.savedStreamPassword
                          ? "green"
                          : "#333536",
                        color: "#fff",
                      }}
                      variant="contained"
                      color="default"
                    >
                      {this.state.savedStreamPassword ? <Check /> : "Save"}
                    </Button>
                  </Box>
                  <div style={{ marginTop: "0.3rem" }}>
                    <Typography
                      className={this.props.classes.text}
                      style={{ marginTop: "1rem" }}
                      variant="caption"
                    >
                      {`Enter a stream password when you have password protect on. This is only available for tier 2 and above patrons! `}
                    </Typography>
                    <Link href="https://patreon.com/join/angelthump">
                      Join Patreon Today!
                    </Link>
                  </div>
                </div>
              </Box>
            </Box>
          </div>
          <div style={{ padding: "2rem" }}>
            <Box flexGrow={1} position="relative">
              <Box display="flex" flexWrap="nowrap">
                <div className={this.props.classes.label}>
                  <Typography
                    variant="body2"
                    className={this.props.classes.textLabel}
                  >
                    Unlist your stream
                  </Typography>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div>
                    <Switch
                      checked={this.props.user.unlist}
                      onChange={this.handleUnlistToggle}
                      inputProps={{ "aria-label": "unlist checkbox" }}
                      color="primary"
                      disabled={
                        this.props.user.patreon
                          ? !this.props.user.patreon.isPatron &&
                            this.props.user.patreon.tier >= 2
                          : true
                      }
                    />
                  </div>
                  <div>
                    <Typography
                      className={this.props.classes.text}
                      variant="caption"
                    >
                      {`Unlist your stream from the public front page. This is only available for tier 2 and above patrons! `}
                    </Typography>
                    <Link href="https://patreon.com/join/angelthump">
                      Join Patreon Today!
                    </Link>
                  </div>
                </div>
              </Box>
            </Box>
          </div>
        </div>
      </div>
    );
  }
}

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: "55rem",
    height: "100%",
    paddingLeft: "2rem",
    paddingRight: "2rem",
  },
  button: {
    textTransform: "none",
    "&:hover": {
      opacity: "0.7",
    },
  },
  title: {
    marginBottom: "1rem",
    fontWeight: "800",
    color: "#b6b6b6",
  },
  borderBox: {
    borderColor: "#2a2a2a",
    backgroundColor: "#1d1d1d",
    border: "1px solid hsla(0,0%,100%,.1)",
    marginBottom: "3rem",
    borderRadius: "4px",
  },
  box: {
    padding: "1rem",
  },
  text: {
    marginTop: "0.5rem",
    color: "#b6b6b6",
  },
  modalContent: {
    position: "absolute",
    backgroundColor: "#1d1d1d",
    outline: "none",
  },
  modal: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  label: {
    flexShrink: 0,
    width: "9rem",
    paddingRight: "1rem",
    marginTop: "5px",
  },
  textLabel: {
    color: "#f7f7f8",
    fontWeight: "550",
  },
  img: {
    marginRight: "2rem",
    height: 90,
    width: 160,
    alignSelf: "center",
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  icon: {
    color: "#84dcff",
  },
}));

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

const withMyHook = (Component) => {
  return function WrappedComponent(props) {
    const classes = useStyles();
    return <Component {...props} classes={classes} />;
  };
};

export default withMyHook(ChannelSettings);
