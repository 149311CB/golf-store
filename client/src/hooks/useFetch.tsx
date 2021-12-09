import { useEffect, useState } from "react";
import { client } from "../utils/client";

interface Props {
  data?: any;
  loading?: boolean;
  error?: any;
}

export enum Method {
  GET = "GET",
  POST = "POST",
}

export const useFetch = (
  url: string,
  body?: any,
  method?: Method,
  isExecute?: boolean
) => {
  if (isExecute === undefined) {
    isExecute = true;
  }
  const promiseValue: Props = { data: null, loading: true, error: null };
  const [state, setState] = useState(promiseValue);

  useEffect(() => {
    if (!isExecute) return;
    setState((state) => ({ ...state, loading: true })); // This line cause re-render

    const fetchData = async () => {
      try {
        let data = null;
        if (method === Method.GET) {
          data = await client.get(url);
          console.log(data)
        }
        if (method === Method.POST) {
          data = await client.post(url, body);
        }
        setState({ data: data, loading: false }); // This line cause re-render
      } catch (error) {
        setState({ loading: false, error });
      }
    };

    // This task being queue
    fetchData().then();
  }, [url, body, method, isExecute]);
  return state;
};
