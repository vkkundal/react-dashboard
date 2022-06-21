import React, { useEffect, useState } from "react"
import { Paper } from "../paper/paper"
import InputGroup from "../inputgroup/inputgroup"
import { createPortal } from "react-dom"
import Button from "../button/button"
import Switch from "react-ios-switch"
import { createNewAdmin, fetchAdminRoles } from "../../helpers/helpers"
import { IRole } from "../../helpers/interfaces"
import { useToasts } from "react-toast-notifications"
import { useInputState } from "hooks/useInputState"
import SelectInput from "../../components/Selectinput/selectinput"
import { handleErrors, validateFields } from "helpers/helpers"


const Adminpopup = ({
    onClose,
    onAdd,
}: {
    onClose?: () => void
    onAdd?: () => void
}) => {
    const [firstname, setFirstName] = useInputState()
    const [lastName, setlastName] = useInputState()
    const [email, setemail] = useInputState()
    const [mobile, setmobile] = useInputState()

    const [isActive, setIsActive] = useState(false)
    const [role, setRole] = useState(4)

    const [password, setPassword] = useInputState()
    const [roles, setRoles] = useState<IRole[]>([])
    const [isCreating, setIsCreating] = useState(false)
    const { addToast } = useToasts()

    const handleAddition = async () => {
        setIsCreating(true)


        const data = {
            email,
            first_name: firstname,
            last_name: lastName,
            is_active: isActive,
            mobile,
            password,
            role_id: role,
        }

        const arrayClientErrors = validateFields(data,addToast);


        try {
            if (1) {
                await createNewAdmin({
                    ...data
                })
                addToast("A new Admin Created", {
                    autoDismiss: true,
                    appearance: "success",
                })
                onAdd && onAdd()
                onClose && onClose()
            }
        } catch (e) {

            handleErrors(e , addToast , arrayClientErrors)
            
        } finally {
            setIsCreating(false)
        }
    }

    useEffect(() => {
        fetchAdminRoles().then(setRoles)
    }, [])

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <Paper
                            onClick={e => e.stopPropagation()}
                            className="p-5"
                        >
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    Add a new <span>Admin</span>
                                </h2>
                            </div>
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="text"
                                disabled={isCreating}
                                name="first_name"
                                value={firstname}
                                onChange={setFirstName}
                                label="First Name"
                            />
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="text"
                                name="last_name"
                                disabled={isCreating}
                                value={lastName}
                                onChange={setlastName}
                                label="Last Name"
                            />
                            <InputGroup
                                labelClass="popup-mobile"
                                wrapperClass="mb-2"
                                type="number"
                                name="mobile"
                                disabled={isCreating}
                                value={mobile}
                                onChange={setmobile}
                                label="Mobile"
                            />
                            <InputGroup
                                labelClass="popup-email"
                                wrapperClass="mb-2 "
                                type="email"
                                name="email"
                                disabled={isCreating}
                                value={email}
                                onChange={setemail}
                                label="Email"
                            />
                            <InputGroup
                                labelClass="popup-password"
                                wrapperClass="mb-2 "
                                type="password"
                                name="password"
                                disabled={isCreating}
                                value={password}
                                onChange={setPassword}
                                label="Password"
                            />
                            <div className="User-role">
                            <label className="popup-role">Role</label>
                                <SelectInput
                                    disabled={isCreating}
                                    onChange={(e :React.ChangeEvent)=> {
                                        setRole((e.target as HTMLInputElement).value as any)
                                    }}
                                    name="role"
                                    className="input popup-select"
                                >
                                    {roles.map((roleobj, i) => {
                                        return (
                                            <option
                                                key={roleobj.name}
                                                value={roleobj.id}
                                                selected={roleobj.id === role}
                                            >
                                                {roleobj.name}
                                            </option>
                                        )
                                    })}
                                </SelectInput>
                            </div>

                            <div className="popup-status text-center mt-2">
                                <span className="popup-switch mr-2">
                                    Is Active{" "}
                                </span>
                                <Switch
                                    checked={isActive}
                                    handleColor="white"
                                    offColor="white"
                                    onChange={() => setIsActive(val => !val)}
                                    onColor="#007BFF"
                                />
                            </div>
                            <div className="Add-user text-center">
                                <Button
                                    loading={isCreating}
                                    onClick={handleAddition}
                                    variant="green"
                                    className="mt-5 text-center popup-button"
                                >
                                    Add
                                </Button>
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default Adminpopup
