import { useQuery } from "@tanstack/react-query";
import BookCover from "./BookCover";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthGraphql } from "../hooks/useAuthGraphql";
import { GetReviewsQuery, getSdk } from "../generated/graphql";
import { useState } from "react";

function Reviews() {
  const client = useAuthGraphql();
  const sdk = getSdk(client);
  const [addReviewModalOpen, setAddReviewModalOpen] = useState<boolean>(false);
  const [newReviewName, setNewReviewName] = useState<string>("");
  const [newReviewBookID, setNewReviewBookID] = useState<string>("");

  const { data, isLoading, isError } = useQuery<GetReviewsQuery, Error>({
    queryKey: ["reviews"],
    queryFn: () => sdk.GetReviews(),
  });

  const navigate = useNavigate();
  const handleAddReviewModalOpen = () => setAddReviewModalOpen(true);
  const handlAddReviewModalClose = () => setAddReviewModalOpen(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = newReviewName.trim();
    if (!v) return;
    handlAddReviewModalClose();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;

  return (
    <>
      <Dialog
        open={addReviewModalOpen}
        onClose={handlAddReviewModalClose} // closes on backdrop click or Esc
        keepMounted // optional: keep contents mounted for perf
        aria-labelledby="addreview-modal-dialog"
      >
        <DialogTitle id="addreview-modal-dialog-title">
          Create Review
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              autoFocus
              fullWidth
              label={"Review Title"}
              value={newReviewName}
              onChange={(e) => setNewReviewName(e.target.value)}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Book ID"
              value={newReviewBookID}
              onChange={(e) => setNewReviewBookID(e.target.value)}
              margin="dense"
            />
            <Typography variant="caption" gutterBottom>
              You'll be redirected to the Editor after this step.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlAddReviewModalClose} variant="text">
              Cancel
            </Button>
            <Button onClick={handlAddReviewModalClose} variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Box p={4} display="flex" justifyContent="center">
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Reviews
            </Typography>
            <Button
              onMouseDown={(e) => e.preventDefault()}
              variant="outlined"
              sx={{
                marginBottom: 1,
              }}
              onClick={handleAddReviewModalOpen}
            >
              {"Create Review"}
            </Button>
          </Box>

          <Card sx={{ display: "flex", width: "100%", maxWidth: 1200 }}>
            <CardContent
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box
                id="reviews-list"
                sx={{
                  margin: "10px",
                }}
              >
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
                      const authors = r.book?.authors ?? [];
                      const [first, ...rest] = authors;
                      const bookAuthor =
                        (first ?? "") + (rest.length > 0 ? "*" : "");
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
                              fallbackImageUrl={r.book?.imageSmallUrl || ""}
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
                            <Typography
                              variant="caption"
                              sx={{
                                whiteSpace: "normal",
                                // enable the WebKit line‑clamp technique
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 1, // Max two lines
                                overflow: "hidden",
                                // optional: adjust spacing/line-height
                                lineHeight: 2,
                              }}
                            >
                              by {bookAuthor || "N/A"}
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
      </Box>
    </>
  );
}

export default Reviews;
