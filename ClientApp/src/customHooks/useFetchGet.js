import { useState, useEffect } from 'react'

const useFetchGet = (url) => {
    const [data, setData] = useState();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState();
    const [httpResposne, setHttpResposne] = useState();

    useEffect(() => {
        const abortController = new AbortController();
        fetch(url, {
          signal: abortController.signal
        })
        .then(response => {
          setHttpResposne(response.status);
          console.log(response);
          return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            setData(responseData);
            setIsPending(false);
        })
        .catch(err => setError(err.message));
        return () => abortController.abort();
      }, [url])

      return {data, isPending, error, httpResposne};
}

export default useFetchGet;