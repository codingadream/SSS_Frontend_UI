// src/pages/ErrorPage.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Container,
  Stack,
} from "@mui/material";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home");
  };

  const handleLogout = async () => {
      navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F9FAFB",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            textAlign: "center",
            p: 4,
          }}
        >
          <CardContent>
            {/* Error Icon */}
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#FFEBEE", // Light Red background
                color: "#D32F2F",   // Red icon
                mx: "auto",
                mb: 3,
              }}
            >
              <ErrorIcon sx={{ fontSize: 32 }} />
            </Avatar>

            <Typography 
              variant="h4" 
              fontWeight={700} 
              gutterBottom 
              sx={{ color: "#0b1721" }}
            >
              Something went wrong
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4, maxWidth: "85%", mx: "auto" }}
            >
              We encountered an unexpected error while processing your request. 
              Please try logging in again or return to the dashboard.
            </Typography>

            {/* Action Buttons */}
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              justifyContent="center"
            >
              <Button
                onClick={handleGoHome}
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "#00695C",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  "&:hover": { bgcolor: "#075e54" },
                }}
              >
                Return to Home
              </Button>

              <Button
                onClick={handleLogout}
                variant="outlined"
                size="large"
                sx={{
                  color: "#d32f2f",
                  borderColor: "#d32f2f",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  "&:hover": { 
                    bgcolor: "#FFEBEE",
                    borderColor: "#c62828" 
                  },
                }}
              >
                Log Out
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ErrorPage;