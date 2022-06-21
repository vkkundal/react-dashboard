/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// You can delete this file if you're not using it
import React from "react"
import { ToastProvider } from "react-toast-notifications"
import { ReduxProvider } from "./src/providers"
import "./src/scss/includes.scss"
import "./src/i18n"
export const wrapRootElement = ({ element }) => {
    return (
        <ToastProvider>
            <ReduxProvider>{element}</ReduxProvider>
        </ToastProvider>
    )
}
