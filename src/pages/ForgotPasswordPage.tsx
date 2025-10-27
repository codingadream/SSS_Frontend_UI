// src/pages/ForgotPasswordPage.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Card,
  CardContent,
  Container,
  InputAdornment,
} from "@mui/material";
import { Email, AccountBalance } from "@mui/icons-material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link as RouterLink } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:5173/login", // 成功后返回登录页，可改成你的域名
      });
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `
          linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%),
          radial-gradient(circle at 25% 25%, rgba(27, 109, 106, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(27, 109, 106, 0.06) 0%, transparent 50%),
          conic-gradient(from 0deg at 50% 50%, rgba(27, 109, 106, 0.03) 0deg, transparent 60deg, rgba(27, 109, 106, 0.03) 120deg, transparent 180deg, rgba(27, 109, 106, 0.03) 240deg, transparent 300deg, rgba(27, 109, 106, 0.03) 360deg)
        `,
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
      <Container maxWidth="sm" sx={{ py: 10, flexGrow: 1 }} >
        <Card sx={{ boxShadow: 4, borderRadius: 3, p: 4 }}>
          <CardContent>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: "#1b6d6a" }}>
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your email to receive a password reset link.
              </Typography>
            </Box>

            {!sent ? (
              <form onSubmit={handleResetPassword}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  margin="normal"
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
                {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    mt: 3,
                    py: 1.5,
                    backgroundColor: "#1b6d6a",
                    "&:hover": { backgroundColor: "#155a58" },
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <Box textAlign="center">
                <Typography variant="h6" color="success.main" sx={{ mt: 3 }}>
                  ✅ Reset email sent!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Please check your inbox and follow the link to reset your password.
                </Typography>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{ color: "#1b6d6a", fontWeight: "bold", mt: 2, display: "inline-block" }}
                >
                  Back to Login
                </Link>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#1b6d6a", color: "white", py: 3, mt: "auto" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2025 Commerce Bank. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
