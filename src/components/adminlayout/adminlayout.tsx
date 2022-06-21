import React from "react"
import Header from "../header/header"
import LeftMenu from "../leftmenu/leftmenu"
import SEO from "../seo/seo"

const AdminLayout: React.FC<{ title: string }> = ({ title, children }) => {
    return (
        <div className="body-wrapper">
            <SEO title={title} />
            <Header title={title} />
            <LeftMenu />
            <div className="content">
                <div className="container-fluid">
                    <main>{children}</main>
                </div>
            </div>
            <div className="copyright">
                COPYRIGHT © 2021 CARY, All rights Reserved.
            </div>
        </div>
    )
}
export default AdminLayout
