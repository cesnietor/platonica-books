import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "../graphqlClient";
import BookCover from "./BookCover";
import { Box, Grid } from "@mui/material";

const GetBooksQuery = gql`
  query {
    books {
      name
      pubDate
      imageUrl
    }
  }
`;

function Books() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: () => graphQLClient.request(GetBooksQuery),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;

  return (
    <>
      <h1>Platonica</h1>
      <Box
        id="books-list"
        sx={{
          margin: "20px",
        }}
      >
        <Grid
          container
          spacing={2}
          direction="row"
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {data.books.map((b) => {
            return (
              <Grid>
                <BookCover imageUrl={b.imageUrl} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}

export default Books;
