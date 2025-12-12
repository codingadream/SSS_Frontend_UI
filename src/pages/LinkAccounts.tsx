// src/pages/AddFirstAccountPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Container,
} from "@mui/material";
import { AccountBalance as BankIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { usePlaidLink } from "react-plaid-link";
import { useNavigate } from "react-router-dom"; // Assuming react-router-dom is used
import { LoadingSpinner } from "../components/LoadingSpinner";
import { callSync } from "../helpers";
import toast from "react-hot-toast";

const LinkAccounts: React.FC = () => {
  const { currentUser } = useAuth();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Generate the Plaid Link Token on mount
  const generateToken = async () => {
    try {
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
    } catch (error) {
      console.error("Error generating link token", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (currentUser) {
      generateToken();
    }
  }, [currentUser]);

  // 2. Define what happens after a user successfully links a bank
  const handleSuccess = async () => {
    toast.success("Account successfully linked!");
    // Redirect to the main dashboard after success
    navigate("/home"); 
  };

  if (loading) return <LoadingSpinner />;

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
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#E0F2F1",
                color: "#00695C",
                mx: "auto",
                mb: 3,
              }}
            >
              <BankIcon sx={{ fontSize: 32 }} />
            </Avatar>

            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: "#0b1721" }}>
              Connect your Bank
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: "80%", mx: "auto" }}>
              To get started, please link your primary bank account. This allows us to securely sync your transactions and help you manage your finances.
            </Typography>

            {/* Render the Plaid Button only if we have a token */}
            {linkToken && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <OnboardingPlaidButton 
                  linkToken={linkToken} 
                  onComplete={handleSuccess} 
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

// --- Sub-component to handle Plaid Logic ---

interface PlaidButtonProps {
  linkToken: string;
  onComplete: () => void;
}

const OnboardingPlaidButton: React.FC<PlaidButtonProps> = ({ linkToken, onComplete }) => {
  const { currentUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const exchangeToken = async (publicToken: string) => {
    const token = await currentUser?.getIdToken();
    await fetch(
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
  };

  const onSuccess = useCallback(
    async (public_token: string) => {
      setIsProcessing(true);
      try {
        await exchangeToken(public_token);
        await callSync(currentUser);
        onComplete();
      } catch (err) {
        console.error("Error linking account:", err);
        toast.error("Failed to link account. Please try again.");
        setIsProcessing(false);
      }
    },
    [currentUser, onComplete]
  );

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <Button
      onClick={() => open()}
      disabled={!ready || isProcessing}
      variant="contained"
      size="large"
      sx={{
        bgcolor: "#00695C",
        px: 6,
        py: 1.5,
        fontSize: "1.1rem",
        borderRadius: 2,
        textTransform: "none",
        "&:hover": { bgcolor: "#075e54" },
      }}
    >
      {isProcessing ? "Syncing Data..." : "Add Account"}
    </Button>
  );
};

export default LinkAccounts;