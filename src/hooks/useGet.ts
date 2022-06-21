import { useCallback, useEffect, useState } from "react"
import { api } from "../api"
import qs from "querystring"

const isDefined = (vals: any[]) => {
    let val = true;
    for(let i = 0; i<vals.length; i++){
        const item = vals[i];
        if(!item){
            val = false;
            break;
        }
    }
    return val;
}
const emptryArr: never[] = [];

export const useGet = <T extends any, P extends any = any>(url: string, defaultVal: T, dependsOn: any[] = emptryArr) => {
    
    const [data, setState] = useState<T>(defaultVal)
    const [isReady, setIsReady] = useState(false)
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async (query?: Partial<P>) => {
        setIsReady(false);
        setError(null);
        {val: undefined}
        let newUrl = url;
        if(query){
            const keys = Object.keys(query);
            let emptyObj: Partial<P> = {};
            keys.forEach(key => {
                if(typeof query[key as keyof P] !== "undefined"){
                    emptyObj[key as keyof P] = query[key as keyof P];
                }
            })
            newUrl = url + "?" + qs.stringify(emptyObj as any)
        }
        try {
            const res = await api.get(newUrl);
            setState(res.data);
            setIsReady(true);
            return res.data as T;
        } catch(e){
            setError(e)
        }
       
    }, [url])
    useEffect(() => {
        if(dependsOn.length === 0 || isDefined(dependsOn)){
           fetchData()
        } 
    },dependsOn)

    return { data, isReady, error, refetchData:fetchData }
}
