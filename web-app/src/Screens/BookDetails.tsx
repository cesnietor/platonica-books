import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { useOutletContext } from "react-router-dom";
import { Alert, Box, Typography, CircularProgress } from "@mui/material";
import BookCover from "./BookCover";
import { ReviewLayoutContext } from "../types";
import { useAuthGraphql } from "../hooks/useAuthGraphql";

const GetBookQuery = gql`
  query GetBook($bookUuid: UUID!) {
    book(uuid: $bookUuid) {
      title
      authors
      pageCount
      thumbnailUrl
      imageMediumUrl
    }
  }
`;

function BookDetails() {
  const client = useAuthGraphql();
  const { bookUuid } = useOutletContext<ReviewLayoutContext>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["book", bookUuid],
    queryFn: () => client.request(GetBookQuery, { bookUuid }),
    enabled: !!bookUuid,
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
    pageCount,
    imageMediumUrl: imageUrl,
    thumbnailUrl,
  } = data.book;

  return (
    <Box p={4} display="flex" justifyContent="center">
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
    </Box>
  );
}

export default BookDetails;
