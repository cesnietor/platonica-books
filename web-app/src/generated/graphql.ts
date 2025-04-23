import { GraphQLClient, RequestOptions } from "graphql-request";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  UUID: { input: string; output: string };
};

export type BookInfoType = {
  __typename?: "BookInfoType";
  authors: Maybe<Array<Scalars["String"]["output"]>>;
  dateFinished: Maybe<Scalars["String"]["output"]>;
  datePublished: Maybe<Scalars["String"]["output"]>;
  dateStarted: Maybe<Scalars["String"]["output"]>;
  googleBooksId: Maybe<Scalars["String"]["output"]>;
  imageMediumUrl: Maybe<Scalars["String"]["output"]>;
  imageSmallUrl: Maybe<Scalars["String"]["output"]>;
  pageCount: Maybe<Scalars["Int"]["output"]>;
  smallThumbnailUrl: Maybe<Scalars["String"]["output"]>;
  thumbnailUrl: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  uuid: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  book: Maybe<BookInfoType>;
  review: Maybe<ReviewInfoType>;
  reviews: Array<ReviewInfoType>;
};

export type QueryBookArgs = {
  uuid: Scalars["UUID"]["input"];
};

export type QueryReviewArgs = {
  uuid: Scalars["UUID"]["input"];
};

export type ReviewInfoType = {
  __typename?: "ReviewInfoType";
  book: Maybe<BookInfoType>;
  text: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  uuid: Scalars["String"]["output"];
};

export type GetBookQueryVariables = Exact<{
  bookUuid: Scalars["UUID"]["input"];
}>;

export type GetBookQuery = {
  __typename?: "Query";
  book: {
    __typename?: "BookInfoType";
    title: string;
    authors: Array<string> | null;
    pageCount: number | null;
    thumbnailUrl: string | null;
    imageMediumUrl: string | null;
  } | null;
};

export const GetBookDocument = gql`
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

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    GetBook(
      variables: GetBookQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetBookQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBookQuery>(GetBookDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "GetBook",
        "query",
        variables
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
