import { useRouteError } from "react-router-dom";
import { Box, Alert, AlertTitle, Container } from "@mui/material";

export default function GlobalErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Box>
        <Alert severity="error">
          <AlertTitle>Something went wrong</AlertTitle>
          {error.message}
        </Alert>
      </Box>
    </Container>
  );
}
