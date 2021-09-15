import { useEffect, useState } from "react";

interface Props {
  data?: any;
  loading?: boolean;
  error?: any;
}

export const useFetch = (url: string) => {
  const promiseValue: Props = { data: null, loading: true, error: null };
  const [state, setState] = useState(promiseValue);
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
