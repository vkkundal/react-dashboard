import { Paper } from "@material-ui/core"
import Button from "components/button/button"
import InputGroup from "components/inputgroup/inputgroup"
import { AllCarMakes } from "helpers/interfaces"
import { useInputState } from "hooks/useInputState"
import { usePost } from "hooks/usePost"
import { usePut } from "hooks/usePut"
import React from "react"
import { createPortal } from "react-dom"
import { useToasts } from "react-toast-notifications"
import { handleErrors, validateFields } from "helpers/helpers"

export const AddCarMakePopup = ({
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
        name_ar: string
    }>(`/api/v2/cars/makes`)

    const { isSending: isPutting, put } = usePut<{
        name: string
        name_ar: string
    }>(`/api/v2/cars/makes/${editItem?.id}`)

    const [car_name, onChangeCarid] = useInputState(editItem?.name)
    const [name_ar, setYearfrom] = useInputState(editItem?.name_ar)
    const { addToast } = useToasts()
    const handleAddition = async () => {



        const data: { name: string , name_ar: string } = {
            name: car_name, 
            name_ar: name_ar
        };

        const arrayClientErrors = validateFields(data,addToast);


        try {

            
            if (editItem) {
                await put({ ...data })
                addToast("Car Make Updated", {
                    autoDismiss: true,
                    appearance: "success",
                })
            } else {
                await post({
                    ...data
                })
                addToast("Car Make Added", {
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
                                        Edit <span>Car make</span>
                                    </h2>
                                ) : (
                                    <h2 className="popup-heading">
                                        Add a new <span>Car make</span>
                                    </h2>
                                )}
                            </div>
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="text"
                                disabled={isCreating}
                                name="first_name"
                                value={car_name}
                                onChange={onChangeCarid}
                                label="Name"
                            />
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="text"
                                name="last_name"
                                disabled={isCreating}
                                value={name_ar}
                                onChange={setYearfrom}
                                label="Name_Ar"
                            />

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
