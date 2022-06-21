import { Reducer } from "redux";
import { IAuthActions, USER_DETAILS_SUCCESS, USER_LOGIN, USER_LOGOUT ,  AUTH_DETAILS_SUCCESS} from "../actions";
import { IUser , AuthMenu } from "../helpers/interfaces";

export type IAuthState = {
    userLoggedIn: boolean;
    userDetails: IUser | null
    authDetails : AuthMenu[]  | null
}


const INITIAL_STATE = { userLoggedIn: false, userDetails: null , authDetails: null}

const authReducer: Reducer<IAuthState, IAuthActions> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_LOGIN: {
            return {
                ...state,
                userLoggedIn: true,

            }
        }
        case USER_LOGOUT: {
            return INITIAL_STATE;
        }
        case USER_DETAILS_SUCCESS: {
            return {
                ...state,
                userDetails: action.payload
            }
        }
        
        case AUTH_DETAILS_SUCCESS: {
            return {
                ...state,
                authDetails: action.payload
            }
        }
        default: {
            return state;
        }
    }

}



export default authReducer;