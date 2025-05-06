import { useQuery } from "@tanstack/react-query";
import BookCover from "./BookCover";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthGraphql } from "../hooks/useAuthGraphql";
import { GetReviewsQuery, getSdk } from "../generated/graphql";

function Reviews() {
  const client = useAuthGraphql();

  const sdk = getSdk(client);

  const { data, isLoading, isError } = useQuery<GetReviewsQuery, Error>({
    queryKey: ["reviews"],
    queryFn: () => sdk.GetReviews(),
  });

  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Card sx={{ display: "flex", width: "100%", maxWidth: 1200 }}>
        <CardContent
          sx={{
            display: "flex",
            width: "100%",
            gap: 4, // FIXME: gap is ignored, make it so that title
            // keeps showing ellipses but it respects dynamic response of Grid
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
                alignItems: "start",
              }}
            >
              {data &&
                data.reviews.map((r) => {
                  const rUUID = r.uuid;
                  return (
                    //  TODO: abstract this
                    <Grid
                      key={`review-book-cover-item-${rUUID}`}
                      container
                      direction="column"
                      sx={{
                        width: 120, // Fixed Width for both Cover and Title
                      }}
                    >
                      <Grid key={`review-book-cover-item-${rUUID}`}>
                        <BookCover
                          bookName={r.book?.title}
                          imageUrl={r.book?.thumbnailUrl || ""}
                          fallbackImageUrl={r.book?.smallThumbnailUrl || ""}
                          onClick={() => {
                            navigate(`/reviews/${rUUID}/book`);
                          }}
                        />
                      </Grid>
                      <Grid
                        key={`review-book-title-item-${rUUID}`}
                        sx={{ width: "100%" }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            whiteSpace: "normal",
                            // enable the WebKit line‑clamp technique
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2, // Max two lines
                            overflow: "hidden",

                            // optional: adjust spacing/line-height
                            lineHeight: 1.3,
                          }}
                        >
                          {r.book?.title || "N/A"}
                        </Typography>
                      </Grid>
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
