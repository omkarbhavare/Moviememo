import { useState, useEffect } from "react";

// A custom hook for managing state in localStorage
export function useLocalStorageState(initialState, key) {
  // Initialize state with stored value or initial value
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  // Use useEffect to update localStorage when value changes
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  // Return the state and a function to update the state
  return [value, setValue];
}
