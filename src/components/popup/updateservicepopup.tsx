import React, { useState } from "react"
import { Paper } from "../paper/paper"
import InputGroup from "components/inputgroup/inputgroup"

import Switch from "react-ios-switch"
import Button from "components/button/button"
import { usePut } from "hooks/usePut"
import { AddServiceRequest } from "./addnewservice"
import { useQueryParam } from "hooks/useQueryParam"
import { useToasts } from "react-toast-notifications"
import { IServiceType } from "helpers/interfaces"

const Servicepopup = ({
    onAdd,
    onClose,
    service
}: {
    onAdd?: () => void
    service: IServiceType
    onClose?: () => void
}) => {
    const [name, setName] = useState(service.name)
    const [name_ar, setNameAr] = useState(service.name_ar)
    const [unique_identifier, setUniqueidentifier] = useState(service.unique_identifier)
    const [price, setPrice] = useState(service.price)
    const [isActive, setIsActive] = useState(service.is_active)

    const { isSending, put } = usePut<AddServiceRequest>("/api/v2/services/"+ service.id)

    const service_type_id = useQueryParam("id")

    const { addToast } = useToasts()

    const handleAdd = async () => {
        try {
            await put({
                is_active: isActive,
                name: name,
                name_ar,
                price: price,
                service_type_id: parseInt(service_type_id),
                unique_identifier: unique_identifier
            })
            addToast("Details Updated", {
                autoDismiss: true,
                appearance: "success",
            })
            onAdd && onAdd()
            onClose && onClose()
        } catch (e) {
            addToast("An Error Occurred", {
                autoDismiss: true,
                appearance: "error",
            })
        }
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7">
                        <Paper
                            className="p-5"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    Update <span>Service</span>
                                </h2>
                            </div>
                            <div className="row justify-content-center mt-4">
                                <div className="col-md-6">
                                    <InputGroup
                                        labelClass="popup-label popup-name"
                                        wrapperClass="mb-2"
                                        type="text"
                                        name="Name"
                                        value={name}
                                        disabled={isSending}
                                        onChange={e => setName(e.target.value)}
                                        label="Name"
                                    />
                                    <InputGroup
                                        labelClass="popup-label popup-quality mt-2"
                                        wrapperClass="mb-2 mt-2"
                                        type="number"
                                        value={price.toFixed()}
                                        disabled={isSending}
                                        onChange={e => setPrice(parseFloat(e.target.value))}
                                        name="Price"
                                        label="Price"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <InputGroup
                                        labelClass="popup-label popup-name-ar"
                                        wrapperClass="mb-2"
                                        type="text"
                                        disabled={isSending}
                                        value={name_ar}
                                        onChange={e =>
                                            setNameAr(e.target.value)
                                        }
                                        name="Name_Ar"
                                        label="Name_Ar"
                                    />
                                    <InputGroup
                                        labelClass="popup-label popup-name-ar"
                                        wrapperClass="mb-2 mt-3"
                                        type="text"
                                        disabled={isSending}
                                        value={unique_identifier}
                                        onChange={e =>
                                            setUniqueidentifier(e.target.value)
                                        }
                                        name="Unique Identifier"
                                        label="Unique Id"
                                    />
                                </div>
                            
                                <div className="col-md-6">
                                    
                                    <div className=" my-4 text-center mt-5">
                                        <span className="popup-switch mr-2">
                                            Is Active
                                        </span>
                                        <Switch
                                            checked={isActive}
                                            handleColor="white"
                                            offColor="white"
                                            onColor="#007BFF"
                                            onChange={() =>
                                                setIsActive(val => !val)
                                            }
                                        />
                                    </div>
                                </div>
                            
                            </div>

                            <div className="Add-user text-center">
                                <Button
                                    onClick={handleAdd}
                                    loading={isSending}
                                    className="mt-5 text-center popup-button"
                                >
                                    Update
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

export default Servicepopup
