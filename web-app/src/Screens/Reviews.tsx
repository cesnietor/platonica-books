import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "../graphqlClient";
import BookCover from "./BookCover";
import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const GetBookReviewsQuery = gql`
  query {
    reviews {
      book {
        uuid
        title
        thumbnailUrl
      }
    }
  }
`;

function BookReviews() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => graphQLClient.request(GetBookReviewsQuery),
  });

  const [bookUUID, setBookUUID] = useState<string>(""); // Initially no WebSocket connection

  const navigate = useNavigate();

  useEffect(() => {
    if (bookUUID) {
      navigate(`/books/${bookUUID}`, { replace: true });
    }
  }, [navigate, bookUUID]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;

  return (
    <>
      <Box
        id="reviews-list"
        sx={{
          margin: "20px",
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
            const { title, thumbnailUrl, uuid } = r.book;
            return (
              <Grid>
                <BookCover
                  bookName={title}
                  imageUrl={thumbnailUrl}
                  onClick={() => {
                    setBookUUID(uuid);
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}

export default BookReviews;
