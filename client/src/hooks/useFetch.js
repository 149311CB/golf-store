import { useEffect, useState } from "react";

export const useFetch = (url) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    // set loading to true
    setState((state) => ({ ...state, loading: true }));
    //fetching data
    fetch(url)
      .then((response) => response.json())
      .then((data) => setState({ data: data, loading: false }))
      .catch((error) => {
        setState((state) => ({ ...state, error: error }));
      });
  }, [url, setState]);
  return state;
};
