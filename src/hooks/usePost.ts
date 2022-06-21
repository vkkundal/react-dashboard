import { useCallback, useState } from "react"
import { api } from "../api";



export const usePost = <T>(url: string) => {
    const [isSending, setIsSending] = useState(false);
    const [isError,setError] = useState(null);
    const post = useCallback(async (data: T) => {
        setError(null);
        setIsSending(true);
        try {
             const res = await api.post(url,data);
             setIsSending(false);
             return res
             
        }catch(e){
            setError(e);
            console.log(e);
            setIsSending(false);
            throw e;
        }
        
    }, [])
    return {isSending, isError, post}
}