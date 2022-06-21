import { Paper } from "@material-ui/core"
import Button from "components/button/button"
import InputGroup from "components/inputgroup/inputgroup"
import { AllCarMakes } from "helpers/interfaces"
import { useInputState } from "hooks/useInputState"
import { usePost } from "hooks/usePost"
import { usePut } from "hooks/usePut"
import React , { useState } from "react"
import { createPortal } from "react-dom"
import { useToasts } from "react-toast-notifications"
import { handleErrors, validateFields } from "helpers/helpers"
import Switch from "react-ios-switch"

export const AddNewCarProvider = ({
    onClose,
    onDone,
    editItem,
}: {
    editItem?: AllCarMakes
    onClose?: () => void
    onDone?: () => void
}) => {
    const { isSending, post } = usePost<{
        name: string
        is_cary: boolean
        is_active : boolean
    }>(`/api/v2/providers/vehicles`)

    const { isSending: isPutting, put } = usePut<{
        name: string
        name_ar: string

    }>(`/api/v2/cars/makes/${editItem?.id}`)
    
    const [isActive, setIsActive] = useState(false)
    const [isCary, setIsCary] = useState(false)

    const [name, onChangeCarid] = useInputState(editItem?.name)
    const { addToast } = useToasts()
    const handleAddition = async () => {

        const data: {
            name : string,
            is_cary : boolean,
            is_active : boolean            
        } = {
            name: name, 
            is_cary: isCary,
            is_active: isActive,
            
        };

        const arrayClientErrors = validateFields(data,addToast);

        try {
            
            if (editItem) {
                await put({ ...data as any })
                addToast("Car Make Updated", {
                    autoDismiss: true,
                    appearance: "success",
                })
            } else {
                await post({
                    ...data
                })
                addToast("Vehicle Added", {
                    autoDismiss: true,
                    appearance: "success",
                })
            }
            onDone && onDone()
            onClose && onClose()
        } catch (e) {

            handleErrors(e , addToast , arrayClientErrors)

        }
    }
    const isCreating = isSending || isPutting
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
                                {editItem ? (
                                    <h2 className="popup-heading">
                                        Edit <span>Vehicle </span>
                                    </h2>
                                ) : (
                                    <h2 className="popup-heading">
                                        Create a new <span>Vehicle </span>
                                    </h2>
                                )}
                            </div>
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="text"
                                disabled={isCreating}
                                name="name"
                                value={name}
                                onChange={onChangeCarid}
                                label="Name"
                            />
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
                             <div className="popup-status text-center mt-2">
                                <span className="popup-switch mr-2">
                                    Is Cary{" "}
                                </span>
                                <Switch
                                    checked={isCary}
                                    handleColor="white"
                                    offColor="white"
                                    onChange={() => setIsCary(val => !val)}
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
                                    {editItem ? "Update": "Add"}
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
