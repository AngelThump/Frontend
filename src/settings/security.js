import React, { Component } from "react";
import PasswordChange from "./password-change";
import EmailChange from "./email-change";
import SecurityConfirmPassword from "./security-confirm-password";
import VerifyCode from "../auth/verify-code";
import logo from "../assets/logo.png";
import {
  Typography,
  makeStyles,
  Box,
  Button,
  IconButton,
  Modal,
  Container,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";

export default function Security(props) {
  const classes = useStyles();
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [showEmailModal, setShowEmailModal] = React.useState(false);
  const [showConfirmPassModal, setShowConfirmPassModal] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showVerificationModal, setShowVerificationModal] = React.useState(
    false
  );
  const [
    showConfirmEmailChangesModal,
    setShowConfirmEmailChangesModal,
  ] = React.useState(false);

  const handleShowEmailModal = (evt) => {
    if (evt) evt.preventDefault();
    setShowConfirmPassModal(true);
    setShowEmailModal(!showEmailModal);
  };

  const handleShowVerificationModal = () => {
    setShowVerificationModal(false);
  };

  const handleShowConfirmEmailChangesModal = () => {
    setShowConfirmEmailChangesModal(false);
  };

  const handleShowPasswordModal = (evt) => {
    if (evt) evt.preventDefault();
    setShowConfirmPassModal(true);
    setShowPasswordModal(!showPasswordModal);
  };

  const verified = (password) => {
    setShowConfirmPassModal(false);
    setPassword(password);
  };

  const emailChanged = () => {
    setShowEmailModal(false);
    setShowVerificationModal(true);
  };

  const confirmEmailChanges = () => {
    setShowEmailModal(false);
    setShowConfirmEmailChangesModal(true);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        Security
      </Typography>
      <div className={classes.borderBox}>
        <div style={{ padding: "2rem" }}>
          <Box flexGrow={1} position="relative">
            <Box display="flex" flexWrap="nowrap">
              <div className={classes.label}>
                <Typography variant="body2" className={classes.textLabel}>
                  Email
                </Typography>
              </div>
              <Box flexGrow={1}>
                <Box display="flex" alignItems="center">
                  <Box flexGrow={1}>
                    <Typography variant="h6" className={classes.textLabel}>
                      {props.user.email}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={handleShowEmailModal}
                    className={classes.button}
                    style={{ color: "#efeff1" }}
                  >
                    <Edit />
                  </IconButton>
                </Box>
                <div>
                  <Box display="flex">
                    <Typography variant="body1" className={classes.textLabel}>
                      {props.user.isVerified ? "Verified." : "Not Verified"}
                    </Typography>
                    <Typography
                      variant="body1"
                      style={{ marginLeft: "5px" }}
                      className={classes.text}
                    >
                      {props.user.isVerified
                        ? "Thank you for verifying your email."
                        : "Please verify your email!"}
                    </Typography>
                  </Box>
                  <Typography variant="caption" style={{ color: "#868686" }}>
                    {`This email is linked to your account.`}
                  </Typography>
                </div>
              </Box>
            </Box>
          </Box>
        </div>
        <div style={{ padding: "2rem" }}>
          <Box flexGrow={1} position="relative">
            <Box display="flex" flexWrap="nowrap">
              <div className={classes.label}>
                <Typography variant="body2" className={classes.textLabel}>
                  Password
                </Typography>
              </div>
              <Box flexGrow={1}>
                <Box>
                  <Button
                    onClick={handleShowPasswordModal}
                    className={classes.button}
                    variant="contained"
                    color="primary"
                  >
                    Change Password
                  </Button>
                </Box>
                <div style={{ marginTop: "1rem" }}>
                  <Typography variant="body2" className={classes.text}>
                    Improve your security with a strong password
                  </Typography>
                </div>
              </Box>
            </Box>
          </Box>
        </div>
      </div>
      <Modal
        open={showVerificationModal}
        onClose={handleShowVerificationModal}
        aria-labelledby="Edit Email"
        aria-describedby="Edit Email"
      >
        <div className={`${classes.modalContent} ${classes.modal}`}>
          <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
              <img
                alt="logo"
                style={{ alignSelf: "center" }}
                src={logo}
                width="146px"
                height="auto"
              />
              <VerifyCode email={props.user.email} />
            </div>
          </Container>
        </div>
      </Modal>

      <Modal
        open={showConfirmEmailChangesModal}
        onClose={handleShowConfirmEmailChangesModal}
        aria-labelledby="Edit Email"
        aria-describedby="Edit Email"
      >
        <div className={`${classes.modalContent} ${classes.modal}`}>
          <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
              <img
                alt="logo"
                style={{ alignSelf: "center" }}
                src={logo}
                width="146px"
                height="auto"
              />
              <div style={{marginTop: "1rem", padding: "1rem"}}>
                <Typography variant="body1" className={classes.textLabel}>
                  {`Email Sent to ${props.user.email}`}
                </Typography>
              </div>

              <div style={{marginTop: "1rem", paddingLeft:"1rem", paddingBottom: "2rem"}}>
                <Typography variant="body2" className={classes.text}>
                  Check your email to confirm your changes!
                </Typography>
              </div>
            </div>
          </Container>
        </div>
      </Modal>

      <Modal
        open={showEmailModal}
        onClose={handleShowEmailModal}
        aria-labelledby="Edit Email"
        aria-describedby="Edit Email"
      >
        <div className={`${classes.modalContent} ${classes.modal}`}>
          {showConfirmPassModal ? (
            <SecurityConfirmPassword user={props.user} verified={verified} />
          ) : showEmailModal ? (
            <EmailChange
              user={props.user}
              password={password}
              emailChanged={emailChanged}
              confirmEmailChanges={confirmEmailChanges}
            />
          ) : null}
        </div>
      </Modal>

      <Modal
        open={showPasswordModal}
        onClose={handleShowPasswordModal}
        aria-labelledby="Edit Password"
        aria-describedby="Edit Password"
      >
        <div className={`${classes.modalContent} ${classes.modal}`}>
          {showConfirmPassModal ? (
            <SecurityConfirmPassword user={props.user} verified={verified} />
          ) : showEmailModal ? (
            <PasswordChange user={props.user} oldPassword={password} />
          ) : null}
        </div>
      </Modal>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
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
    alignSelf: "center",
  },
  textLabel: {
    color: "#f7f7f8",
    fontWeight: "550",
  },
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));
