import client from "../auth/feathers";
import SecurityConfirmPassword from "./security-confirm-password";
import UsernameChange from "./username-change";
import Cropper from "react-easy-crop";
import Pica from "pica";
import { Typography, Box, Button, IconButton, Modal, Icon, TextField, Alert, Slider, Paper } from "@mui/material";
import { DeleteOutline, RotateRight, ZoomIn, ZoomOut, Edit, Check, Clear } from "@mui/icons-material";
import { createRef, useRef, useState } from "react";

const acceptOnlyImages = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
const DEFAULT_PROFILE_LOGO = "https://images-angelthump.nyc3.cdn.digitaloceanspaces.com/default_profile_picture.png";

export default function Profile(props) {
  const { user } = props;
  const [state, setState] = useState({
    uploadError: false,
    uploadSuccess: false,
    uploadMessage: "",
    display_name: user.display_name,
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
    profile_logo_url: user.profile_logo_url,
  });
  const cropperRef = createRef();
  const fileInput = useRef();

  const cropPhoto = async (evt) => {
    if (evt) evt.preventDefault();
    try {
      const croppedImage = await getCroppedImg(state.imageSrc, state.croppedAreaPixels, state.rotation, state.fileType);
      const result = await uploadImage(croppedImage);
      if (!result) {
        setState({
          ...state,
          uploadError: true,
          uploadSuccess: false,
          uploadMessage: "Something went wrong! Contact support if it keeps happening.",
        });
        return;
      }
      setState({
        ...state,
        profile_logo_url: result.imageURL,
        uploadError: false,
        uploadMessage: "Successfully updated your profile picture.",
        uploadSuccess: true,
      });
      closeFileModal();
    } catch (e) {
      console.error(e);
    }
  };

  const onRotationChange = () => {
    let rotation = state.rotation + 90;
    if (rotation === 360) rotation = 0;
    setState({ ...state, rotation: rotation });
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!acceptOnlyImages.includes(file.type)) {
        setState({ ...state, uploadError: true, uploadSuccess: false, uploadMessage: "File must be JPEG, PNG, or GIF" });
        return;
      }
      const fileSize = file.size / (1024 * 1024);
      if (fileSize > 5) {
        setState({ ...state, uploadError: true, uploadSuccess: false, uploadMessage: "File size needs to be less than 5 MB" });
        return;
      }

      const imageDataUrl = await readFile(file);
      setState({ ...state, imageSrc: imageDataUrl, showFileModal: true, fileType: file.type });
    }
  };

  const closeFileModal = () => {
    fileInput.current.value = "";
    setState({ ...state, showFileModal: false, imageSrc: "", fileType: null, rotation: 0 });
  };

  const deleteUserLogo = async (evt) => {
    if (evt) evt.preventDefault();
    const confirmDialog = window.confirm("Delete your profile picture?");
    if (!confirmDialog) return;

    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/profile-logo`, {
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
        setState({ ...state, profile_logo_url: DEFAULT_PROFILE_LOGO });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const display_name_onChange = (evt) => {
    const displayName = evt.target.value;
    setState({ ...state, display_name: displayName, saveChangesSuccess: false, saveChangesError: false, display_name_isValid: displayName.length > 0 && displayName.toLowerCase() === user.username });
  };

  const handleSaveChanges = async (evt) => {
    if (evt) evt.preventDefault();

    const { accessToken } = await client.get("authentication");

    await fetch(`${process.env.REACT_APP_AUTH_BASE}/v1/user/display-name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        display_name: state.display_name,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          setState({ ...state, saveChangesError: true, saveChangesSuccess: false });
          return console.error(data);
        }
        setState({ ...state, saveChangesSuccess: true, saveChangesError: false });
      })
      .catch((e) => {
        setState({ ...state, saveChangesError: true, saveChangesSuccess: false });
        console.error(e);
      });
  };

  return (
    <Box sx={{ maxWidth: "55rem", mt: 2 }}>
      <Box>
        <Typography variant="h6" color="text.primary">
          Profile Picture
        </Typography>
        <Paper sx={{ borderColor: "#2a2a2a", border: "1px solid hsla(0,0%,100%,.1)", mb: 3, borderRadius: "4px", mt: 2 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ mr: 1, position: "relative", maxHeight: "100%", width: "6rem", height: "6rem" }}>
                <img style={{ borderRadius: "9000px", width: "100%" }} alt="" src={state.profile_logo_url} />
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
                  <IconButton onClick={deleteUserLogo} sx={{ ml: 1 }}>
                    <DeleteOutline color="primary" />
                  </IconButton>
                  <Modal open={state.showFileModal} onClose={closeFileModal}>
                    <Paper sx={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute", outline: "none" }}>
                      <Box sx={{ maxWidth: "60rem" }}>
                        <Box sx={{ p: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Typography variant="body2">Update Profile Picture</Typography>
                        </Box>
                        <Box
                          sx={{
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
                          }}
                        >
                          <Cropper
                            ref={cropperRef.current}
                            image={state.imageSrc}
                            crop={state.crop}
                            zoom={state.zoom}
                            aspect={state.aspect}
                            cropShape="round"
                            showGrid={false}
                            onCropChange={(crop) => setState({ ...state, crop })}
                            onCropComplete={(croppedArea, croppedAreaPixels) => setState({ ...state, croppedAreaPixels })}
                            onZoomChange={(zoom) => setState({ ...state, zoom })}
                            zoomWithScroll={false}
                            onRotationChange={onRotationChange}
                            rotation={state.rotation}
                          />
                        </Box>
                        <Box sx={{ p: 0.5, display: "flex" }}>
                          <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center", pr: 0.5 }}>
                            <Box sx={{ display: "inline-flex", pr: 0.5 }}>
                              <IconButton onClick={onRotationChange}>
                                <RotateRight color="primary" />
                              </IconButton>
                            </Box>
                            <Icon>
                              <ZoomOut color="primary" />
                            </Icon>
                            <Box sx={{ pr: 0.5, pl: 1, flexGrow: 1 }}>
                              <Slider defaultValue={1} min={1} max={3} step={0.1} aria-labelledby="Zoom" onChange={(e, zoom) => setState({ ...state, zoom })} />
                            </Box>
                            <Icon>
                              <ZoomIn color="primary" />
                            </Icon>
                            <Button
                              onClick={closeFileModal}
                              size="small"
                              variant="contained"
                              sx={{
                                marginRight: "0.3rem",
                              }}
                            >
                              Cancel
                            </Button>
                            <Button onClick={cropPhoto} size="small" variant="contained" color="primary">
                              Save
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Modal>
                </Box>
                <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                  Must be JPEG, PNG, or GIF and cannot exceed 5MB.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box>
        <Typography variant="h6" color="text.primary">
          Profile Settings
        </Typography>
        <Paper sx={{ borderColor: "#2a2a2a", border: "1px solid hsla(0,0%,100%,.1)", mb: 3, borderRadius: "4px", mt: 2 }}>
          <Box sx={{ p: 3, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flexShrink: 0, width: "10rem", mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Username
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <TextField margin="none" fullWidth disabled value={user.username} size="small" />
                  </Box>
                  <IconButton onClick={() => setState({ ...state, showModal: true, showConfirmPassModal: true })}>
                    <Edit color="primary" />
                  </IconButton>
                  <Modal open={state.showModal} onClose={() => setState({ ...state, showModal: false })}>
                    <Paper sx={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute", outline: "none" }}>
                      {state.showConfirmPassModal ? (
                        <SecurityConfirmPassword
                          user={user}
                          setVerified={() =>
                            setState({
                              ...state,
                              showConfirmPassModal: false,
                              showUsernameChangeModal: true,
                            })
                          }
                        />
                      ) : state.showUsernameChangeModal ? (
                        <UsernameChange user={user} />
                      ) : null}
                    </Paper>
                  </Modal>
                </Box>
                <Typography sx={{ mt: 0.3 }} variant="body2" color="text.secondary">
                  Change your username here
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", mt: 2 }}>
              <Box sx={{ flexShrink: 0, width: "10rem", mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Display Name
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <TextField margin="none" fullWidth size="small" defaultValue={user.display_name} onChange={display_name_onChange} />
                  </Box>
                </Box>
                <Typography sx={{ mt: 0.3 }} variant="body2" color="text.secondary">
                  Customize capitalization for your username
                </Typography>
              </Box>
            </Box>
            <Box sx={{ p: "1rem", display: "flex", justifyContent: "flex-end" }}>
              {state.saveChangesSuccess ? (
                <Button size="small" variant="contained" disabled sx={{ backgroundColor: "#66bb6a!important", color: "rgba(0, 0, 0, 0.87)!important" }}>
                  <Check />
                </Button>
              ) : state.saveChangesError ? (
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSaveChanges}
                  disabled={!state.display_name_isValid}
                  sx={{ backgroundColor: "#f44336!important", color: "rgba(0, 0, 0, 0.87)!important" }}
                >
                  <Clear />
                </Button>
              ) : (
                <Button onClick={handleSaveChanges} size="small" variant="contained" color="primary" disabled={!state.display_name_isValid}>
                  Save
                </Button>
              )}
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

  ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5);
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x, 0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y);
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
