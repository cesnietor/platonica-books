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

            <Editor initialContent={content} onSave={onSave} />
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
