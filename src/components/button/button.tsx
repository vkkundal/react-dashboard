import React from "react"
import Spinner from "../spinner/spinner"
import { Link } from "gatsby"
type IButtonProps = {
    loading?: boolean
    variant?: "green" | "purple" | "outline"
} & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>

export const LinkButton = ({
    to,
    loading,
    className,
    variant,
    children,
}: {
    to: string
    loading?: boolean
    className: string
    variant?: "green" | "purple"
    children: React.ReactNode
}) => {
    return (
        <Link
            className={`btn ${className || ""} btn-${variant} ${
                loading ? "disabled" : ""
            }`}
            to={to}
        >
            {children}
        </Link>
    )
}

 function Button({ loading, variant, ...props }: IButtonProps) {
  
    return (
        <React.Fragment>
            {(variant === "outline" && (
                <button {...props} className={`btn-${variant}`}>
                    {loading ? <Spinner /> : props.children}
                </button>
            )) || (
                <button
                    {...props}
                    className={`btn ${
                        props.className || " Add-btn"
                    } btn-${variant}`}
                >
                    {loading ? <Spinner /> : props.children}
                </button>
            )}
        </React.Fragment>
    )
}

export default React.memo(Button)