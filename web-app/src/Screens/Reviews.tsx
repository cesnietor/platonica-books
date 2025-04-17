import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "../graphqlClient";
import BookCover from "./BookCover";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const GetBookReviewsQuery = gql`
  query {
    reviews {
      book {
        uuid
        title
        thumbnailUrl
        smallThumbnailUrl
      }
    }
  }
`;

function Reviews() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => graphQLClient.request(GetBookReviewsQuery),
  });

  const [bookUUID, setBookUUID] = useState<string>(""); // Initially no WebSocket connection

  const navigate = useNavigate();

  useEffect(() => {
    if (bookUUID) {
      navigate(`/books/${bookUUID}`);
    }
  }, [navigate, bookUUID]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;

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
          <Box
            id="reviews-list"
            sx={{
              margin: "10px",
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Reviews
            </Typography>
            <Grid
              container
              spacing={2}
              direction="row"
              sx={{
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {data.reviews.map((r) => {
                const { title, thumbnailUrl, smallThumbnailUrl, uuid } = r.book;
                return (
                  <Grid key={`book-grid-item-${uuid}`}>
                    <BookCover
                      bookName={title}
                      imageUrl={thumbnailUrl}
                      fallbackImageUrl={smallThumbnailUrl}
                      onClick={() => {
                        setBookUUID(uuid);
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Reviews;
