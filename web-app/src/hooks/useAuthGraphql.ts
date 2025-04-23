import { useEffect, useRef } from "react";
import { GraphQLClient } from "graphql-request";
import { useAuth } from "./useAuth";

const ENDPOINT = import.meta.env.VITE_API_ROOT + "/graphql";

export function useAuthGraphql(): GraphQLClient {
  const { access } = useAuth();

  const clientRef = useRef(
    new GraphQLClient(ENDPOINT, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }),
  );

  // Update the Authorization header whenever `access` changes
  useEffect(() => {
    if (access) {
      clientRef.current.setHeader("Authorization", `Bearer ${access}`);
    } else {
      // Reset headers if logged out
      clientRef.current.setHeaders({ "Content-Type": "application/json" });
    }
  }, [access]);

  return clientRef.current;
}
