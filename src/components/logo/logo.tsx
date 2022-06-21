import { graphql, useStaticQuery } from "gatsby"
import React from "react"

type ILogoProps = {
    variant?: "dark" | "light"
}

 function Logo({variant = "dark"}: ILogoProps) {
    const data = useStaticQuery(graphql`
        query {
            logo: file(relativePath: { eq: "logo.svg" }) {
                publicURL
            }
            logolight: file(relativePath: { eq: "logo-light.svg" }) {
                publicURL
            }
        }
    `)
    return <img className="img-fluid" src={data[variant === "dark" ? "logo": "logolight"].publicURL} />
}


export default React.memo(Logo)