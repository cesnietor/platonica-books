import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "../graphqlClient";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import BookCover from "./BookCover";

const GetBookQuery = gql`
  query GetBook($uuid: UUID!) {
    book(uuid: $uuid) {
      uuid
      title
      authors
      pubDate
      pageCount
      thumbnailUrl
      smallThumbnailUrl
      imageSmallUrl
      imageMediumUrl
      googleBooksId
    }
  }
`;

function BookDetails() {
  const { uuid } = useParams<{ uuid: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["book", uuid],
    queryFn: () => graphQLClient.request(GetBookQuery, { uuid }),
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

  const {
    title,
    authors,
    pubDate,
    pageCount,
    imageMediumUrl: imageUrl,
    thumbnailUrl,
    googleBooksId,
  } = data.book;

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
              Welcome to the Library
            </Typography>
            <Typography variant="body1" paragraph>
              Discover insightful reads and timeless classics. Our collection is
              curated with care to fuel your curiosity and inspire your
              imagination.
            </Typography>
            <Typography variant="body1" paragraph>
              Whether you're researching for a project or escaping into a novel,
              you'll find something that captures your interest and keeps you
              turning the pages.
            </Typography>
            <Typography variant="body1" paragraph>
              Dive in and explore a world of ideas. Use the sidebar to learn
              more about any book in our digital collection.
            </Typography>
          </Box>

          {/* Vertical Divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" } }}
          />

          {/* Right Column: Book Details */}
          <Box width={200} flexShrink={0}>
            <Box
              sx={{
                marginBottom: "20px",
              }}
            >
              <BookCover
                bookName={title}
                imageUrl={imageUrl}
                fallbackImageUrl={thumbnailUrl}
                width={"100%"}
                height={"100%"}
              />
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            {authors && authors.length > 0 && (
              <Typography variant="subtitle2" color="textPrimary">
                {authors.join(", ")}
              </Typography>
            )}
            {pageCount && (
              <Typography variant="subtitle2" color="text.secondary">
                Pages: {pageCount}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default BookDetails;
