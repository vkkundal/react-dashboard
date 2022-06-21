import React from "react"
import { useSelector } from "react-redux"
import { IStoreState } from "../../reducers"
import LoadingPage from "../loadingpage/loadingpage"

const withAuth = <T,>(Comp: React.ComponentType<T>) => {
    const CheckAuth = (props: T) => {
        const isLoggedIn = useSelector(
            (state: IStoreState) => state.authState.userLoggedIn
        )


        if (isLoggedIn) {
            return <Comp {...props} />
        }
        return <Comp {...props} />
    }
    return CheckAuth
}

export default withAuth
