import React, { useEffect, useState } from "react"
import Layout from "../components/layout/layout"
import LoadingPage from "../components/loadingpage/loadingpage"
import LoginForm from "../components/loginform/loginform"
import LoginHeader from "../components/loginheader/loginheader"
import SEO from "../components/seo/seo"

const IndexPage = () => {

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            // verify token is still valid
            
            // if valid go to dashboard
        }else {
            setIsReady(true);
        }
    }, [])
    if(!isReady){
        return <LoadingPage />
    }
    
    return (
        <Layout>
            <SEO title="Admin Panel" />
            <LoginHeader />
            <section className="login-page">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-5"> 
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default IndexPage
