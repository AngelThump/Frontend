import PasswordChange from "./password-change";
import EmailChange from "./email-change";
import SecurityConfirmPassword from "./security-confirm-password";
import VerifyCode from "../auth/verify-code";
import logo from "../assets/logo.png";
import { Typography, Box, Button, IconButton, Modal, Paper } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useState } from "react";

export default function Security(props) {
  const { user } = props;
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showConfirmPassModal, setShowConfirmPassModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showConfirmEmailChangesModal, setShowConfirmEmailChangesModal] = useState(false);

  return (
    <Box sx={{ maxWidth: "55rem", mt: 2, mb: 2 }}>
      <Box>
        <Typography variant="h6" color="text.primary">
          Security
        </Typography>
        <Paper sx={{ borderColor: "#2a2a2a", border: "1px solid hsla(0,0%,100%,.1)", borderRadius: "4px", mt: 2 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flexShrink: 0, width: "10rem", mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Email
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <Typography variant="h6">{user.email}</Typography>
                  </Box>
                  <IconButton
                    onClick={() => {
                      setShowConfirmPassModal(true);
                      setShowEmailModal(true);
                    }}
                  >
                    <Edit color="primary" />
                  </IconButton>
                  <Modal open={showEmailModal} onClose={() => setShowEmailModal(false)}>
                    <Paper sx={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute", outline: "none" }}>
                      {showConfirmPassModal ? (
                        <SecurityConfirmPassword user={user} setVerified={() => setShowConfirmPassModal(false)} setPassword={setPassword} />
                      ) : showEmailModal ? (
                        <EmailChange
                          user={user}
                          password={password}
                          emailChanged={() => {
                            setShowEmailModal(false);
                            setShowVerificationModal(true);
                          }}
                          confirmEmailChanges={() => {
                            setShowEmailModal(false);
                            setShowConfirmEmailChangesModal(true);
                          }}
                        />
                      ) : null}
                    </Paper>
                  </Modal>
                  <Modal open={showVerificationModal} onClose={() => setShowVerificationModal(false)}>
                    <Box sx={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute", outline: "none" }}>
                      <Paper sx={{ display: "flex", flexDirection: "column", maxWidth: "400px", p: 2 }}>
                        <img alt="logo" style={{ alignSelf: "center" }} src={logo} width="146px" height="auto" />
                        <VerifyCode email={user.email} />
                      </Paper>
                    </Box>
                  </Modal>
                  <Modal open={showConfirmEmailChangesModal} onClose={() => setShowConfirmEmailChangesModal(false)}>
                    <Box sx={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute", outline: "none" }}>
                      <Paper sx={{ display: "flex", flexDirection: "column", maxWidth: "400px", p: 2 }}>
                        <img alt="logo" style={{ alignSelf: "center" }} src={logo} width="146px" height="auto" />
                        <Box sx={{ mt: 1, p: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>{`Email Sent to ${user.email}`}</Typography>
                        </Box>
                        <Box sx={{ mt: 1, pl: 1, pb: 2 }}>
                          <Typography variant="body2">Check your email to confirm your changes!</Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Modal>
                </Box>
                <Box sx={{ display: "flex", mt: 0.3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 550, mr: 0.5 }}>
                    {`${user.isVerified ? "Email Verified." : "Email not Verified. "}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${user.isVerified ? "Thank you for verifying your email." : "Please verify your email."}`}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  This email is linked to your account.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ borderColor: "#2a2a2a", border: "1px solid hsla(0,0%,100%,.1)", mb: 3, borderRadius: "4px" }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flexShrink: 0, width: "10rem", mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 550 }}>
                  Password
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box>
                  <Button
                    onClick={() => {
                      setShowConfirmPassModal(true);
                      setShowPasswordModal(true);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Change Password
                  </Button>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Improve your security with a strong password
                  </Typography>
                </Box>
                <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
                  <Paper sx={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute", outline: "none" }}>
                    {showConfirmPassModal ? (
                      <SecurityConfirmPassword user={user} setVerified={() => setShowConfirmPassModal(false)} setPassword={setPassword} />
                    ) : showPasswordModal ? (
                      <PasswordChange closeModal={() => setShowPasswordModal(false)} user={user} oldPassword={password} />
                    ) : null}
                  </Paper>
                </Modal>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
