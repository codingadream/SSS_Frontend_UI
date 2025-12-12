// src/pages/SignUpPage.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Container,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AccountCircle,
  AccountBalance,
} from "@mui/icons-material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import type { AccountsResponse } from "../types/types";
import toast from "react-hot-toast";
import { callSync } from "../helpers";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleToggleConfirmVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const getAccounts = async (idToken) => {
    try {
      const response = await axios.get<AccountsResponse>(
        `${import.meta.env.VITE_BASE_URL}api/accounts`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      return response.data.accounts;
    } catch (err) {
      let errorMessage = "Failed to fetch accounts.";

      if (axios.isAxiosError(err)) {
        // Try to extract a specific error message from the server
        errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          errorMessage;
      }

      console.error("Fetch Accounts Error:", err);
      navigate("/error");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (name) {
        await updateProfile(user, { displayName: name });
      }

      alert("Account created successfully!");
      navigate("/link-accounts");
    } catch (error: any) {
      console.error("Sign-up error:", error);
      alert("Sign-up failed: " + error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        flexDirection: "column",
        background: `
          linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%),
          radial-gradient(circle at 25% 25%, rgba(27, 109, 106, 0.08) 0%, transparent 50%)
        `,
        backgroundSize: "100% 100%, 600px 600px",
        backgroundPosition: "0 0, -100px -100px",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box sx={{ backgroundColor: "#1b6d6a", color: "white", py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccountBalance sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              Commerce Bank
            </Typography>
            <Typography variant="body2" sx={{ ml: 2, opacity: 0.8 }}>
              Member FDIC
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          py: 8,
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(52, 151, 15, 0.05)",
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Card
            sx={{ width: "100%", maxWidth: 480, boxShadow: 4, borderRadius: 3 }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: "#1b6d6a", mb: 1 }}
                >
                  Create Account
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Join us and start budgeting smartly
                </Typography>
              </Box>

              <form onSubmit={handleSignUp}>
                {/* Name Field */}
                <TextField
                  label="Full Name"
                  type="text"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ color: "#1b6d6a" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Email Field */}
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#1b6d6a" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password Field */}
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#1b6d6a" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Confirm Password Field */}
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#1b6d6a" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleToggleConfirmVisibility}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    mt: 3,
                    backgroundColor: "#1b6d6a",
                    "&:hover": { backgroundColor: "#155a58" },
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  Sign Up
                </Button>
              </form>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
              </Divider>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    sx={{ color: "#1b6d6a", fontWeight: "bold" }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{ backgroundColor: "#1b6d6a", color: "white", py: 3, mt: "auto" }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2025 Commerce Bank. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              By signing up, you agree to our Terms of Use and Privacy Policy.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
