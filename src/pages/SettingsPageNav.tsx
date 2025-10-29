// src/pages/SettingsPageNav.tsx
import React, { useRef, useState } from "react";
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
  Add as AddIcon,
  Delete as DeleteIcon,
  CameraAlt as CameraAltIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

type BankAccount = {
  id: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
};

const SettingsPageNav: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  // --- Personal info ---
  const [firstName, setFirstName] = useState<string>(
    currentUser?.displayName?.split(" ")[0] || "John"
  );
  const [lastName, setLastName] = useState<string>(
    currentUser?.displayName?.split(" ").slice(1).join(" ") || "Doe"
  );
  const [email, setEmail] = useState<string>(currentUser?.email || "john.doe@email.com");
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

  // --- Bank accounts ---
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: "1", accountName: "Primary Checking", accountNumber: "****4829", routingNumber: "021000021" },
    { id: "2", accountName: "Savings Account", accountNumber: "****7392", routingNumber: "021000021" },
  ]);
  const [isAddBankDialogOpen, setIsAddBankDialogOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newRoutingNumber, setNewRoutingNumber] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // --- Notifications ---
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: "success" | "error" | "info" | "warning" }>({
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
    if (newPassword !== confirmPassword) return openSnack("New passwords do not match", "error");
    if (newPassword.length < 8) return openSnack("Password must be at least 8 characters", "error");
    // TODO: call Firebase reauthenticate + updatePassword
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    openSnack("Password updated.", "success");
  };

  const handleEmailChange = () => {
    if (!newEmail.includes("@")) return openSnack("Enter a valid email address", "error");
    // TODO: call Firebase reauthenticate + updateEmail
    setEmail(newEmail);
    setIsEmailDialogOpen(false);
    setNewEmail("");
    setEmailPassword("");
    openSnack("Email updated.", "success");
  };

  const handleAddBankAccount = () => {
    if (!newAccountName || !newAccountNumber || !newRoutingNumber) {
      return openSnack("Please fill in all fields", "error");
    }
    const acct: BankAccount = {
      id: Date.now().toString(),
      accountName: newAccountName,
      accountNumber: `****${newAccountNumber.slice(-4)}`,
      routingNumber: newRoutingNumber,
    };
    setBankAccounts((prev) => [...prev, acct]);
    setIsAddBankDialogOpen(false);
    setNewAccountName("");
    setNewAccountNumber("");
    setNewRoutingNumber("");
    openSnack("Bank account added.", "success");
  };

  const handleDeleteBankAccount = () => {
    if (!deleteId) return;
    setBankAccounts((prev) => prev.filter((a) => a.id !== deleteId));
    setDeleteId(null);
    openSnack("Bank account removed.", "success");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB", px: { xs: 3, sm: 5, md: 8 }, py: 4 }}>
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
                <Typography variant="h6" fontWeight={700}>Personal Information</Typography>
              </Box>
            }
            subheader="Update your name and personal details"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, pb: 3 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={profileImage || undefined}
                  sx={{ width: 96, height: 96, bgcolor: "#E0F2F1", color: "#00695C", fontSize: 32 }}
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
                  sx={{ mt: 1.5, borderColor: "#00695C", color: "#00695C", "&:hover": { bgcolor: "#E0F2F1" } }}
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
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                <Typography variant="h6" fontWeight={700}>Email Address</Typography>
              </Box>
            }
            subheader="Change the email address associated with your account"
          />
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Current Email" value={email} disabled fullWidth />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Button
                  variant="outlined"
                  onClick={() => setIsEmailDialogOpen(true)}
                  sx={{ borderColor: "#00695C", color: "#00695C", "&:hover": { bgcolor: "#E0F2F1" } }}
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
                <Typography variant="h6" fontWeight={700}>Password</Typography>
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
                      <IconButton onClick={() => setShowCurrentPassword((s) => !s)}>
                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                      <IconButton onClick={() => setShowConfirmPassword((s) => !s)}>
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                <Typography variant="h6" fontWeight={700}>Bank Accounts</Typography>
              </Box>
            }
            subheader="Manage your linked bank accounts"
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddBankDialogOpen(true)}
                sx={{ bgcolor: "#00695C", "&:hover": { bgcolor: "#075e54" } }}
              >
                Add Account
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ display: "grid", gap: 1.5 }}>
              {bankAccounts.map((a) => (
                <Box
                  key={a.id}
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
                      <Typography fontWeight={600}>{a.accountName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {a.accountNumber} • Routing: {a.routingNumber}
                      </Typography>
                    </Box>
                  </Box>
                  <Tooltip title="Remove">
                    <IconButton color="error" onClick={() => setDeleteId(a.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}

              {bankAccounts.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                  No bank accounts linked. Add one to get started.
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Change Email Dialog */}
      <Dialog open={isEmailDialogOpen} onClose={() => setIsEmailDialogOpen(false)} fullWidth maxWidth="sm">
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
          <Button onClick={() => setIsEmailDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleEmailChange} variant="contained" sx={{ bgcolor: "#00695C", "&:hover": { bgcolor: "#075e54" } }}>
            Update Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Bank Account Dialog */}
      <Dialog open={isAddBankDialogOpen} onClose={() => setIsAddBankDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Bank Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your bank account details to link a new account.
          </Typography>
          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Account Name"
              placeholder="e.g., Primary Checking"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Account Number"
              placeholder="Account number"
              value={newAccountNumber}
              onChange={(e) => setNewAccountNumber(e.target.value)}
              fullWidth
            />
            <TextField
              label="Routing Number"
              placeholder="9-digit routing number"
              value={newRoutingNumber}
              onChange={(e) => setNewRoutingNumber(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddBankDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleAddBankAccount} variant="contained" sx={{ bgcolor: "#00695C", "&:hover": { bgcolor: "#075e54" } }}>
            Add Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Remove Bank Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove this bank account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} variant="outlined">Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteBankAccount}>
            Remove Account
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

export default SettingsPageNav;