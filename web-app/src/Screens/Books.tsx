import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from '../graphqlClient';

const GetBooksQuery = gql`
  query {
        books {
            name
            pubDate
        }
    }`;



function Books() {
    const { data , isLoading, isError} = useQuery({
        queryKey: ['books'],
        queryFn: () => graphQLClient.request(GetBooksQuery),
      });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error!</div>;

    console.log("data", data)
    return (
        <>
        <h1>Books</h1>
        <pre>
        {data.books.map((b) => {
            return (
            <li key={b.name}>
                {b.name} ({b.pubDate})
            </li>
            );
        }

       )}
        </pre>
        </>
    )
}

export default Books;
