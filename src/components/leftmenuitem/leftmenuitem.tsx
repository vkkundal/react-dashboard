import React from "react"
import { Link } from "gatsby"
import { useLocation } from "@reach/router"
import { IStoreState } from "../../reducers"
import { useSelector } from "react-redux"

type ILeftMenuItemProps = {
    to?: string
    text: string
    icon: React.ReactElement
    exact?: boolean
    onClick?: (e: React.MouseEvent) => void
}

export const LeftMenuItem = ({
    to,
    text,
    icon,
    onClick,
    exact 
}: ILeftMenuItemProps) => {



    const authArray = useSelector(
        (state: IStoreState) => { 
        
        return state.authState.authDetails 
    }
    )

    let obj = authArray?.find(o => o.menu.toLowerCase() === text.toLocaleLowerCase());
 
    const location = useLocation()
    const getActiveClass = () => {
        const activeClass = "active"
        let path = location.pathname
        if (location.pathname.includes("detail")) {
            path = path.split("detail")[0]
        }
     
        if (to === path || path + "/" === to) {
           
            return activeClass
        }
        if(to && !exact){
            if(path.includes(to)){
                return activeClass
            }
        }
       

        return ""
    }
    
    if(obj?.read == false) return null;

    if (!to) { 
        return <li>
            <a href={"/"} onClick={onClick} className={`nav-icons d-flex `}>
                <span
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{ width: 20 }}
                >
                    {icon}
                </span> 
                <span>{text}</span>
            </a>
        </li>
    }

    return (
        <li>
            <Link to={to} className={`nav-icons d-flex ${getActiveClass()}`}>
                <span
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{ width: 20 }}
                >
                    {icon}
                </span>
                <span>{text}</span>
            </Link>
        </li>
    )
}
