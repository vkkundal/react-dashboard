import React from "react"
import { HiMenuAlt4 } from "react-icons/hi"
import { useSelector } from "react-redux"
import { IStoreState } from "../../reducers"

const Header = ({ title }: { title: string }) => {
    const userDetails = useSelector(
        (state: IStoreState) => state.authState.userDetails
    )

    return (
        <div className="header-admin">
            <div className="Mobile-nav">
                <HiMenuAlt4></HiMenuAlt4>
            </div>
            <div className="page-name">
                <span>{title}</span>
            </div>
            <div className="user-name">
                {userDetails && (
                    <span>
                        {userDetails.first_name} {userDetails.last_name}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Header
