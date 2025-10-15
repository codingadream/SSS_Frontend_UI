import { Grid, Box, Typography, TextField, Button, Checkbox, FormControlLabel, Link } from "@mui/material";

export default function LoginPage() {
  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* 左侧：品牌与介绍 */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "#1b6d6a",
          color: "white",
          p: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Your budgeting partner for life
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          With personalized insights and secure tools, we help you track every expense, plan for the
          future, and build lasting financial confidence.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Smart Transfers</Typography>
          <Typography variant="body2">Send money instantly and securely</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            AI Budget Coach
          </Typography>
          <Typography variant="body2">Personalized guidance for smarter spending</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Data Insights
          </Typography>
          <Typography variant="body2">Automatic reports and trends</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Visual Dashboard+
          </Typography>
          <Typography variant="body2">Charts that make your money clear</Typography>
        </Box>
      </Grid>

      {/* 右侧：登录表单 */}
      <Grid
        item
        xs={12}
        md={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ p: 4 }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom>
            Welcome to Commerce Bank
          </Typography>

          <TextField fullWidth label="Email" margin="normal" />
          <TextField fullWidth label="Password" type="password" margin="normal" />

          <FormControlLabel control={<Checkbox />} label="Remember me" />

          <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#1b6d6a" }}>
            Sign In
          </Button>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Don't have an account? <Link href="#">Sign up</Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
