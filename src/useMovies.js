import { useState, useEffect } from "react";

const KEY = "f84fc31d";

// A custom hook for fetching and managing movies based on a query
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // Create an AbortController to handle aborting fetch requests
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      // If query is too short, clear movies and error
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      // Fetch movies and return a cleanup function
      fetchMovies();

      // Cleanup function to abort the fetch request if the component unmounts
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  // Return the fetched movies, loading state, and error
  return { movies, isLoading, error };
}
