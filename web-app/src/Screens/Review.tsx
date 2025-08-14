import { useMutation, useQuery } from "@tanstack/react-query";
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
import { ReviewLayoutContext } from "../types";
import { useAuthGraphql } from "../hooks/useAuthGraphql";
import {
  GetReviewQuery,
  getSdk,
  UpdateReviewMutation,
  UpdateReviewMutationVariables,
} from "../generated/graphql";
import Editor from "../Editor/Editor";

function Review() {
  const client = useAuthGraphql();
  const { reviewUuid } = useParams<{ reviewUuid: string }>();
  const sdk = getSdk(client);

  const { data, isLoading, isError } = useQuery<GetReviewQuery, Error>({
    queryKey: ["review", reviewUuid],
    queryFn: () => sdk.GetReview({ reviewUuid: reviewUuid || "" }),
    enabled: Boolean(reviewUuid),
  });

  // FIXME: Handle error and loading state
  // TODO: Add success message after saving
  const {
    mutate,
    // data,
    // error,
    // isPending: isLoading,
    // isError,
    // isSuccess,
  } = useMutation<
    UpdateReviewMutation["updateReview"], // mutation result
    Error, // error
    UpdateReviewMutationVariables // variables type
  >({
    mutationFn: (variables) =>
      sdk.UpdateReview(variables).then((res) => res.updateReview),
  });

  function onSave(content: string): void {
    mutate({
      input: {
        uuid: reviewUuid || "",
        title: "New Title",
        content: content,
      },
    });
  }
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

  const { title, content, book } = data.review;

  const contextValue: ReviewLayoutContext = { bookUuid: book?.uuid || "" };
  return (
    <Box p={4} display="flex" justifyContent="center">
      <Card
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1200,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "stretch",
            width: "100%",
            gap: 4,
          }}
        >
          {/* Left Column: Editor */}
          <Box
            sx={{
              // Let it be full width on small screens; ~65% on md+
              flex: { xs: "1 1 100%", md: "1 1 65%" },
              minWidth: 0, // allow content to shrink instead of forcing overflow
            }}
          >
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
            <Editor initialContent={content} onSave={onSave} />
          </Box>

          {/* Vertical Divider */}
          <Divider
            orientation="vertical"
            sx={{ display: { xs: "none", md: "block" } }}
          />
          {/* Right Column: Book Details */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              maxWidth: 220,
              height: "100%",
            }}
          >
            <Outlet context={contextValue} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Review;
