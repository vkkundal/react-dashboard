import { api } from "api";
import { useCallback, useState } from "react";

export const usePut = <T, >(url: string) => {
    const [isSending, setIsSending] = useState(false);
    const [isError,setError] = useState(null);
    const put = useCallback(async (data: T) => {
        setError(null);
        setIsSending(true);
        try {
             await api.put(url,data);
             setIsSending(false);
        }catch(e){
            setError(e);
            setIsSending(false);
            throw e;
        }
    }, [url])
    return {isSending, isError, put, setIsSending}
}