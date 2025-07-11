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
  K extends keyof T,
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

export type Mutation = {
  __typename?: "Mutation";
  updateReview: Maybe<ReviewInfoType>;
};

export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
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
  content: Scalars["String"]["output"];
  text: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  uuid: Scalars["String"]["output"];
};

export type UpdateReviewInput = {
  content: InputMaybe<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
  uuid: Scalars["UUID"]["input"];
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

export type GetReviewQueryVariables = Exact<{
  reviewUuid: Scalars["UUID"]["input"];
}>;

export type GetReviewQuery = {
  __typename?: "Query";
  review: {
    __typename?: "ReviewInfoType";
    title: string;
    text: string;
    content: string;
    book: { __typename?: "BookInfoType"; uuid: string } | null;
  } | null;
};

export type GetReviewsQueryVariables = Exact<{ [key: string]: never }>;

export type GetReviewsQuery = {
  __typename?: "Query";
  reviews: Array<{
    __typename?: "ReviewInfoType";
    uuid: string;
    book: {
      __typename?: "BookInfoType";
      uuid: string;
      title: string;
      thumbnailUrl: string | null;
      smallThumbnailUrl: string | null;
      authors: Array<string> | null;
    } | null;
  }>;
};

export type UpdateReviewMutationVariables = Exact<{
  input: UpdateReviewInput;
}>;

export type UpdateReviewMutation = {
  __typename?: "Mutation";
  updateReview: {
    __typename?: "ReviewInfoType";
    uuid: string;
    title: string;
    content: string;
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
export const GetReviewDocument = gql`
  query GetReview($reviewUuid: UUID!) {
    review(uuid: $reviewUuid) {
      title
      text
      content
      book {
        uuid
      }
    }
  }
`;
export const GetReviewsDocument = gql`
  query GetReviews {
    reviews {
      uuid
      book {
        uuid
        title
        thumbnailUrl
        smallThumbnailUrl
        authors
      }
    }
  }
`;
export const UpdateReviewDocument = gql`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      uuid
      title
      content
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    GetBook(
      variables: GetBookQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetBookQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBookQuery>(GetBookDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "GetBook",
        "query",
        variables,
      );
    },
    GetReview(
      variables: GetReviewQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetReviewQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetReviewQuery>(GetReviewDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "GetReview",
        "query",
        variables,
      );
    },
    GetReviews(
      variables?: GetReviewsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetReviewsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetReviewsQuery>(GetReviewsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "GetReviews",
        "query",
        variables,
      );
    },
    UpdateReview(
      variables: UpdateReviewMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdateReviewMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateReviewMutation>(
            UpdateReviewDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "UpdateReview",
        "mutation",
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
