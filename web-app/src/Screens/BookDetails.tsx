import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "../graphqlClient";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";

const GetBookReviewsQuery = gql`
  query GetBook($uuid: UUID!) {
    book(uuid: $uuid) {
      uuid
      title
      authors
      pubDate
      pageCount
      thumbnailUrl
      smallThumbnailUrl
      googleBooksId
    }
  }
`;

function BookDetails() {
  const { uuid } = useParams<{ uuid: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["book", uuid],
    queryFn: () => graphQLClient.request(GetBookReviewsQuery, { uuid }),
    enabled: !!uuid,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data?.book) {
    return (
      <Box mt={4}>
        <Alert severity="error">Error loading book details.</Alert>
      </Box>
    );
  }

  const { title, authors, pubDate, pageCount, googleBooksId } = data.book;

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ maxWidth: 600, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {title}
          </Typography>
          {authors && authors.length > 0 && (
            <Typography variant="subtitle1" color="text.secondary">
              {authors.join(", ")}
            </Typography>
          )}
          {pubDate && (
            <Typography variant="body2" color="text.secondary">
              Published: {pubDate}
            </Typography>
          )}
          {pageCount && (
            <Typography variant="body2" color="text.secondary">
              Pages: {pageCount}
            </Typography>
          )}
          {googleBooksId && (
            <Typography variant="body2" color="text.secondary">
              Google Books ID: {googleBooksId}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default BookDetails;
