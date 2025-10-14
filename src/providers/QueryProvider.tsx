"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

let client: QueryClient | null = null;
function getClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 30,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });
  }
  return client;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = React.useMemo(() => getClient(), []);
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
