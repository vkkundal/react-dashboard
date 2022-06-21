import React, { useState } from "react"
import { Paper } from "../paper/paper"
import InputGroup from "components/inputgroup/inputgroup"
import Switch from "react-ios-switch"
import Button from "components/button/button"
import { usePost } from "hooks/usePost"
import { useQueryParam } from "hooks/useQueryParam"
import { useToasts } from "react-toast-notifications"
import { handleErrors, validateFields } from "helpers/helpers"

export interface AddServiceRequest {
    service_type_id: number
    name: string
    name_ar: string
    price: number
    is_active: boolean
    unique_identifier: string
}

const Addservice = ({
    onAdd,
    onClose,
}: {
    onAdd?: () => void
    onClose?: () => void
}) => {
    const [name, setName] = useState("")
    const [name_ar, setNameAr] = useState("")
    const [unique_identifier, setUniqueid] = useState("")
    const [price, setPrice] = useState("")
    const [isActive, setIsActive] = useState(false)

    const { isSending, post } = usePost<AddServiceRequest>("/api/v2/services/")

    const service_type_id = useQueryParam("id")

    const { addToast } = useToasts()

    const handleAdd = async () => {

        const data = {
            is_active: isActive,
            name: name,
            name_ar,
            price: parseFloat(price),
            service_type_id: parseInt(service_type_id),
            unique_identifier: unique_identifier
        }
      
        const arrayClientErrors = validateFields(data,addToast);

        try {
            await post({ ...data } )
            addToast("Details Saved", {
                autoDismiss: true,
                appearance: "success",
            })
            onAdd && onAdd()
            onClose && onClose()
        } catch (e) {

            handleErrors(e , addToast , arrayClientErrors)
           
        }
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Paper
                            className="p-5"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    Add a new <span>Service</span>
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
                                        value={price}
                                        disabled={isSending}
                                        onChange={e => setPrice(e.target.value)}
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
                                            setUniqueid(e.target.value)
                                        }
                                        name="unique_identifier"
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

export default Addservice
