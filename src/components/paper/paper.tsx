import React from "react"

export const Paper = (
    props: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >
) => {
    const { className = "" } = props
    return <div {...props} className={`paper ${className}`} />
}
