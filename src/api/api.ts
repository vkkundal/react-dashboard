import axios from "axios";
import { authToken } from "../helpers/Constants";

const BACKEND_MAP = {
    "DEV":  'https://cary-ksa-dev.herokuapp.com',
    "STAGING":  'https://cary-ksa-staging.herokuapp.com',
    "PRODUCTION": 'https://cary-ksa.herokuapp.com'
}
export const api = axios.create({
    baseURL: BACKEND_MAP[process.env.GATSBY_ENV as "DEV"],
    // @ts-ignore
    transformRequest: [...axios.defaults.transformRequest,(data, headers) => {
        let res: string | { access_token: string } | null = localStorage.getItem(authToken);
        if (typeof res === "string") {
            res = JSON.parse(res) as { access_token: string };
            headers["Authorization"] = "Bearer " + res.access_token;
        }
        return data
    }],
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': process.env.GATSBY_X_API_KEY,
    }
})