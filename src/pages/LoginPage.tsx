import React, { useContext, useState } from 'react';
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
  Divider,
  Container,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AccountBalance,
} from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.ts";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { UserContext } from '../App.tsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

  try {
    // Sign in with email and password using Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User info:", user);
    const token = await user.getIdToken();
    console.log("Id token: ", token);
    userContext?.setFbToken(token);
    // Login successful message
    alert(`Welcome back, ${user.email}!`);
    console.log("User info:", user);
    
    // Navigate to home page after successful login
    navigate('/home');
  } catch (error) {
    // Show error on login failure
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    alert("Login failed: " + errorMessage);
  }
};


  return (
    <Box sx={{ 
      minHeight: "100vh", 
      flexDirection: "column",   
      background: `
        linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%),
        radial-gradient(circle at 25% 25%, rgba(27, 109, 106, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(27, 109, 106, 0.06) 0%, transparent 50%),
        conic-gradient(from 0deg at 50% 50%, rgba(27, 109, 106, 0.03) 0deg, transparent 60deg, rgba(27, 109, 106, 0.03) 120deg, transparent 180deg, rgba(27, 109, 106, 0.03) 240deg, transparent 300deg, rgba(27, 109, 106, 0.03) 360deg)
      `,
      backgroundSize: '100% 100%, 600px 600px, 800px 800px, 1200px 1200px',
      backgroundPosition: '0 0, -100px -100px, calc(100% + 100px) calc(100% + 100px), center center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(27, 109, 106, 0.04) 0%, transparent 30%),
          radial-gradient(circle at 80% 20%, rgba(27, 109, 106, 0.04) 0%, transparent 30%),
          radial-gradient(circle at 40% 40%, rgba(27, 109, 106, 0.02) 0%, transparent 40%)
        `,
        backgroundSize: '400px 400px, 500px 500px, 300px 300px',
        backgroundPosition: '0 0, 100% 100%, 50% 50%',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
        zIndex: 0
      }
    }}>
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
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(52, 151, 15, 0.05)', // Unified background color (light green/gray/beige works)
    borderRadius: 4,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Optional, add a subtle elevation effect
  }}
>

        <Box sx={{ display: "flex", gap: 4, alignItems: "center", flexDirection: { xs: "column", md: "row" } }}>
          {/* Left side: Features */}
          <Box sx={{ flex: 1, pr: { md: 4 } }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: "#1b6d6a", mb: 3 }}>
              Your budgeting partner for life
            </Typography>
            <Typography variant="h6" sx={{ color: "#666", mb: 4, lineHeight: 1.6 }}>
              With personalized insights and secure tools, we help you track every expense, plan for the
              future, and build lasting financial confidence.
            </Typography>

            {/* Features Grid */}
            {/* Features Grid */}
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        rowGap: 3,        // Control vertical spacing
    columnGap: 6,
    mt: 3,
    justifyContent: "center",   // Center the content
    alignItems: "start",         // Prevent vertical overlap
  }}
>
  <Box
    sx={{
      p: 2.5,
      backgroundColor: "#f8f9fa",
      borderRadius: 2,
      maxWidth: 300,
      width: "100%",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease",
      "&:hover": { transform: "translateY(-4px)" },
    }}
  >
    <Typography variant="h6" sx={{ color: "#1b6d6a", mb: 1 }}>
      Seamless Bank Integration
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Direct bank account link
    </Typography>
  </Box>

  <Box
    sx={{
      p: 2.5,
      backgroundColor: "#f8f9fa",
      borderRadius: 2,
      maxWidth: 300,
      width: "100%",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease",
      "&:hover": { transform: "translateY(-4px)" },
    }}
  >
    <Typography variant="h6" sx={{ color: "#1b6d6a", mb: 1 }}>
      AI Budgeting Insights
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Personalized guidance for smarter spending
    </Typography>
  </Box>

  <Box
    sx={{
      p: 2.5,
      backgroundColor: "#f8f9fa",
      borderRadius: 2,
      maxWidth: 300,
      width: "100%",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease",
      "&:hover": { transform: "translateY(-4px)" },
    }}
  >
    <Typography variant="h6" sx={{ color: "#1b6d6a", mb: 1 }}>
      Data Filtering
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Track your data by month or week
    </Typography>
  </Box>

  <Box
    sx={{
      p: 2.5,
      backgroundColor: "#f8f9fa",
      borderRadius: 2,
      maxWidth: 300,
      width: "100%",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease",
      "&:hover": { transform: "translateY(-4px)" },
    }}
  >
    <Typography variant="h6" sx={{ color: "#1b6d6a", mb: 1 }}>
      Visual Dashboard+
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Charts that make your money clear
    </Typography>
  </Box>
</Box>

          </Box>

          {/* Right side: Login Form */}
          <Box sx={{ flex: 1, maxWidth: 400, mx: "auto" }}>
            <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: "#1b6d6a", mb: 1 }}>
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to your account
                  </Typography>
                </Box>


                <form onSubmit={handleLogin}>
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
                    sx={{ mb: 2 }}
                  />

                  {/* Password Field */}
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
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
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  {/* Forgot Password Link */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: "#1b6d6a" }}>
                    Forgot password?
                  </Link>
                  </Box>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      backgroundColor: "#1b6d6a",
                      '&:hover': { backgroundColor: "#155a58" },
                      mb: 3,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Sign In
                  </Button>
                </form>

                {/* Divider */}
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    or
                  </Typography>
                </Divider>

                {/* Sign Up Link */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{" "}
                    <Link component={RouterLink} to="/signup" variant="body2" sx={{ color: "#1b6d6a", fontWeight: "bold" }}>
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#1b6d6a", color: "white", py: 3, mt: "auto" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2025 Commerce Bank. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              By logging in, you agree to Commerce Bank's Terms of Use and Privacy Policy.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>

  );
}