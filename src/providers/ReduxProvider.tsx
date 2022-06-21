import React, { useEffect } from "react"
import { Provider } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import { rootReducer } from "../reducers"
import thunk from "redux-thunk"
import { FirebaseProvider } from "./FirebaseProvider"
import {
    fetchCurrentUserDetails,
    handleUserLogout,
    userLogin,
    userAuthStateFetchSuccess,
} from "actions"
import { navigate } from "gatsby"
import { authToken } from "helpers/Constants"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import momentUtils from "@date-io/moment"
const store = createStore(rootReducer, applyMiddleware(thunk))

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    const dispatch = store.dispatch as any
    useEffect(() => {
        const token = localStorage.getItem(authToken)
        if (token) {
            dispatch(
                fetchCurrentUserDetails({
                    onSuccess: () => {
                        dispatch(userLogin())
                        dispatch(
                            userAuthStateFetchSuccess(
                                JSON.parse(token).authorizations
                            )
                        )
                    },

                    onFail: () => {
                        dispatch(userLogin())
                        dispatch(
                            userAuthStateFetchSuccess(
                                JSON.parse(token).authorizations
                            )
                        )
                    },
                })
            )
        } else {
            navigate("/cars")
        }
    }, [])
    return (
        <FirebaseProvider>
            <MuiPickersUtilsProvider utils={momentUtils}>
                <Provider store={store}>{children}</Provider>
            </MuiPickersUtilsProvider>
        </FirebaseProvider>
    )
}
