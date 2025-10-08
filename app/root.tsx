import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

import type { Route } from "./+types/root";
import "./app.css";
import { subscribeProducts } from "./hooks/useProducts";
import { useEffect } from "react";

import useProductsStore from "./stores/useProductsStore";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

// TODO: why persister cause issue of infinite loop in list page?
// Only create persister on client side
let localStoragePersister: any = null;

// if (typeof window !== "undefined") {
//   localStoragePersister = createAsyncStoragePersister({
//     storage: window.localStorage,
//   });

//   persistQueryClient({
//     queryClient,
//     persister: localStoragePersister,
//     maxAge: 1000,
//   });
// }

export function Layout({ children }: { children: React.ReactNode }) {
  const dehydratedState = dehydrate(queryClient);
  useEffect(() => {
    const unsubscribe = subscribeProducts(queryClient)
    return () => unsubscribe?.()
  }, [])
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            {children}
          </HydrationBoundary>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
