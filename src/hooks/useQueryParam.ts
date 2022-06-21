import qs from "querystring"
import { useEffect, useState } from "react"
export const useQueryParam = (name: string) => {
    const [location, setLocation] = useState(() => typeof window === "undefined"? { search: "" }: window.location)
    const parsedObj = qs.parse(
        location.search.slice(1, location.search.length).toLowerCase()
    )
    useEffect(() => {
        if(!location.search){
            setLocation(window.location)
        }
    }, [])
    return parsedObj[name.toLowerCase()] as string
}
