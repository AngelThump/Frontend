import React, { Component } from "react";
import client from "../auth/feathers";
import SecurityConfirmPassword from "./security-confirm-password";
import UsernameChange from "./username-change";
import Cropper from "react-easy-crop";
import Pica from "pica";
import Slider from "@material-ui/core/Slider";
import {
  Typography,
  makeStyles,
  Box,
  Button,
  IconButton,
  Modal,
  Icon,
  TextField,
} from "@material-ui/core";
import {
  DeleteOutline,
  RotateRight,
  ZoomIn,
  ZoomOut,
  Edit,
  Check,
  Clear,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.CropperRef = React.createRef();
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
      display_name: this.props.user.display_name,
      display_name_isValid: false,
      saveChangesSuccess: false,
      saveChangesError: false,
      showUsernameChangeModal: false,
      showConfirmPassModal: false,
      showModal: false,
      showFileModal: false,
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 1,
      rotation: 0,
      croppedAreaPixels: null,
      croppedImage: null,
      isCropping: false,
      profile_logo_url: this.props.user.profile_logo_url,
    };
  }

  cropPhoto = async (evt) => {
    if (evt) {
      evt.preventDefault();
    }

    try {
      const croppedImage = await getCroppedImg(
        this.state.imageSrc,
        this.state.croppedAreaPixels,
        this.state.rotation,
        this.state.fileType
      );
      const result = await uploadImage(croppedImage);
      if (!result) {
        this.setState({
          uploadError: true,
          uploadSuccess: false,
          uploadMessage:
            "Something went severely wrong. Contact support if it keeps happening.",
        });
      }
      this.setState({
        profile_logo_url: result.imageURL,
        uploadError: false,
        uploadMessage: "Successfully updated your profile picture.",
        uploadSuccess: true,
      });
      this.closeFileModal();
    } catch (e) {
      console.error(e);
    }
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({
      croppedAreaPixels,
    });
  };

  onZoomChange = (zoom) => {
    this.setState({ zoom });
  };

  onRotationChange = () => {
    let rotation = this.state.rotation + 90;
    if (rotation === 360) {
      rotation = 0;
    }
    this.setState({ rotation: rotation });
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

      this.setState({
        imageSrc: imageDataUrl,
        showFileModal: true,
        fileType: file.type,
      });
    }
  };

  fileButtonClick = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    this.fileInput.click();
  };

  closeFileModal = () => {
    this.fileInput.value = "";
    this.setState({
      showFileModal: false,
      imageSrc: "",
      fileType: null,
      rotation: 0,
    });
  };

  deleteUserLogo = async (evt) => {
    if (evt) {
      evt.preventDefault();
    }

    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/profile-logo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          return console.error(data);
        }
        this.setState({ profile_logo_url: null });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  display_name_onChange = (evt) => {
    this.setState(
      {
        display_name: evt.target.value,
        saveChangesSuccess: false,
        saveChangesError: false,
      },
      () => {
        if (this.state.display_name.length > 0) {
          this.setState({ display_name_isValid: true });
        } else {
          this.setState({ display_name_isValid: false });
        }
      }
    );
  };

  handleCloseMessage = () => {
    this.setState({ uploadError: false, uploadSuccess: false });
  };

  handleSaveChanges = async (evt) => {
    if (evt) {
      evt.preventDefault();
    }

    const { accessToken } = await client.get("authentication");

    await fetch("https://sso.angelthump.com/v1/user/display-name", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        display_name: this.state.display_name,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          this.setState({ saveChangesError: true, saveChangesSuccess: false });
          return console.error(data);
        }
        this.setState({ saveChangesSuccess: true, saveChangesError: false });
      })
      .catch((e) => {
        this.setState({ saveChangesError: true, saveChangesSuccess: false });
        console.error(e);
      });
  };

  showModal = (evt) => {
    if (evt) {
      evt.preventDefault();
    }

    this.setState({ showModal: true, showConfirmPassModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  verified = () => {
    this.setState({
      showConfirmPassModal: false,
      showUsernameChangeModal: true,
    });
  };

  render() {
    return (
      <div className={this.props.classes.root}>
        <Typography variant="h6" className={this.props.classes.title}>
          Profile Picture
        </Typography>
        <div className={this.props.classes.borderBox}>
          <div className={this.props.classes.box}>
            <Box display="flex" flexDirection="row">
              <div className={this.props.classes.profileImg}>
                <img
                  alt=""
                  className={this.props.classes.avatar}
                  src={this.props.user.profile_logo_url}
                />
              </div>
              <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                justifyContent="center"
              >
                <input
                  onChange={this.onFileChange}
                  ref={(ref) => {
                    this.fileInput = ref;
                  }}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
                {this.state.uploadError ? (
                  <Alert style={{ marginBottom: "1rem" }} serverity="error">
                    {this.state.uploadMessage}
                  </Alert>
                ) : this.state.uploadSuccess ? (
                  <Alert style={{ marginBottom: "1rem" }} serverity="success">
                    {this.state.uploadMessage}
                  </Alert>
                ) : (
                  <></>
                )}
                <Box display="flex">
                  <Button
                    onClick={this.fileButtonClick}
                    size="small"
                    className={this.props.classes.button}
                    variant="contained"
                    color="primary"
                    component="span"
                  >
                    Update Profile Picture
                  </Button>
                  <IconButton
                    onClick={this.deleteUserLogo}
                    style={{ marginLeft: "1rem" }}
                    className={this.props.classes.icon}
                    aria-label="delete"
                  >
                    <DeleteOutline />
                  </IconButton>
                  <Modal
                    open={this.state.showFileModal}
                    onClose={this.closeFileModal}
                    aria-labelledby="Update Profile Picture"
                    aria-describedby="Update Profile Picture"
                  >
                    <div
                      className={`${this.props.classes.modalContent} ${this.props.classes.modal}`}
                    >
                      <div style={{ maxWidth: "60rem" }}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          p={1}
                        >
                          <Typography
                            className={this.props.classes.text}
                            variant="body2"
                          >
                            Update Profile Picture
                          </Typography>
                        </Box>
                        <div className={this.props.classes.cropperParent}>
                          <Cropper
                            ref={this.CropperRef}
                            image={this.state.imageSrc}
                            crop={this.state.crop}
                            zoom={this.state.zoom}
                            aspect={this.state.aspect}
                            cropShape="round"
                            showGrid={false}
                            onCropChange={this.onCropChange}
                            onCropComplete={this.onCropComplete}
                            onZoomChange={this.onZoomChange}
                            zoomWithScroll={false}
                            onRotationChange={this.onRotationChange}
                            rotation={this.state.rotation}
                          />
                        </div>
                        <Box display="flex" style={{ padding: "0.5rem" }}>
                          <Box
                            display="flex"
                            flexGrow={1}
                            alignItems="center"
                            paddingRight="0.5rem"
                          >
                            <Box display="inline-flex" paddingRight="0.5rem">
                              <IconButton
                                onClick={this.onRotationChange}
                                className={this.props.classes.icon}
                                aria-label="rotate"
                              >
                                <RotateRight />
                              </IconButton>
                            </Box>
                            <Icon className={this.props.classes.icon}>
                              <ZoomOut />
                            </Icon>
                            <Box
                              flexGrow={1}
                              paddingLeft="0.5rem"
                              paddingRight="0.5rem"
                            >
                              <Slider
                                defaultValue={1}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e, zoom) => this.onZoomChange(zoom)}
                              />
                            </Box>
                            <Icon className={this.props.classes.icon}>
                              <ZoomIn />
                            </Icon>
                            <Button
                              onClick={this.closeFileModal}
                              size="small"
                              className={this.props.classes.button}
                              variant="contained"
                              component="span"
                              style={{
                                backgroundColor: "#333536",
                                color: "#fff",
                                marginRight: "0.5rem",
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={this.cropPhoto}
                              size="small"
                              className={this.props.classes.button}
                              variant="contained"
                              color="primary"
                              component="span"
                            >
                              Save
                            </Button>
                          </Box>
                        </Box>
                      </div>
                    </div>
                  </Modal>
                </Box>
                <Typography className={this.props.classes.text} variant="body2">
                  Must be JPEG, PNG, or GIF and cannot exceed 5MB.
                </Typography>
              </Box>
            </Box>
          </div>
        </div>
        <Typography variant="h6" className={this.props.classes.title}>
          Profile Settings
        </Typography>
        <div className={this.props.classes.borderBox}>
          <div style={{ padding: "2rem" }}>
            <Box flexGrow={1} position="relative">
              <Box display="flex" flexWrap="nowrap">
                <div className={this.props.classes.label}>
                  <Typography
                    variant="body2"
                    className={this.props.classes.textLabel}
                  >
                    Username
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
                            opacity: ".5",
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                          },
                        }}
                        variant="standard"
                        margin="none"
                        fullWidth
                        disabled
                        value={this.props.user.username}
                      />
                    </div>
                    <IconButton
                      onClick={this.showModal}
                      className={this.props.classes.button}
                      aria-label="Edit Username"
                      style={{ padding: 0, marginLeft: "0.3rem", color: "#efeff1" }}
                    >
                      <Edit />
                    </IconButton>
                    <Modal
                      open={this.state.showModal}
                      onClose={this.closeModal}
                      aria-labelledby="Edit Username"
                      aria-describedby="Edit Username"
                    >
                      <div
                        className={`${this.props.classes.modalContent} ${this.props.classes.modal}`}
                      >
                        {this.state.showConfirmPassModal ? (
                          <SecurityConfirmPassword
                            user={this.props.user}
                            verified={this.verified}
                          />
                        ) : this.state.showUsernameChangeModal ? (
                          <UsernameChange user={this.props.user} />
                        ) : null}
                      </div>
                    </Modal>
                  </Box>
                  <Typography
                    className={this.props.classes.text}
                    variant="body2"
                  >
                    Change your username here
                  </Typography>
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
                    Display Name
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
                        defaultValue={this.props.user.display_name}
                        onChange={this.display_name_onChange}
                      />
                    </div>
                  </Box>
                  <Typography
                    className={this.props.classes.text}
                    variant="body2"
                  >
                    Customize capitalization for your username
                  </Typography>
                </div>
              </Box>
            </Box>
          </div>
          <Box display="flex" justifyContent="flex-end" p="1rem">
            {this.state.saveChangesSuccess ? (
              <Button
                size="small"
                variant="contained"
                disabled
                style={{ color: "#fff", backgroundColor: "green" }}
              >
                <Check />
              </Button>
            ) : this.state.saveChangesError ? (
              <Button
                size="small"
                variant="contained"
                classes={{ disabled: this.props.classes.disabled }}
                onClick={this.handleSaveChanges}
                disabled={!this.state.display_name_isValid}
                style={{ color: "#fff", backgroundColor: "red" }}
              >
                <Clear />
              </Button>
            ) : (
              <Button
                onClick={this.handleSaveChanges}
                size="small"
                classes={{ disabled: this.props.classes.disabled }}
                className={this.props.classes.button}
                variant="contained"
                color="primary"
                disabled={!this.state.display_name_isValid}
              >
                Save
              </Button>
            )}
          </Box>
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
  profileImg: {
    marginRight: "1rem",
  },
  avatar: {
    borderRadius: "25px",
    borderCollapse: "separate",
    height: "6rem",
    width: "6rem",
  },
  icon: {
    color: "#84dcff",
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
  cropperParent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
    borderTop: "1px solid hsla(0,0%,100%,.1)",
    borderBottom: "1px solid hsla(0,0%,100%,.1)",
    borderColor: "#2a2a2a",
    width: "600px",
    height: "320px",
    position: "relative",
  },
  label: {
    flexShrink: 0,
    width: "7rem",
    paddingRight: "1rem",
    marginTop: "5px",
  },
  textLabel: {
    color: "#f7f7f8",
    fontWeight: "550",
  },
  disabled: {
    backgroundColor: "hsla(0,0%,100%,.15)!important",
    color: "hsla(0,0%,100%,.5)!important",
    cursor: "not-allowed!important",
  },
}));

const readFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      async (e) => {
        const img = await createImage(e.target.result);
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 320;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;

        const pica = Pica();
        pica.resize(img, canvas).then((result) => {
          const imageDataUrl = result.toDataURL(file.type);
          resolve(imageDataUrl);
        });
      },
      false
    );
    reader.readAsDataURL(file);
  });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop, rotation, fileType) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const safeArea = Math.max(image.width, image.height) * 2;

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  );
  return canvas.toDataURL(fileType);
};

const uploadImage = async (dataURL) => {
  return await client
    .service("uploads/profile-logos")
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

export default withMyHook(Profile);
