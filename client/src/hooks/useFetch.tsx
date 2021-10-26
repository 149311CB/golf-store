import {useEffect, useState} from "react";
import {client} from "../utils/client";

interface Props {
    data?: any;
    loading?: boolean;
    error?: any;
}

export const useFetch = (url: string) => {
    const promiseValue: Props = {data: null, loading: true, error: null};
    const [state, setState] = useState(promiseValue);

    useEffect(() => {
        setState((state) => ({...state, loading: true})); // This line cause re-render

        const fetchData = async () => {
            try {
                const data = await client.get(url);
                setState({data: data, loading: false}); // This line cause re-render
            } catch (error) {
                setState({loading: false, error});
            }
        };

        // This task being queue
        fetchData().then()
    }, [url]);
    return state;
};
