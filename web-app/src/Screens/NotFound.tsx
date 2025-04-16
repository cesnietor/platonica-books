import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Sorry, the page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        component={RouterLink}
        to="/"
      >
        Go to Homepage
      </Button>
    </Box>
  );
}

export default NotFound;
