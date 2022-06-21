import React from "react";
import Logo from "../logo/logo";


export default function LoginHeader(){
    return <header className="loginheader">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-2 login">
                    <Logo variant="light" />
                </div>
            </div>
        </div>
    </header>
}