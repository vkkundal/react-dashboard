import React, { useEffect, useState } from "react"
import { usePost } from "hooks/usePost"
import { Paper } from "../paper/paper"
import { IProviderType } from "../../helpers/interfaces"
import InputGroup from "components/inputgroup/inputgroup"
import { useToasts } from "react-toast-notifications"
import produce from "immer"
import { handleErrors, passTargetVal, validateFields } from "helpers/helpers"
import Button from "components/button/button"
import { IRole } from "../../helpers/interfaces"
import { useGet } from "hooks/useGet"
import Switch from "react-ios-switch"

export const AddProviderTypePopup = ({
    onClose,
    onAdd,
    page,
    last_name,
    first_name,
    mobile,
    order_by,
    order,
}: {
    onClose: () => void
    onAdd?: ({}) => void
    page: number
    last_name: string | undefined
    first_name: string | undefined
    mobile: string | undefined
    order_by: string | undefined
    order: 0 | 1
}) => {
    const [state, setState] = useState<Omit<IProviderType, "id">>({
        first_name: "",
        last_name: "",
        mobile: "",
        iban: "",
        is_scheduled: false
    })
    const { isSending, post } = usePost<Omit<IProviderType, "id"> & {role_id: number}>(`/api/v2/providers/`)

    const { data: roles, isReady } = useGet<IRole[]>(
        `/api/v2/providers/roles`,
        []
    )
    const [role_id, setRoleId] = useState(0)
    useEffect(() => {
        if (isReady) {
            setRoleId(roles[0].id)
        }
    }, [isReady])
    const { addToast } = useToasts()

    const handleAdd = async () => {
        const { ...data } = state

        const arrayClientErrors = validateFields(data,addToast);


        try {
            await post({ ...data, role_id })
            addToast("Provider Added", {
                autoDismiss: true,
                appearance: "success",
            })
            onAdd && onAdd({page,
                first_name,
                last_name,
                mobile,
                order,
                order_by,
            })
            onClose && onClose()
        } catch (e) {


            handleErrors(e , addToast , arrayClientErrors)

        }
    }

    return (
        <div className="popup-overlay">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <Paper className="p-5">
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    Add a new <span>Provider</span>
                                </h2>
                            </div>
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="text"
                                name="first_name"
                                label="First Name"
                                onChange={passTargetVal(val =>
                                    setState(old =>
                                        produce(old, draft => {
                                            draft.first_name = val
                                        })
                                    )
                                )}
                                disabled={isSending}
                                value={state.first_name}
                            />
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="text"
                                name="last_name"
                                label="Last Name"
                                onChange={passTargetVal(val =>
                                    setState(old =>
                                        produce(old, draft => {
                                            draft.last_name = val
                                        })
                                    )
                                )}
                                disabled={isSending}
                                value={state.last_name}
                            />
                            <InputGroup
                                labelClass="popup-mobile"
                                wrapperClass="mb-2"
                                type="number"
                                name="mobile"
                                label="Mobile"
                                onChange={passTargetVal(val =>
                                    setState(old =>
                                        produce(old, draft => {
                                            draft.mobile = val
                                        })
                                    )
                                )}
                                disabled={isSending}
                                value={state.mobile}
                            />
                            <InputGroup
                                labelClass="popup-mobile"
                                wrapperClass="mb-2"
                                type="text"
                                name="iBan"
                                label="iBan"
                                onChange={passTargetVal(val =>
                                    setState(old =>
                                        produce(old, draft => {
                                            draft.iban = val
                                        })
                                    )
                                )} 
                                disabled={isSending}
                                value={state.iban}
                            />
                             <div className="User-role">
                                <label className="popup-role">Role</label>
                                <select
                                    value={role_id}
                                    onChange={e =>
                                        setRoleId(parseInt(e.target.value))
                                    }
                                    name="role"
                                    className="popup-select"
                                >
                                    {roles.map(role => {
                                        return (
                                            <option
                                                key={role.id}
                                                value={role.id}
                                            >
                                                {role.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div> 
                            <div className="popup-status text-center mt-5">
                                <span className="popup-switch mr-2">
                                    Is Scheduled
                                </span>
                                <Switch
                                    checked={state.is_scheduled}
                                    handleColor="white"
                                    offColor="white"
                                    onChange={() => setState(old => ({...old, is_scheduled: !old.is_scheduled}))}
                                    onColor="#007BFF"
                                />
                            </div>
                            <div className="Add-user text-center">
                                <Button
                                    onClick={handleAdd}
                                    loading={isSending}
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
        </div>
    )
}
