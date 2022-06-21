import { USER_DETAILS_SUCCESS, USER_LOGIN, USER_LOGOUT , AUTH_DETAILS_SUCCESS } from "./types"
import { api } from "../api"
import { APP_THUNK, IUser , AuthMenu } from "../helpers/interfaces"
import { authToken } from "../helpers/Constants"
import { navigate } from "gatsby"
export const userLogin = () => {
    return {
        type: USER_LOGIN,
    }
}

export const userLogout = () => {
    return {
        type: USER_LOGOUT,
    }
}


export const userDetailsFetchSuccess = (details: IUser) => {
    return {
        type: USER_DETAILS_SUCCESS,
        payload: details
    }
}


export const userAuthStateFetchSuccess = (details: AuthMenu[]) => {
    return {
        type: AUTH_DETAILS_SUCCESS,
        payload: details
    }
}

export const handleUserLogin = ({
    email,
    password,
    onSuccess = () => { }
    , onFail = () => { }
}: {
    email: string
    password: string
    onSuccess?: () => void
    onFail?: (resp?: any) => void
}): APP_THUNK => {
    return async (dispatch) => {
        try {
            const result = await api.post("/api/v2/auth/admins/login", { email, password });
            if (result.status === 200) {
                localStorage.setItem(authToken, JSON.stringify(result.data))
                navigate("/dashboard")
                dispatch(userLogin())
                dispatch(userAuthStateFetchSuccess(result.data.authorizations));

                onSuccess()

                return result.data;
            } else {
                localStorage.removeItem(authToken);
                onFail(result.data);
            }
        } catch (e) {
            localStorage.removeItem(authToken);
            onFail()
        }

    }
}

export const handleUserLogout = ({ onFail = () => { }, onSuccess = () => { } }: {
    onSuccess?: () => void
    onFail?: (resp?: any) => void
}): APP_THUNK => async (dispatch) => {

    try {
        await api.post('/api/v2/auth/logout');
        localStorage.removeItem(authToken)
        dispatch(userLogout())
        
        onSuccess()
    } catch (e) {
        localStorage.removeItem(authToken)
        dispatch(userLogout())
        onFail()
    }
}


export const fetchCurrentUserDetails = ({ onFail = () => { }, onSuccess = () => { } }: {
    onSuccess?: () => void
    onFail?: (resp?: any) => void
}): APP_THUNK => async (dispatch) => {
    try {
        const result = await api.get(`/api/v2/users/me`);

        console.log(result.data)
        dispatch(userDetailsFetchSuccess(result.data));
        onSuccess()
    } catch (e) {
        onFail()
    }

}

export type IAuthActions =
    | ReturnType<typeof userLogin>
    | ReturnType<typeof userLogout>
    | ReturnType<typeof userDetailsFetchSuccess>
    | ReturnType<typeof userAuthStateFetchSuccess>
    
