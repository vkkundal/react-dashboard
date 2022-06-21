import React, { useState } from "react"
import { Paper } from "../paper/paper"
import { IServiceDetail } from "../../helpers/interfaces"
import InputGroup from "components/inputgroup/inputgroup"
import { usePost } from "hooks/usePost"
import produce from "immer"
import { passTargetVal } from "helpers/helpers"

import Switch from "react-ios-switch"
import Button from "components/button/button"
import { useToasts } from "react-toast-notifications"
import { navigate } from "gatsby"
import { handleErrors, validateFields } from "helpers/helpers"

export const AddServiceTypePopup = ({
    onClose,
    onAdd,
}: {
    onClose: () => void
    onAdd?: () => void
}) => {
    const [state, setState] = useState<IServiceDetail>({
        name: "",
        name_ar: "",
        requires_car: true,
        is_active: true,
        description: "",
        description_ar: "",
        id: 0,
        is_scheduled: false,
    })

    const { isSending, post } = usePost(`/api/v2/services/types`)

    const { addToast } = useToasts()

    const handleAdd = async () => {
        const { id, ...data } = state
        const arrayClientErrors = validateFields(data, addToast)

        try {
            const result = await post({ ...data })
            addToast("A new Service Type Added", {
                autoDismiss: true,
                appearance: "success",
            })

            onAdd && onAdd()
            onClose && onClose()
            navigate(`/dashboard/servicesdetail?id=${result.data.id}`)
        } catch (e) {
            handleErrors(e, addToast, arrayClientErrors)
        }
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="container">
                <div className="row justify-content-center text-center">
                    <div className="col-md-8">
                        <Paper
                            className="p-5 align-content-center bg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    Add a new <span> SERVICE TYPE </span>
                                </h2>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <InputGroup
                                        labelClass="popup-label popup-name"
                                        wrapperClass="mb-4"
                                        type="text"
                                        name="full_name"
                                        label="Name"
                                        onChange={passTargetVal(val =>
                                            setState(old =>
                                                produce(old, draft => {
                                                    draft.name = val
                                                })
                                            )
                                        )}
                                        disabled={isSending}
                                        value={state.name}
                                    />
                                    <InputGroup
                                        labelClass="popup-label "
                                        wrapperClass="mb-2 "
                                        type="text"
                                        name="Description"
                                        label="Description"
                                        onChange={passTargetVal(e =>
                                            setState(old =>
                                                produce(old, draft => {
                                                    draft.description = e
                                                })
                                            )
                                        )}
                                        disabled={isSending}
                                        value={state.description}
                                    />
                                    <div className=" my-4">
                                        <span className="popup-switch mr-2 ">
                                            Requires Car{" "}
                                        </span>
                                        <Switch
                                            checked={state.requires_car}
                                            handleColor="white"
                                            offColor="white"
                                            onChange={() =>
                                                setState(old =>
                                                    produce(old, draft => {
                                                        draft.requires_car = !old.requires_car
                                                    })
                                                )
                                            }
                                            onColor="#007BFF"
                                        />
                                    </div>
                                    <div className="popup-status text-center mt-5">
                                        <span className="popup-switch mr-2">
                                            Is Scheduled
                                        </span>
                                        <Switch
                                            checked={state.is_scheduled}
                                            handleColor="white"
                                            offColor="white"
                                            onChange={() =>
                                                setState(old => ({
                                                    ...old,
                                                    is_scheduled: !old.is_scheduled,
                                                }))
                                            }
                                            onColor="#007BFF"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <InputGroup
                                        labelClass="popup-label popup-name-ar"
                                        wrapperClass="mb-4"
                                        type="text"
                                        name="Name_ar"
                                        label="Name_ar"
                                        disabled={isSending}
                                        onChange={passTargetVal(e =>
                                            setState(old =>
                                                produce(old, draft => {
                                                    draft.name_ar = e
                                                })
                                            )
                                        )}
                                        value={state.name_ar}
                                    />

                                    <InputGroup
                                        labelClass="popup-label popup-description-ar"
                                        wrapperClass="mb-2"
                                        type="text"
                                        name="Description_ar"
                                        label="Description_ar"
                                        onChange={passTargetVal(e =>
                                            setState(old =>
                                                produce(old, draft => {
                                                    draft.description_ar = e
                                                })
                                            )
                                        )}
                                        disabled={isSending}
                                        value={state.description_ar}
                                    />

                                    <div className=" my-4">
                                        <span className="popup-switch mr-2">
                                            Is Active{" "}
                                        </span>
                                        <Switch
                                            checked={state.is_active}
                                            handleColor="white"
                                            offColor="white"
                                            onChange={() =>
                                                setState(old =>
                                                    produce(old, draft => {
                                                        draft.is_active = !old.is_active
                                                    })
                                                )
                                            }
                                            onColor="#007BFF"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="popup-status text-center mt-2"></div>

                            <div className="Add-user text-center">
                                <Button
                                    onClick={handleAdd}
                                    loading={isSending}
                                    className="mt-5 text-center popup-button"
                                >
                                    Add
                                </Button>
                                <Button onClick={onClose} variant="outline">
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
