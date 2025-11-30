// src/pages/SettingsPageNav.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader as MUICardHeader,
  Avatar,
  IconButton,
  Grid,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  CreditCard as CreditCardIcon,
  CameraAlt as CameraAltIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { usePlaidLink } from "react-plaid-link";
import type { AccountsResponse, UserResponse } from "../types/types";
import axios from "axios";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { callSync } from "../helpers";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";

const SettingsPageNav: React.FC = () => {
  const { currentUser } = useAuth();
  const [linkToken, setLinkToken] = useState(null);
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [accountsData, setAccountsData] = useState<AccountsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const generateToken = async () => {
    const token = await currentUser?.getIdToken();
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}api/create_link_token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setLinkToken(data);
    console.log(data);
  };

  const fetchUser = async () => {
    setLoading(true);

    try {
      const token = await currentUser?.getIdToken();
      const response = await axios.get<UserResponse>(
        `${import.meta.env.VITE_BASE_URL}api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(response.data);
    } catch (err) {
      let errorMessage = "Failed to fetch users.";

      if (axios.isAxiosError(err)) {
        // Try to extract a specific error message from the server
        errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          errorMessage;
      }

      toast.error(errorMessage);
      console.error("Fetch User details Error:", err);
      // Set data to null on error
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);

    try {
      const token = await currentUser?.getIdToken();
      const response = await axios.get<AccountsResponse>(
        `${import.meta.env.VITE_BASE_URL}api/accounts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAccountsData(response.data);
    } catch (err) {
      let errorMessage = "Failed to fetch accounts.";

      if (axios.isAxiosError(err)) {
        // Try to extract a specific error message from the server
        errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          errorMessage;
      }

      toast.error(errorMessage);
      console.error("Fetch Accounts Error:", err);
      // Set data to null on error
      setAccountsData(null);
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Personal info ---
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  // --- Password state ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Email change dialog ---
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  // --- Notifications ---
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    sev: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    msg: "",
    sev: "success",
  });

  const openSnack = (msg: string, sev: typeof snack.sev = "success") =>
    setSnack({ open: true, msg, sev });

  const handleProfileImageClick = () => fileInputRef.current?.click();
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
      openSnack("Profile picture updated!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleSavePersonalInfo = () => {
    // TODO: wire to Firebase updateProfile if desired
    openSnack("Personal information saved.", "success");
  };

  const handlePasswordReset = () => {
    if (newPassword !== confirmPassword)
      return openSnack("New passwords do not match", "error");
    if (newPassword.length < 8)
      return openSnack("Password must be at least 8 characters", "error");
    // TODO: call Firebase reauthenticate + updatePassword
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    openSnack("Password updated.", "success");
  };

  const handleEmailChange = async () => {
    if (!newEmail.includes("@"))
      return openSnack("Enter a valid email address", "error");
    const credential = EmailAuthProvider.credential(
      currentUser!.email!,
      emailPassword
    );
    try {
      await reauthenticateWithCredential(currentUser!, credential);
      await updateEmail(currentUser!, newEmail); //TODO verify email to enhance security, and disable email enumeration in firebase settings
      await callSync(currentUser);
      await fetchUser();
      setIsChangingEmail(true);
    } catch (e) {
      setNewEmail("");
      if (e instanceof Error) {
        console.error(e.message);
        openSnack("Email failed to update. " + e.message, "error");
      } else {
        // Fallback for non-standard errors (e.g. strings or raw objects)
        console.error("An unexpected error occurred:", e);
      }
    }
    setIsEmailDialogOpen(false);
    setEmailPassword("");
  };

  useEffect(() => {
    if (isChangingEmail) {
      if (userData?.email == newEmail) {
        openSnack("Email updated.", "success");
        setNewEmail("");
      } else {
        openSnack("Email failed to update.", "error");
        setNewEmail("");
      }
    }
    setIsChangingEmail(false);
  }, [isChangingEmail]);

  useEffect(() => {
    generateToken();
    fetchUser();
    fetchAccounts();
  }, []);

  useEffect(() => {
    setFirstName(userData?.fullName?.split(" ")[0] || "John");
    setLastName(userData?.fullName?.split(" ")[1] || "Doe");
    setEmail(userData?.email || "john.doe@email.com");
  }, [userData]);

  if (loading) return <LoadingSpinner />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F9FAFB",
        px: { xs: 3, sm: 5, md: 8 },
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <SettingsIcon sx={{ color: "#00695C" }} />
          <Typography variant="h5" fontWeight={700} sx={{ color: "#0b1721" }}>
            Profile Settings
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Manage your account settings and preferences
        </Typography>

        {/* PERSONAL INFORMATION */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <MUICardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon sx={{ color: "#00695C" }} />
                <Typography variant="h6" fontWeight={700}>
                  Personal Information
                </Typography>
              </Box>
            }
            subheader="Update your name and personal details"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, pb: 3 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={profileImage || undefined}
                  sx={{
                    width: 96,
                    height: 96,
                    bgcolor: "#E0F2F1",
                    color: "#00695C",
                    fontSize: 32,
                  }}
                >
                  {(firstName?.[0] || "J").toUpperCase()}
                  {(lastName?.[0] || "D").toUpperCase()}
                </Avatar>
                <Tooltip title="Change photo">
                  <IconButton
                    size="small"
                    onClick={handleProfileImageClick}
                    sx={{
                      position: "absolute",
                      right: -6,
                      bottom: -6,
                      bgcolor: "#00695C",
                      color: "white",
                      "&:hover": { bgcolor: "#075e54" },
                    }}
                  >
                    <CameraAltIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  style={{ display: "none" }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {firstName} {lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
                <Button
                  onClick={handleProfileImageClick}
                  size="small"
                  variant="outlined"
                  sx={{
                    mt: 1.5,
                    borderColor: "#00695C",
                    color: "#00695C",
                    "&:hover": { bgcolor: "#E0F2F1" },
                  }}
                >
                  Change Photo
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)} //TODO
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)} //TODO
                  fullWidth
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              onClick={handleSavePersonalInfo}
              sx={{ bgcolor: "#00695C", "&:hover": { bgcolor: "#075e54" } }}
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* EMAIL ADDRESS */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <MUICardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <MailIcon sx={{ color: "#00695C" }} />
                <Typography variant="h6" fontWeight={700}>
                  Email Address
                </Typography>
              </Box>
            }
            subheader="Change the email address associated with your account"
          />
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Current Email"
                  value={email}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Button
                  variant="outlined"
                  onClick={() => setIsEmailDialogOpen(true)}
                  sx={{
                    borderColor: "#00695C",
                    color: "#00695C",
                    "&:hover": { bgcolor: "#E0F2F1" },
                  }}
                >
                  Change Email Address
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* PASSWORD */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <MUICardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <LockIcon sx={{ color: "#00695C" }} />
                <Typography variant="h6" fontWeight={700}>
                  Password
                </Typography>
              </Box>
            }
            subheader="Change your password to keep your account secure"
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowCurrentPassword((s) => !s)}
                      >
                        {showCurrentPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowNewPassword((s) => !s)}>
                        {showNewPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowConfirmPassword((s) => !s)}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              onClick={handlePasswordReset}
              sx={{ bgcolor: "#00695C", "&:hover": { bgcolor: "#075e54" } }}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* BANK ACCOUNTS */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <MUICardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <CreditCardIcon sx={{ color: "#00695C" }} />
                <Typography variant="h6" fontWeight={700}>
                  Bank Accounts
                </Typography>
              </Box>
            }
            subheader="Manage your linked bank accounts"
            action={
              <PlaidLink linkToken={linkToken} fetchAccounts={fetchAccounts} />
            }
          />
          <CardContent>
            <Box sx={{ display: "grid", gap: 1.5 }}>
              {accountsData?.accounts.map((account) => (
                <Box
                  key={account.accountId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    border: "1px solid #eee",
                    bgcolor: "white",
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#FAFAFA" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#E0F2F1", color: "#00695C" }}>
                      <CreditCardIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>
                        {account.accountName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {account.accountType} • Balance: $
                        {account.currentBalance}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}

              {accountsData && accountsData?.accounts.length === 0 && (
                <Box
                  sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
                >
                  No bank accounts linked. Add one to get started.
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Change Email Dialog */}
      <Dialog
        open={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Change Email Address</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your new email and confirm your password.
          </Typography>
          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="New Email Address"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsEmailDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEmailChange}
            variant="contained"
            sx={{ bgcolor: "#00695C", "&:hover": { bgcolor: "#075e54" } }}
          >
            Update Email
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.sev}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

interface LinkProps {
  linkToken: string | null;
  fetchAccounts: () => Promise<void>;
}
const PlaidLink: React.FC<LinkProps> = (props: LinkProps) => {
  const { currentUser } = useAuth();
  const exchangeToken = async (publicToken: string) => {
    const token = await currentUser?.getIdToken();
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}api/exchange_public_token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_token: publicToken }),
      }
    );
    const data = await response.json();
    console.log(data);
  };
  const onSuccess = React.useCallback(async (public_token: string) => {
    // send public_token to server
    await exchangeToken(public_token);
    await callSync(currentUser);
    props.fetchAccounts();
  }, []);
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: props.linkToken!,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <Button
      onClick={() => open()}
      disabled={!ready}
      variant="contained"
      sx={{ bgcolor: "#00695C", "&:hover": { bgcolor: "#075e54" } }}
    >
      Add Account
    </Button>
  );
};

export default SettingsPageNav;
