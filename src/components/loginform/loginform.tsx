import React, { useState } from "react"
import Button from "../button/button"
import InputGroup from "../inputgroup/inputgroup"
import { useToasts } from "react-toast-notifications"
import { useDispatch } from "react-redux"
import { fetchCurrentUserDetails, handleUserLogin } from "../../actions"
import { useTranslation } from "react-i18next"
import { TranslationKeys } from "../../translations"

export default function LoginForm() {
    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [checking, setChecking] = useState(false)

    const { addToast } = useToasts()
    const { t } = useTranslation<TranslationKeys>()

    const dispatch = useDispatch()
    const handleSignIn = async () => {
        setChecking(true)

        const onSuccess = () => {
           
            addToast("Login Success", {
                autoDismiss: true,
                appearance: "success",
            })
        }

        const onFail = () => {
            setChecking(false)
            addToast("Invalid Email or Password", {
                autoDismiss: true,
                appearance: "error",
            })
        }
        const onLoginSuccess = () => {
            dispatch(fetchCurrentUserDetails({ onSuccess, onFail }))
        }
        dispatch(
            handleUserLogin({
                email,
                password,
                onSuccess: onLoginSuccess,
                onFail,
            })
        )
    }

    return (
        <div className="login-form">
            <h2 className="text-center mb-4">Login</h2>
            <div className="loginform">
                <InputGroup
                    labelClass="email"
                    wrapperClass="mb-2"
                    type="text"
                    name="username"
                    placeholder=""
                    label="Username"
                    disabled={checking}
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value)
                    }}
                />
                <InputGroup
                    labelClass="password"
                    wrapperClass="mb-5"
                    type="password"
                    name="password"
                    disabled={checking}
                    placeholder=""
                    label="Password"
                    value={password}
                    inputProps={{onKeyPress: (e) => {
                        if(e.key === "Enter"){
                            handleSignIn()
                        }
                    }}}
                    onChange={e => {
                        setPassword(e.target.value)
                    }}
                />
                <Button
                    className="btn-block"
                    onClick={handleSignIn}
                    loading={checking}
                >
                    {t("login")}
                </Button>
            </div>

            <div className="fp mt-5 mb-2 text-center">
                <a href="#" className="fp">
                    Forgot password?
                </a>
            </div>
        </div>
    )
}
