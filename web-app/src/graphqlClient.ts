import { GraphQLClient } from "graphql-request";

const endpoint = "http://localhost:8000/app/graphql";
export const graphQLClient = new GraphQLClient(endpoint);
