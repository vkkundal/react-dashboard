import { combineReducers } from "redux";
import authReducer ,{IAuthState} from "./authReducer";

export type IStoreState = {
    authState: IAuthState
}

export const rootReducer = combineReducers<IStoreState >({
    authState: authReducer,
})