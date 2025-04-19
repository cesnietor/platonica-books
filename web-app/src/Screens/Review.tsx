import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "../graphqlClient";
import { Outlet, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import BookDetails from "./BookDetails";
import { ReviewLayoutContext } from "../types";

const GetBookQuery = gql`
  query GetBook($reviewUuid: UUID!) {
    review(uuid: $reviewUuid) {
      title
      text
      book {
        uuid
      }
    }
  }
`;

function Review() {
  const { reviewUuid } = useParams<{ reviewUuid: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["review", reviewUuid],
    queryFn: () => graphQLClient.request(GetBookQuery, { reviewUuid }),
    enabled: !!reviewUuid,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data?.review) {
    return (
      <Box mt={4}>
        <Alert severity="error">Error loading book details.</Alert>
      </Box>
    );
  }

  const { title, text, book } = data.review;

  const contextValue: ReviewLayoutContext = { bookUuid: book.uuid };
  return (
    <Box p={4} display="flex" justifyContent="center">
      <Card sx={{ display: "flex", width: "100%", maxWidth: 1200 }}>
        <CardContent
          sx={{
            display: "flex",
            width: "100%",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Left Column: Content */}
          <Box flex={1}>
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" paragraph>
              {text}
            </Typography>
          </Box>

          {/* Vertical Divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" } }}
          />
          <Outlet context={contextValue} />
          {/* <BookDetails uuid={bookUUID} /> */}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Review;
